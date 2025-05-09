import fs from 'node:fs/promises'
import { changeToArray } from '../../../assets/changeToArray.js'
import { calculateMatchScore } from '../../../assets/calculateMatchScore.js'
import * as tf from '@tensorflow/tfjs'
import { getBookKeyInfo } from '../local/getBookKeyInfo.js'
import { getTrends } from '../../../assets/getTrends.js'
import { bookObject } from '../bookObject.js'
import { ID, ISOString } from '../../../types/objects.js'
import { AuthToken } from '../../../types/authToken.js'
import { CollectionObjectType } from '../../../types/collection'
import { BookObjectType } from '../../../types/book.js'
import {
  executeQuery,
  executeSingleResultQuery,
  DatabaseError
} from '../../../utils/dbUtils.js'

import { filterBooksByFilters } from '../local/filterBooksByFilters.js'
// __dirname is not available in ES modules, so we need to use import.meta.url

import { pool } from '../../../assets/config.js'
import { IUsersModel } from '../../../types/models.js'
class BooksModel {
  private static getEssencialFields (): string[] {
    return Object.keys(bookObject({}, false))
  }
  static async getAllBooks (): Promise<BookObjectType[]> {
    try {
      const books = await executeQuery(
        pool,
        () => pool.query('SELECT * FROM books;'),
        'Failed to fetch books from database'
      )

      return books
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error retrieving books', error)
    }
  }

