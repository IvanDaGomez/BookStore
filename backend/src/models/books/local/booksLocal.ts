import fs from 'node:fs/promises'
import { changeToArray } from '../../../assets/changeToArray.js'
import { calculateMatchScore } from '../../../assets/calculateMatchScore'
import * as tf from '@tensorflow/tfjs'
import { getBookKeyInfo } from './getBookKeyInfo.js'
import { getTrends } from '../../../assets/getTrends.js'
import { UsersModel } from '../../users/local/usersLocal.js'
import { randomIntArrayInRange } from './randomIntArrayRange.js'
import { bookObject, BookObjectType } from '../bookObject.js'
import { ID, ISOString } from '../../../types/objects.js'
import { AuthToken } from '../../../types/authToken.js'
import { CollectionObjectType } from '../../collections/collectionObject.js'

class BooksModel {
  static async getAllBooks (): Promise<BookObjectType[]> {
    const data = await fs.readFile('./models/books.json', 'utf-8')
    const books: BookObjectType[] = JSON.parse(data)
    if (!books) {
      throw new Error('No hay libros disponibles')
    }
    return books.map(book => bookObject(book, true)) as BookObjectType[]
  }

  static async getBookById (id: ID): Promise<BookObjectType> {
    const books = await this.getAllBooks()
    const book = books.find(book => book._id === id)
    if (!book) {
      throw new Error('Libro no encontrado')
    }
    // Return book with limited public information
    return bookObject(book, true) as BookObjectType
  }

