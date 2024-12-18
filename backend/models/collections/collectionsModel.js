import fs from 'node:fs/promises'
import { levenshteinDistance } from '../../assets/levenshteinDistance.js'
const collectionObject = (data) => {
  return {
    _id: data._id || '',
    foto: data.foto || '',
    librosIds: data.librosIds || [],
    nombre: data.nombre || '',
    descripcion: data.descripcion || '',
    seguidores: data.seguidores || [],
    userId: data.userId || '',
    saga: data.saga || false

  }
}
class CollectionsModel {
  static async getAllCollections () {
    try {
      const data = await fs.readFile('./models/collections.json', 'utf-8')
      const collections = JSON.parse(data)

      return collections
    } catch (err) {
      console.error('Error reading collections:', err)
      throw new Error(err)
    }
  }

  static async getCollectionById (id) {
    try {
      const collections = await this.getAllCollections()
      const collection = collections.find(collection => collection._id === id)
      if (!collection) {
        return null
      }

      // Return collection with limited public information
      return collectionObject(collection)
    } catch (err) {
      console.error('Error reading collection:', err)
      throw new Error(err)
    }
  }

  static async getCollectionsByUser (id) {
    try {
      const collections = await this.getAllCollections()
      const filteredCollections = collections.filter(collection => collection.userId === id)
      if (!filteredCollections) {
        return null
      }

      // Return collection with limited public information
      return filteredCollections.map(collection => collectionObject(collection))
    } catch (err) {
      console.error('Error reading collection:', err)
      throw new Error(err)
    }
  }

  static async createCollection (data) {
    try {
      const collections = await this.getAllCollections()

      // Crear valores por defecto
      // Asignar un ID único al colección
      data._id = crypto.randomUUID()
      const time = new Date()
      data.createdIn = `${time.toISOString()}`
      const newCollection = collectionObject(data)
      collections.push(newCollection)
      await fs.writeFile('./models/collections.json', JSON.stringify(collections, null, 2))
      return newCollection
    } catch (err) {
      return err
    }
  }

  static async deleteCollection (id) {
    try {
      const collections = await this.getAllCollections()
      const collectionIndex = collections.findIndex(collection => collection._id === id)
      if (collectionIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      collections.splice(collectionIndex, 1)
      await fs.writeFile('./models/collections.json', JSON.stringify(collections, null, 2))
      return { collection: 'Collection deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting collection:', err)
      throw new Error('Error deleting collection')
    }
  }

  static async updateCollection (id, data) {
    try {
      const collections = await this.getAllCollections()

      const collectionIndex = collections.findIndex(collection => collection._id === id)
      if (collectionIndex === -1) {
        return null // Si no se encuentra la colección, retorna null
      }
      // Actualiza los datos directamente en el objeto de la colección
      Object.assign(collections[collectionIndex], data) // Modifica directamente el objeto en el array
      await fs.writeFile('./models/collections.json', JSON.stringify(collections, null, 2))

      return collectionObject(collections[collectionIndex]) // Devuelve la colección actualizada
    } catch (err) {
      console.error('Error updating collection:', err)
      throw new Error(err)
    }
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getCollectionByQuery (query, l, collections = []) {
    console.log(collections)
    if (collections.length === 0) {
      collections = await this.getAllCollections()
    }
    function changeToArray (element) {
      if (typeof element === 'string' && element.trim() !== '') {
        return element.split(' ').filter(Boolean)
      }
      return element || [] // Devuelve un array vacío si el elemento es nulo o indefinido
    }

    const calculateMatchScore = (collection, queryWords) => {
      const queryWordsArray = changeToArray(queryWords)
      const valueElements = Object.values(collection)
      const stringValueWords = []

      let score = 0
      const tolerance = query.length > 3 ? 2 : 0 // Tolerancia de letras equivocadas

      valueElements.forEach((element) => {
        if (typeof element === 'string') {
          stringValueWords.push(...changeToArray(element))
        } else if (Array.isArray(element)) {
          element.forEach((word) => {
            stringValueWords.push(...changeToArray(word))
          })
        }
      })

      const matchedWords = new Set() // Usamos un Set para evitar duplicados

      for (const queryWord of queryWordsArray) {
        stringValueWords.forEach(word => {
          const distance = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
          if (distance <= tolerance && !matchedWords.has(word)) {
            score += 1 // Incrementa el score si la distancia está dentro del umbral de tolerancia
            matchedWords.add(word) // Agrega la palabra al Set
          }
        })
      }

      return score
    }

    const queryWords = changeToArray(query)

    const collectionsWithScores = collections.map(collection => {
      const score = calculateMatchScore(collection, queryWords)

      // Umbral de coincidencia deseado
      if (score < queryWords.length * 0.7) return null

      return { collection, score } // Devolvemos el libro junto con su puntaje si pasa la validación
    })
      .filter(item => item !== null).slice(0, l)

    // Ordenamos los libros por el puntaje en orden descendente
    collectionsWithScores.sort((a, b) => b.score - a.score)

    // Solo los datos del libro, no del puntaje
    return collectionsWithScores.map(item => collectionObject(item.collection))
  }

  static async getCollectionsByQueryWithFilters (query) {
    let collections = await this.getAllCollections() // Fetch all collections (local data)
    if (Object.keys(query.where).length === 0) return []

    collections = collections.filter((collection) => {
      return Object.keys(query.where).some(filter => collection[filter] === query.where[filter])
    })

    // Perform search based on the query
    collections = await this.getCollectionByQuery(query.query, query.l, collections)
    if (collections === undefined || !collections) {
      return []
    }
    return collections.map((collection) => collectionObject(collection))
  }

  static async getCollectionSaga (bookId, userId) {
    const collections = await this.getAllCollections()
    console.log(userId, bookId)

    for (let i = 0; i < collections.length; i++) {
      const collection = collections[i]
      if (collection.librosIds.length > 1 && collection.librosIds.includes(bookId) && collection.userId === userId && collection.saga === true) {
        return collection
      }
    }
    return null
  }
}

export { CollectionsModel }
