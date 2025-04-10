import fs from 'node:fs/promises'
import { changeToArray } from './changeToArray.js'
import { calculateMatchScore } from './calculateMatchScore.js'
import * as tf from '@tensorflow/tfjs'
import { getBookKeyInfo } from './getBookKeyInfo.js'
import { getTrends } from '../../../assets/getTrends.js'
import { UsersModel } from '../../users/local/usersLocal.js'
import { randomIntArrayInRange } from './randomIntArrayRange.js'
import { bookObject } from '../bookObject.js'

class BooksModel {
  static async getAllBooks () {
    try {
      const data = await fs.readFile('./models/books.json', 'utf-8')
      const books = JSON.parse(data)

      return books
    } catch (err) {
      console.error('Error reading books:', err)
      throw new Error(err)
    }
  }

  static async getBookById (id) {
    try {
      const books = await this.getAllBooks()
      const book = books.find(book => book._id === id)
      if (!book) {
        return null
      }

      // Return book with limited public information
      return bookObject(book)
    } catch (err) {
      console.error('Error reading book:', err)
      throw new Error(err)
    }
  }

  static async getBookByQuery (query, l, books = []) {
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
    booksWithScores.sort((a, b) => b.score - a.score)

    // Filtramos por disponibilidad y limitamos la cantidad de resultados
    return booksWithScores
      .filter(item => item.book.disponibilidad === 'Disponible')
      .slice(0, l)
      .map(item => bookObject(item.book))
  }

  static async getBooksByQueryWithFilters (query) {
    let books = await this.getAllBooks() // Fetch all books (local data)
    if (Object.keys(query.where).length === 0) return []

    books = books.filter((book) => {
      return Object.keys(query.where).some(filter => book[filter] === query.where[filter])
    })

    // Perform search based on the query
    books = await this.getBookByQuery(query.query, query.l, books)
    if (books === undefined || !books) {
      return []
    }
    return books.map((book) => bookObject(book))
  }