  static async getBookByQuery (
    query: string,
    l: number,
    books: BookObjectType[] = []
  ): Promise<Partial<BookObjectType>[]> {
    if (books.length === 0) {
      books = await this.getAllBooks()
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
      .filter(item => item.disponibilidad === 'Disponible')
      .slice(0, l)
    const bookToReturn: Partial<BookObjectType>[] = filterdBooks.map(item =>
      bookObject(item as BookObjectType, false)
    )
    // Filtramos por disponibilidad y limitamos la cantidad de resultados
    return bookToReturn
  }

  static async getBooksByQueryWithFilters (query: {
    query: string
    where: Record<string, string>
    limit: number
  }): Promise<Partial<BookObjectType>[]> {
    let books = await this.getAllBooks() // Fetch all books (local data)
    if (Object.keys(query.where).length === 0) return []

    books = books.filter(book => {
      return Object.keys(query.where).some(
        filter =>
          book[filter as keyof BookObjectType] ===
          query.where[filter as keyof BookObjectType]
      )
    })

    // Perform search based on the query
    books = (await this.getBookByQuery(
      query.query,
      query.limit,
      books
    )) as BookObjectType[]
    if (books === undefined || !books) {
      return []
    }
    const bookToReturn: Partial<BookObjectType>[] = books
      .filter(book => book.disponibilidad === 'Disponible')
      .map(book => bookObject(book, false))
    // TODO: el tipado no es correcto, se deberia volver Partial<BookObjectType>
    return bookToReturn
  }

  static async createBook (data: BookObjectType): Promise<BookObjectType> {
    const books = await this.getAllBooks()
    const time = new Date().toISOString() as ISOString
    data.fechaPublicacion = time
    data.actualizadoEn = time
    const bookToAdd = bookObject(data, true)
    books.push(bookToAdd)
    await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))
    return bookToAdd
  }

  static async updateBook (
    id: ID,
    data: Partial<BookObjectType>
  ): Promise<Partial<BookObjectType>> {
    const books = await this.getAllBooks()

    const bookIndex = books.findIndex(book => book._id === id)
    if (bookIndex === -1) {
      throw new Error('Libro no encontrado')
    }
    data.actualizadoEn = new Date().toISOString() as ISOString

    // Actualiza los datos del usuario
    Object.assign(books[bookIndex], data)

    // Hacer el path hacia aqui
    // change writeFile to writeFileSync, which makes it synchronous
    await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))

    return bookObject(books[bookIndex], false)
  }

  static async deleteBook (id: ID): Promise<{ message: string }> {
    const books = await this.getAllBooks()
    const bookIndex = books.findIndex(book => book._id === id)
    if (bookIndex === -1) {
      throw new Error('Libro no encontrado')
    }
    books.splice(bookIndex, 1)
    await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))
    return { message: 'Book deleted successfully' } // Mensaje de éxito
  }

  static async getAllReviewBooks (): Promise<BookObjectType[]> {
    const data = await fs.readFile('./models/booksBackStage.json', 'utf-8')
    const books = JSON.parse(data) as BookObjectType[]
    return books
  }

  static async createReviewBook (
    data: Partial<BookObjectType>
  ): Promise<BookObjectType> {
    const books = await this.getAllReviewBooks()
    const bookToAdd = bookObject(data, true)
    books.push(bookToAdd)
    await fs.writeFile(
      './models/booksBackStage.json',
      JSON.stringify(books, null, 2)
    )
    return bookToAdd
  }

  static async deleteReviewBook (id: ID): Promise<{ message: string }> {
    const books = await this.getAllReviewBooks()
    const bookIndex = books.findIndex(book => book._id === id)

    if (bookIndex === -1) {
      throw new Error('Libro no encontrado')
    }

    books.splice(bookIndex, 1)
    await fs.writeFile(
      './models/booksBackStage.json',
      JSON.stringify(books, null, 2)
    )
    return { message: 'Book deleted successfully' } // Mensaje de éxito
  }

  static async updateReviewBook (
    id: ID,
    data: Partial<BookObjectType>
  ): Promise<BookObjectType> {
    const book = await this.getBookById(id)

    const reviewBooks = await this.getAllReviewBooks()

    // Actualiza los datos del usuario
    Object.assign(book, data)
    reviewBooks.push(book)

    await fs.writeFile(
      './models/booksBackStage.json',
      JSON.stringify(reviewBooks, null, 2)
    )

    return book
  }

  static async forYouPage (
    userKeyInfo: AuthToken | undefined,
    sampleSize: number = 100
  ): Promise<Partial<BookObjectType>[]> {
    const books = await this.getAllBooks()
    const randomIndexes: number[] = randomIntArrayInRange(
      0,
      books.length,
      sampleSize
    ) // [ 34, 14, 27, 17, 30, 27, 20, 26, 21, 14 ]
    const selectedBooks = randomIndexes
      .map(index => books[index])
      .filter(
        element =>
          element !== undefined && element.disponibilidad === 'Disponible'
      )
    // Las querywords sería palabras que el usuario tiene en base a sus gustos
    const trends = await getTrends()

    let historial: string[] = []
    let preferences: string[] = []
    let likes = []
    if (userKeyInfo?._id) {
      const user = await UsersModel.getUserById(userKeyInfo._id)
      preferences = Object.keys(user?.preferencias || {})
      historial = Object.keys(user?.historialBusquedas || {})
      likes = user.favoritos ?? []
      // Si el usuario tiene libros favoritos, entonces los agrego a las querywords
      if (likes.length > 0) {
        const booksFavorites = await this.getBooksByIdList(likes, 10)
        preferences = [
          ...preferences,
          ...booksFavorites.map(book => book.titulo ?? '')
        ]
      }
    }
    const queryWords = [...preferences, ...historial, ...trends]
    // Calculate the distances in these selected items
    const booksWithScores = selectedBooks
      .map(book => {
        let score = calculateMatchScore(book, queryWords, 'query') // Query se usa para considerar si la palabra es muy pequeña, por lo que aquí solo agregaré una palabra de más de 4 letras para asegurar la tolerancia
        const threshold = 0 // Revisar si es necesario
        const bookKeyInfo = getBookKeyInfo(book)
        if (score >= queryWords.length * threshold) {
          // Priorizar las preferencias del usuario
          if (preferences.some(preference => bookKeyInfo.includes(preference)))
            score += 10
          return { book, score }
        } else return null
      })
      .filter(item => item !== null)

    booksWithScores.sort((a, b) => b.score - a.score)
    return booksWithScores
      .slice(0, sampleSize)
      .map(item => bookObject(item.book, false))
  }

  static async getFavoritesByUser (
    favorites: ID[]
  ): Promise<Partial<BookObjectType>[]> {
    const books = await this.getAllBooks()

    const elements = books.filter(book => favorites.includes(book._id))
    if (!elements) throw new Error('No hay libros disponibles')
    return elements
  }

  static async getBooksByIdList (
    list: ID[],
    l: number
  ): Promise<Partial<BookObjectType>[]> {
    const books = await this.getAllBooks()
    const filteredBooks = books.filter((book, index) => {
      if (index >= l) return false
      return list.includes(book._id)
    })

    if (!filteredBooks || filteredBooks.length === 0) {
      throw new Error('No hay libros disponibles')
    }

    return filteredBooks.map(book => bookObject(book, false))
  }

  static async predictInfo (
    file: Express.Multer.File
  ): Promise<{ title: string; author: string }> {
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
  }
  static async getBooksByCollection (
    collection: CollectionObjectType
  ): Promise<BookObjectType[]> {
    // Esta función devuelve todos los libros de una colección específica
    try {
      // Obtener todos los libros
      const books: BookObjectType[] = await this.getAllBooks()

      // Filtrar los libros que pertenecen a la colección
      const colecciones = books.filter(book =>
        collection.librosIds.includes(book._id)
      )

      if (colecciones.length === 0) {
        throw new Error('No se encontraron libros en esta colección')
      }
      return colecciones
    } catch (error) {
      console.error('Error en getBooksByCollection:', error)
      throw new Error('No se pudieron obtener los libros de la colección')
    }
  }
}

export { BooksModel }
