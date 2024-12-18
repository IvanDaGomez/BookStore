import fs from 'node:fs/promises'
import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'

const bookObject = (data) => {
  return {
    titulo: data.titulo || '',
    autor: data.autor || '',
    precio: data.precio || 0,
    oferta: data.oferta || null,
    isbn: data.isbn || '',
    images: data.images || [],
    keywords: data.keywords || [],
    _id: data._id,
    descripcion: data.descripcion || '',
    estado: data.estado || 'Nuevo sellado',
    genero: data.genero || '',
    formato: data.formato || '',
    vendedor: data.vendedor || '',
    idVendedor: data.idVendedor,
    edicion: data.edicion,
    idioma: data.idioma,
    ubicacion: data.ubicacion || {
      ciudad: '',
      departamento: '',
      pais: ''
    },
    tapa: data.tapa || '',
    edad: data.edad || '',
    fechaPublicacion: data.fechaPublicacion || new Date().toISOString(),
    actualizadoEn: data.actualizadoEn || new Date().toISOString(),
    disponibilidad: data.disponibilidad || 'Disponible',
    mensajes: data.mensajes || [],
    librosVendidos: data.librosVendidos || 0,
    collectionsIds: data.collectionsIds || []
  }
}
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

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getBookByQuery (query, l, books = []) {
    console.log(books)
    if (books.length === 0) {
      books = await this.getAllBooks()
    }
    function changeToArray (element) {
      if (typeof element === 'string' && element.trim() !== '') {
        return element.split(' ').filter(Boolean)
      }
      return element || [] // Devuelve un array vacío si el elemento es nulo o indefinido
    }

    const calculateMatchScore = (book, queryWords) => {
      const queryWordsArray = changeToArray(queryWords)
      const valueElements = Object.values(book)
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

    const booksWithScores = books.map(book => {
      const score = calculateMatchScore(book, queryWords)

      // Umbral de coincidencia deseado
      if (score < queryWords.length * 0.7) return null

      return { book, score } // Devolvemos el libro junto con su puntaje si pasa la validación
    })
      .filter(item => item !== null).slice(0, l)
      .filter(item => item.book.disponibilidad === 'Disponible')

    // Ordenamos los libros por el puntaje en orden descendente
    booksWithScores.sort((a, b) => b.score - a.score)

    // Solo los datos del libro, no del puntaje
    return booksWithScores.map(item => bookObject(item.book))
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

      const bookIndex = books.findIndex(book => book._id === id)
      if (bookIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      data.actualizadoEn = new Date()

      // Actualiza los datos del usuario
      Object.assign(books[bookIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
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

  static async forYouPage (user = {}, l) {
    const books = this.getAllBooks()
    // Mostrar libros en base a preferencias etc
    return books
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
}

export { BooksModel }
