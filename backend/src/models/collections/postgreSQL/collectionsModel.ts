import fs from 'node:fs/promises'
import { collectionObject } from '../collectionObject.js'
import { calculateMatchScore } from '../../../assets/calculateMatchScore.js'
import { CollectionObjectType } from '../../../types/collection'
import { ID } from '../../../types/objects'
import { changeToArray } from '../../../assets/changeToArray.js'
import { pool } from '../../../assets/config.js'
import {
  executeQuery,
  executeSingleResultQuery,
  DatabaseError
} from '../../../utils/dbUtils.js'

// __dirname is not available in ES modules, so we need to use import.meta.url

class CollectionsModel {
  static async getAllCollections (): Promise<CollectionObjectType[]> {
    const data: CollectionObjectType[] = await executeQuery(
      pool,
      () => pool.query('SELECT * FROM collections;'),
      'Failed to fetch collections from PostgreSQL'
    )
    return data
  }

  static async getCollectionById (id: ID): Promise<CollectionObjectType> {
    const data: CollectionObjectType = await executeSingleResultQuery(
      pool,
      () => pool.query('SELECT * FROM collections WHERE id = $1;', [id]),
      'Failed to fetch collection from PostgreSQL'
    )

    return data
  }

  static async getCollectionsByUser (id: ID): Promise<CollectionObjectType[]> {
    const data: CollectionObjectType[] = await executeQuery(
      pool,
      () => pool.query('SELECT * FROM collections WHERE user_id = $1;', [id]),
      'Failed to fetch collection from PostgreSQL'
    )

    return data
  }

  static async createCollection (
    data: Partial<CollectionObjectType>
  ): Promise<CollectionObjectType> {
    const fullCollecion = collectionObject(data)
    const newCollection: CollectionObjectType = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          `INSERT INTO collections (id, foto, libros_ids, nombre, descripcion, seguidores, user_id, saga, creado_en) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
          [
            fullCollecion.id,
            fullCollecion.foto,
            fullCollecion.libros_ids,
            fullCollecion.nombre,
            fullCollecion.descripcion,
            fullCollecion.seguidores,
            fullCollecion.user_id,
            fullCollecion.saga,
            fullCollecion.creado_en
          ]
        ),
      'Failed to create collection in PostgreSQL'
    )
    return newCollection
  }

  static async deleteCollection (id: ID): Promise<{ message: string }> {
    const collection = await this.getCollectionById(id)
    if (!collection) {
      throw new Error('No se encontró la colección')
    }
    await executeQuery(
      pool,
      () => pool.query('DELETE FROM collections WHERE id = $1;', [id]),
      'Failed to delete collection from PostgreSQL'
    )
    return { message: 'Colección eliminada con éxito' } // Mensaje de éxito
  }

  static async updateCollection (
    id: ID,
    data: Partial<CollectionObjectType>
  ): Promise<CollectionObjectType> {
    try {
      const keys = Object.keys(data)
      const values = Object.values(data)
      let updateString = ''
      for (const i of keys) {
        updateString += `${i} = $${keys.indexOf(i) + 1}, `
      }
      updateString = updateString.slice(0, -2) // Remove last comma and space


      const result = await executeSingleResultQuery(
        pool,
        () =>
          pool.query(
            `UPDATE collections SET ${updateString} WHERE ID = $${
              keys.length + 1
            } RETURNING *;`,
            [...values, id]
          ),
        `Failed to update book with ID ${id}`
      )

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Error updating book with ID ${id}`, error)
    }
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getCollectionByQuery (
    query: string,
    l: number = 1000,
    collections: CollectionObjectType[] = []
  ): Promise<CollectionObjectType[]> {
    if (collections.length === 0) {
      collections = await executeQuery(
        pool,
        () =>
          pool.query(`SELECT * FROM collections ORDER BY RANDOM() LIMIT $1;`, [
            l
          ]),
        'Failed to fetch collections from database'
      )
    }

    const queryWords = changeToArray(query)

    const collectionsWithScores = collections
      .map(collection => {
        const score = calculateMatchScore(collection, queryWords, query)

        // Umbral de coincidencia deseado
        if (score < queryWords.length * 0.7) return null

        return { collection, score } // Devolvemos el libro junto con su puntaje si pasa la validación
      })
      .filter(item => item !== null)

    // Ordenamos los libros por el puntaje en orden descendente
    const filteredCollections = collectionsWithScores
      .sort((a, b) => b.score - a.score)
      .map(item => item.collection)

    return filteredCollections
  }

  static async getCollectionsByQueryWithFilters (query: {
    query: string
    where: Record<string, string> | {}
    l: number
  }): Promise<CollectionObjectType[]> {
    let collections = await executeQuery(
      pool,
      () =>
        pool.query(`SELECT * FROM collections ORDER BY RANDOM() LIMIT $1;`, [
          query.l
        ]),
      'Failed to fetch collections from database'
    )
    if (Object.keys(query.where).length === 0)
      throw new Error('No se encontraron colecciones para este usuario')
    collections = collections.filter(collection => {
      return Object.keys(query.where).some(filter => {
        const key = filter as keyof CollectionObjectType
        return (
          collection[key] === (query.where as Record<string, string>)[filter]
        )
      })
    })

    // Perform search based on the query
    collections = await this.getCollectionByQuery(
      query.query,
      query.l,
      collections
    )
    if (collections === undefined || !collections) {
      throw new Error('No se encontraron colecciones para este usuario')
    }
    return collections.map(collection => collectionObject(collection))
  }

  static async getCollectionSaga (
    bookId: ID,
    userId: ID
  ): Promise<CollectionObjectType> {
    console.log('Book ID:', bookId)
    const collection = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          'SELECT * FROM collections WHERE user_id = $1 AND libros_ids @> $2 AND saga = true;',
          [userId, [bookId]]
        ),
      'Failed to fetch collection from PostgreSQL'
    )
    if (!collection) {
      throw new Error('No se encontró la colección')
    }
    return collection
  }
  static async forYouPageCollections (
    userKeyInfo: any,
    sampleSize: number = 24
  ): Promise<CollectionObjectType[]> {

    const collections = await executeQuery(
      pool,
      () =>
        pool.query(
          `SELECT * FROM collections WHERE user_id != $1 ORDER BY RANDOM() LIMIT $2;`,
          [userKeyInfo?.id ?? '0', sampleSize]
        ),
      'Failed to fetch collections from PostgreSQL'
    )
    console.log('Collections for you page:', collections)
    return collections
  }
}

export { CollectionsModel }