  static async getBookById (id: ID): Promise<BookObjectType> {
    try {
      return await executeSingleResultQuery(
        pool,
        () => pool.query('SELECT * FROM books WHERE id = $1;', [id]),
        `Failed to fetch book with ID ${id}`
      )
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Error retrieving book with ID ${id}`, error)
    }
  }

  static async getBookByQuery (
    query: string,
    l: number,
    books: BookObjectType[] = []
  ): Promise<Partial<BookObjectType>[]> {
    try {
      if (books.length === 0) {
        books = await executeQuery(
          pool,
          () =>
            pool.query(
              `SELECT ${this.getEssencialFields().join(', ')} 
              FROM books WHERE disponibilidad = 'Disponible' ORDER BY RANDOM() LIMIT $1;`,
              [l]
            ),
          'Failed to fetch books from database'
        )
      }
      const queryWords = changeToArray(query)

      // Calculamos los scores y filtramos directamente los que no cumplen el umbral
      const booksWithScores = books
        .map(book => {
          const score = calculateMatchScore(book, queryWords, query)
          return score >= queryWords.length * 0.7 ? { book, score } : null
        })
        .filter(item => item !== null)

      // Ordenamos antes de filtrar por cantidad
      const filterdBooks: Partial<BookObjectType>[] = booksWithScores
        .sort((a, b) => b.score - a.score)
        .map(item => item.book)

      return filterdBooks
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error searching books by query', error)
    }
  }

  static async getBooksByQueryWithFilters (
    query: string,
    filters: Partial<Record<keyof BookObjectType, any>>,
    limit: number
  ): Promise<Partial<BookObjectType>[]> {
    // TODO: Implementar la función en la base de datos como tal
    let books = await executeQuery(
      pool,
      () =>
        pool.query(
          `SELECT * FROM books WHERE disponibilidad = 'Disponible' ORDER BY RANDOM() LIMIT 1000;`
        ),
      'Failed to fetch books from database'
    )

    type PreparedFiltersType = Partial<
      {
        [key in keyof BookObjectType[]]?: any[] | number
      } & {
        min_precio?: number
        max_precio?: number
        ciudad?: string[]
        departamento?: string[]
      }
    >
    const preparedFilters: PreparedFiltersType = {}
    Object.keys(filters).forEach(filter => {
      const filterValue = filters[filter as keyof BookObjectType]
      if (typeof filterValue === 'string') {
        preparedFilters[filter as any] = filterValue.split(',')
      }
      if (
        filter === 'precio' &&
        Array.isArray(preparedFilters[filter as keyof PreparedFiltersType])
      ) {
        const prices = preparedFilters[
          filter as keyof PreparedFiltersType
        ] as number[]
        preparedFilters['min_precio'] = Math.min(...prices)
        preparedFilters['max_precio'] = Math.max(...prices)
        delete preparedFilters[filter as keyof PreparedFiltersType]
      }
    })
    books = filterBooksByFilters(books, preparedFilters)
    // Perform search based on the query
    const resultBooks = await this.getBookByQuery(query, limit, books)

    return resultBooks
  }

  static async createBook (data: BookObjectType): Promise<BookObjectType> {
    try {
      const book = bookObject(data, true)
      await executeQuery(
        pool,
        () =>
          pool.query(
            `INSERT INTO books (id, titulo, autor, precio, oferta, isbn, images, keywords, 
          descripcion, estado, genero, formato, vendedor, id_vendedor, edicion, idioma, 
          ubicacion, tapa, edad, fecha_publicacion, actualizado_en, disponibilidad,
          mensajes, collections_ids)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,$21,$22, $23, $24);`,
            [
              book.id,
              book.titulo,
              book.autor,
              book.precio,
              book.oferta,
              book.isbn,
              book.images,
              book.keywords,
              book.descripcion,
              book.estado,
              book.genero,
              book.formato,
              book.vendedor,
              book.id_vendedor,
              book.edicion,
              book.idioma,
              book.ubicacion,
              book.tapa,
              book.edad,
              book.fecha_publicacion,
              book.actualizado_en,
              book.disponibilidad,
              book.mensajes,
              book.collections_ids
            ]
          ),
        'Failed to create new book'
      )
      return book
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error creating new book', error)
    }
  }

  static async updateBook (
    id: ID,
    data: Partial<BookObjectType>
  ): Promise<Partial<BookObjectType>> {
    try {
      const [keys, values] = Object.entries(data)
      const updateString = keys.reduce((last, key, index) => {
        const prefix = index === 0 ? '' : ', '
        return `${last}${prefix}${key} = $${index + 1}`
      })

      const result = await executeSingleResultQuery(
        pool,
        () =>
          pool.query(
            `UPDATE books SET ${updateString} WHERE ID = $${
              keys.length + 1
            } RETURNING ${this.getEssencialFields().join(', ')};`,
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

  static async deleteBook (id: ID): Promise<{ message: string }> {
    try {
      // Check if the book exists
      const result = await executeSingleResultQuery(
        pool,
        () => pool.query('SELECT * FROM books WHERE id = $1;', [id]),
        'Failed to find book to delete'
      )
      if (!result) throw new Error('Book not found')
      await executeQuery(
        pool,
        () => pool.query('DELETE FROM books WHERE id = $1;', [id]),
        `Failed to delete book with ID ${id}`
      )
      return { message: 'Book deleted successfully' }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Error deleting book with ID ${id}`, error)
    }
  }

  static async getAllReviewBooks (): Promise<BookObjectType[]> {
    try {
      return await executeQuery(
        pool,
        () => pool.query('SELECT * FROM books_backstage;'),
        'Failed to fetch review books from database'
      )
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error retrieving review books', error)
    }
  }

  static async createReviewBook (
    data: Partial<BookObjectType>
  ): Promise<BookObjectType> {
    try {
      const book = bookObject(data, true)
      await executeQuery(
        pool,
        () =>
          pool.query(
            `INSERT INTO books_backstage (id, titulo, autor, precio, oferta, isbn, images, keywords, 
          descripcion, estado, genero, formato, vendedor, id_vendedor, edicion, idioma, 
          ubicacion, tapa, edad, fecha_publicacion, actualizado_en, disponibilidad,
          mensajes, collections_ids)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24);`,
            [
              book.id,
              book.titulo,
              book.autor,
              book.precio,
              book.oferta,
              book.isbn,
              book.images,
              book.keywords,
              book.descripcion,
              book.estado,
              book.genero,
              book.formato,
              book.vendedor,
              book.id_vendedor,
              book.edicion,
              book.idioma,
              book.ubicacion,
              book.tapa,
              book.edad,
              book.fecha_publicacion,
              book.actualizado_en,
              book.disponibilidad,
              book.mensajes,
              book.collections_ids
            ]
          ),
        'Failed to create review book'
      )
      return book
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error creating review book', error)
    }
  }

  static async deleteReviewBook (id: ID): Promise<{ message: string }> {
    try {
      await executeQuery(
        pool,
        () => pool.query('DELETE FROM books_backstage WHERE id = $1;', [id]),
        `Failed to delete review book with ID ${id}`
      )
      return { message: 'Book deleted successfully' }
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Error deleting review book with ID ${id}`, error)
    }
  }

  static async updateReviewBook (
    id: ID,
    data: Partial<BookObjectType>
  ): Promise<Partial<BookObjectType>> {
    try {
      const [keys, values] = Object.entries(data)
      const updateString = keys.reduce((last, key, index) => {
        const prefix = index === 0 ? '' : ', '
        return `${last}${prefix}${key} = $${index + 1}`
      })
      const result = await executeSingleResultQuery(
        pool,
        () =>
          pool.query(
            `UPDATE books_backstage SET ${updateString} WHERE ID = $${
              keys.length + 1
            } RETURNING *;`,
            [...values, id]
          ),
        `Failed to update review book with ID ${id}`
      )

      if (!result.length) {
        throw new DatabaseError('Review book not found')
      }

      return bookObject(result[0], false)
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Error updating review book with ID ${id}`, error)
    }
  }

  static async forYouPage (
    userKeyInfo: AuthToken | undefined,
    sampleSize: number = 1000,
    UsersModel: IUsersModel
  ): Promise<Partial<BookObjectType>[]> {
    try {
      const books = await executeQuery(
        pool,
        () =>
          pool.query(
            `SELECT ${this.getEssencialFields().join(
              ', '
            )} FROM books WHERE disponibilidad = 'Disponible' ORDER BY RANDOM() LIMIT $1;`,
            [sampleSize]
          ),
        'Failed to fetch random books for recommendations'
      )
      // console.log('Libros para recomendaciones', books)

      // Las querywords sería palabras que el usuario tiene en base a sus gustos
      const trends = await getTrends(20, 'postgres')

      let historial: string[] = []
      let preferences: string[] = []
      let likes: ID[] = []
      if (userKeyInfo?.id) {
        const user = await UsersModel.getUserById(userKeyInfo.id)
        preferences = Object.keys(user?.preferencias || {})
        historial = Object.keys(user?.historial_busquedas || {})
        likes = user.favoritos ?? []

        // Si el usuario tiene libros favoritos, entonces los agrego a las querywords

        if (likes.length > 0) {
          const booksFavorites = await this.getBooksByIdList(likes)

          preferences = [
            ...preferences,
            ...booksFavorites
              .filter(b => b !== undefined)
              .map(book => book.titulo ?? '')
          ]
        }
      }
      const queryWords = [...preferences, ...historial, ...trends]

      // Calculate the distances in these selected items
      const booksWithScores = books
        .map(book => {
          let score = calculateMatchScore(book, queryWords, 'query') // Query se usa para considerar si la palabra es muy pequeña, por lo que aquí solo agregaré una palabra de más de 4 letras para asegurar la tolerancia
          const threshold = 0 // Revisar si es necesario
          const bookKeyInfo = getBookKeyInfo(book)

          if (score >= queryWords.length * threshold) {
            // Priorizar las preferencias del usuario
            if (
              preferences.some(preference => bookKeyInfo.includes(preference))
            ) {
              score += 10
            }
            return { book, score }
          } else return null
        })
        .filter(
          (item): item is { book: BookObjectType; score: number } =>
            item !== null
        )

      booksWithScores.sort((a, b) => b.score - a.score)

      return booksWithScores.map(item => bookObject(item.book, false))
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error generating recommendations', error)
    }
  }

  static async getFavoritesByUser (
    favorites: ID[]
  ): Promise<Partial<BookObjectType>[]> {
    try {
      const elements = await Promise.all(
        favorites.map(ID => {
          return this.getBookById(ID)
        })
      )

      return elements
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error fetching favorite books', error)
    }
  }

  static async getBooksByIdList (list: ID[]): Promise<BookObjectType[]> {
    try {
      const books = await Promise.all(list.map(id => this.getBookById(id)))
      return books
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error fetching books by ID list', error)
    }
  }

  static async predictInfo (
    file: Express.Multer.File
  ): Promise<{ title: string; author: string }> {
    try {
      // Read the file buffer
      const imageBuffer = await fs.readFile(file.path)
      const tensor = tf.tensor([0, 0, 0])
      // Convert buffer to Tensor
      // const tensor = decodeImage(imageBuffer)
      //   .resizeNearestNeighbor([224, 336]) // Resize for model input (adjust as needed)
      //   .expandDims() // Add batch dimension
      //   .toFloat()
      //   .div(255.0) // Normalize pixel values

      // Load the model (assuming it's a pre-trained model)
      const model = await tf.loadLayersModel('file://path_to_model/model.json')

      // Make prediction
      // eslint-disable-next-line no-unused-vars
      const prediction = model.predict(tensor)

      return {
        title: 'Hola',
        author: 'soy'
      }
    } catch (error) {
      throw new DatabaseError(
        'Error predicting book information from image',
        error
      )
    }
  }
  static async getBooksByCollection (
    collection: CollectionObjectType
  ): Promise<BookObjectType[]> {
    try {
      // Esta función devuelve todos los libros de una colección específica
      // Obtener todos los libros
      const books = await Promise.all(
        collection.libros_ids.map(id => this.getBookById(id))
      )
      return books
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError('Error fetching books by collection', error)
    }
  }
}

export { BooksModel }