  static async createBook (data) {
    try {
      const books = await this.getAllBooks()
      const time = new Date()
      data.fechaPublicacion = time
      data.actualizadoEn = time

      books.push(bookObject(data))
      await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))
      return bookObject(data)
    } catch (err) {
      return err
    }
  }

  static async updateBook (id, data) {
    try {
      const books = await this.getAllBooks()

      const bookIndex = await books.findIndex(book => book._id === id)
      if (bookIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      data.actualizadoEn = new Date()

      // Actualiza los datos del usuario
      await Object.assign(books[bookIndex], data)

      // Hacer el path hacia aqui
      // change writeFile to writeFileSync, which makes it synchronous
      await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))

      return bookObject(books[bookIndex])
    } catch (err) {
      console.error('Error updating book:', err)
      throw new Error(err)
    }
  }

  static async deleteBook (id) {
    try {
      const books = await this.getAllBooks()
      const bookIndex = books.findIndex(book => book._id === id)
      if (bookIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      books.splice(bookIndex, 1)
      await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))
      return { message: 'Book deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting book:', err)
      throw new Error('Error deleting book')
    }
  }

  static async getAllReviewBooks () {
    try {
      const data = await fs.readFile('./models/booksBackStage.json', 'utf-8')
      const books = JSON.parse(data)

      return books
    } catch (err) {
      console.error('Error reading books:', err)
      throw new Error(err)
    }
  }

  static async createReviewBook (data) {
    try {
      const books = await this.getAllReviewBooks()

      books.push(bookObject(data))
      await fs.writeFile('./models/booksBackStage.json', JSON.stringify(books, null, 2))
      return bookObject(data)
    } catch (err) {
      return err
    }
  }

  static async deleteReviewBook (id) {
    try {
      const books = await this.getAllReviewBooks()
      const bookIndex = books.findIndex(book => book._id === id)

      if (bookIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }

      books.splice(bookIndex, 1)
      await fs.writeFile('./models/booksBackStage.json', JSON.stringify(books, null, 2))
      return { message: 'Book deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting book:', err)
      throw new Error('Error deleting book')
    }
  }

  static async updateReviewBook (id, data) {
    try {
      const book = await this.getBookById(id)

      const reviewBooks = await this.getAllReviewBooks()

      // Actualiza los datos del usuario
      Object.assign(book, data)
      reviewBooks.push(book)
      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/booksBackStage.json', JSON.stringify(reviewBooks, null, 2))

      return book
    } catch (err) {
      console.error('Error updating book:', err)
      throw new Error(err)
    }
  }

  static async forYouPage (userKeyInfo = {}, sampleSize = 100) {
    const books = await this.getAllBooks()
    const randomIndexes = randomIntArrayInRange(0, books.length, sampleSize) // [ 34, 14, 27, 17, 30, 27, 20, 26, 21, 14 ]
    const selectedBooks = randomIndexes.map(index => books[index]).filter(element => element !== undefined && element.disponibilidad === 'Disponible')
    // Las querywords sería palabras que el usuario tiene en base a sus gustos
    const trends = await getTrends()

    let historial = []
    let preferences = []
    let likes = []
    if (userKeyInfo?._id) {
      const user = await UsersModel.getUserById(userKeyInfo._id)
      preferences = Object.keys(user?.preferencias || {})
      historial = Object.keys(user?.historialBusquedas || {})
      likes = user?.librosFavoritos || []
      // Si el usuario tiene libros favoritos, entonces los agrego a las querywords
      if (likes.length > 0) {
        const booksFavorites = await this.getBooksByIdList(likes, 10)
        preferences = [...preferences, ...booksFavorites.map(book => book.titulo)]
      }
    }
    const queryWords = [...preferences, ...historial, ...trends]
    // Calculate the distances in these selected items
    const booksWithScores = selectedBooks.map((book) => {
      let score = calculateMatchScore(book, queryWords, 'query') // Query se usa para considerar si la palabra es muy pequeña, por lo que aquí solo agregaré una palabra de más de 4 letras para asegurar la tolerancia
      const threshold = 0 // Revisar si es necesario
      const bookKeyInfo = getBookKeyInfo(book)
      if (score >= queryWords.length * threshold) {
        // Priorizar las preferencias del usuario
        if (preferences.some(preference => bookKeyInfo.includes(preference))) score += 10
        return { book, score }
      } else return null
    }).filter(item => item !== null)

    booksWithScores.sort((a, b) => b.score - a.score)
    return booksWithScores
      .slice(0, sampleSize)
      .map(item => bookObject(item.book))
  }

  static async getFavoritesByUser (favorites) {
    try {
      const books = await this.getAllBooks()

      const elements = books.filter(book => favorites.includes(book._id))
      if (!elements) return null
      return elements
    } catch (error) {
      console.error('Error getting favorites:', error)
    }
  }

  static async getBooksByIdList (list, l) {
    try {
      const books = await this.getAllBooks()
      const filteredBooks = books.filter((book, index) => {
        if (index >= l) return false
        return list.includes(book._id)
      })

      if (!filteredBooks || filteredBooks.length === 0) {
        return [] // Devuelve un arreglo vacío si no hay coincidencias
      }
      // Return book with limited public information
      return filteredBooks.map((book) => bookObject(book)) // Suponiendo que `bookObject` formatea el resultado
    } catch (err) {
      console.error('Error reading book:', err)
      throw new Error('Error fetching books') // Devuelve un mensaje más genérico
    }
  }

  static async predictInfo (file) {
    // Read the file buffer
    const imageBuffer = fs.readFileSync(file.path)

    // Convert buffer to Tensor
    const tensor = tf.node.decodeImage(imageBuffer)
      .resizeNearestNeighbor([224, 336]) // Resize for model input (adjust as needed)
      .expandDims() // Add batch dimension
      .toFloat()
      .div(255.0) // Normalize pixel values

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
}

export { BooksModel }
