import fs from 'node:fs/promises'
import { collectionObject } from '../collectionObject.js'
import { calculateMatchScore } from '../../../assets/calculateMatchScore.js'
import { CollectionObjectType } from '../../../types/collection'
import { ID } from '../../../types/objects'
import { changeToArray } from '../../../assets/changeToArray.js'
import path from 'node:path'
import { __dirname } from '../../../assets/config.js'
// __dirname is not available in ES modules, so we need to use import.meta.url

const collectionPath = path.join(__dirname, 'data', 'collections.json')
class CollectionsModel {
  static async getAllCollections (): Promise<CollectionObjectType[]> {
    const data = await fs.readFile(collectionPath, 'utf-8')
    const collections: CollectionObjectType[] = JSON.parse(data)

    return collections
  }

  static async getCollectionById (id: ID): Promise<CollectionObjectType> {
    const collections = await this.getAllCollections()
    const collection = collections.find(collection => collection._id === id)
    if (!collection) {
      throw new Error('Colección no encontrada')
    }

    return collectionObject(collection)
  }

  static async getCollectionsByUser (id: ID): Promise<CollectionObjectType[]> {
    const collections = await this.getAllCollections()
    const filteredCollections = collections.filter(collection => collection.userId === id)
    if (!filteredCollections) {
      throw new Error('No se encontraron colecciones para este usuario')
    }

    // Return collection with limited public information
    return filteredCollections.map(collection => collectionObject(collection))
  }

  static async createCollection (data: Partial<CollectionObjectType>): Promise<CollectionObjectType> {
    const collections = await this.getAllCollections()

    // Crear valores por defecto
    const newCollection = collectionObject(data)
    collections.push(newCollection)
    await fs.writeFile(collectionPath, JSON.stringify(collections, null, 2))
    return newCollection
  }

  static async deleteCollection (id: ID): Promise<{ message: string }> {
    const collections = await this.getAllCollections()
    const collectionIndex = collections.findIndex(collection => collection._id === id)
    if (collectionIndex === -1) {
      throw new Error('Colección no encontrada')
    }
    collections.splice(collectionIndex, 1)
    await fs.writeFile(collectionPath, JSON.stringify(collections, null, 2))
    return { message: 'Colección eliminada con éxito' } // Mensaje de éxito
  }

  static async updateCollection (id: ID, data: Partial<CollectionObjectType>): Promise<CollectionObjectType> {
    const collections = await this.getAllCollections()

    const collectionIndex = collections.findIndex(collection => collection._id === id)
    if (collectionIndex === -1) {
      throw new Error('Colección no encontrada')
    }
    // Actualiza los datos directamente en el objeto de la colección
    Object.assign(collections[collectionIndex], data) // Modifica directamente el objeto en el array
    await fs.writeFile(collectionPath, JSON.stringify(collections, null, 2))

    return collectionObject(collections[collectionIndex]) // Devuelve la colección actualizada
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getCollectionByQuery (query: string, l: number, collections: CollectionObjectType[] = []): Promise<CollectionObjectType[]> {
    if (collections.length === 0) {
      collections = await this.getAllCollections()
    }


    const queryWords = changeToArray(query)

    const collectionsWithScores = collections.map(collection => {
      const score = calculateMatchScore(collection, queryWords, query)

      // Umbral de coincidencia deseado
      if (score < queryWords.length * 0.7) return null

      return { collection, score } // Devolvemos el libro junto con su puntaje si pasa la validación
    }).filter(item => item !== null).slice(0, l)

    // Ordenamos los libros por el puntaje en orden descendente
    collectionsWithScores.sort((a, b) => b.score - a.score)

    // Solo los datos del libro, no del puntaje
    return collectionsWithScores.map(item => collectionObject(item.collection))
  }

  static async getCollectionsByQueryWithFilters (query: {
    query: string
    where: Record<string, string> | {}
    l: number
  }): Promise<CollectionObjectType[]> {
    let collections = await this.getAllCollections() // Fetch all collections (local data)
    if (Object.keys(query.where).length === 0) throw new Error('No se encontraron colecciones para este usuario')
    collections = collections.filter((collection) => {
      return Object.keys(query.where).some((filter) => {
        const key = filter as keyof CollectionObjectType
        return collection[key] === (query.where as Record<string, string>)[filter]
      })
    })

    // Perform search based on the query
    collections = await this.getCollectionByQuery(query.query, query.l, collections)
    if (collections === undefined || !collections) {
      throw new Error('No se encontraron colecciones para este usuario')
    }
    return collections.map((collection) => collectionObject(collection))
  }

  static async getCollectionSaga (bookId: ID, userId: ID): Promise<CollectionObjectType> {
    const collections = await this.getAllCollections()

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i]
      if (collection.librosIds.length > 1 && collection.librosIds.includes(bookId) && collection.userId === userId && collection.saga === true) {
        return collection
      }
    }
    throw new Error('No se encontró una saga para este libro')
  }
  static async forYouPageCollections (userKeyInfo: any, sampleSize: number): Promise<CollectionObjectType[]> {
    const collections = await this.getAllCollections()
    const filteredCollections = collections.filter(collection => collection.userId !== userKeyInfo.userId)
    const randomCollections = filteredCollections.sort(() => Math.random() - 0.5).slice(0, sampleSize)
    return randomCollections.map(collection => collectionObject(collection))
  }
}

export { CollectionsModel }
