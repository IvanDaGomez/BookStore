import fs from 'node:fs/promises'
import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
/* {
    "titulo": "Harry Potter y la Cámara Secreta",
    "autor": "Warner Bros",
    "precio": 100000,
    "images":  ["https://images.cdn2.buscalibre.com/fit-in/360x360/ad/4d/ad4df4ba516014a9fc39a0288a70957f.jpg", "https://images.cdn2.buscalibre.com/fit-in/360x360/ad/4d/ad4df4ba516014a9fc39a0288a70957f.jpg", "https://images.cdn3.buscalibre.com/fit-in/360x360/61/8d/618d227e8967274cd9589a549adff52d.jpg" ],
    "keywords": ["fantasía", "Harry Potter", "J.K. Rowling"],
    "id": "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14",
    "descripcion": "Esta es la descripción",
    "estado" : "Usado",
    "genero": "Novela",
    "vendedor": "Ivan Gómez",
    "idVendedor" : "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13321",
    "edicion": "1",
    "idioma": "Español",
    "ubicacion": "Bucaramanga",
    "tapa":"Dura",
    "edad":"Jóvenes",
    "fechaPublicacion": "2024-10-01",
    "disponibilidad" : "Disponible"

} */
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
      return book
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
      let score = 0
      const tolerance = 2 // Tolerancia de letras equivocadas

      const queryWordsArray = changeToArray(queryWords)
      const valueElements = Object.values(book)
      const stringValueWords = []

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
    }).filter(item => item !== null).slice(0, l)

    // Ordenamos los libros por el puntaje en orden descendente
    booksWithScores.sort((a, b) => b.score - a.score)

    // Solo los datos del libro, no del puntaje
    return booksWithScores.map(item => item.book)
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
    return books
  }

  static async createBook (data) {
    try {
      const books = await this.getAllBooks()

      // Crear valores por defecto
      const newBook = {
        titulo: data.titulo || '',
        autor: data.autor || '',
        precio: data.precio || 0,
        oferta: data.oferta || null,
        images: data.images || [],
        keywords: data.keywords || [],
        _id: data._id,
        descripcion: data.descripcion || '',
        estado: data.estado || 'Nuevo',
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
        mensajes: data.mensajes || []

      }

      books.push(newBook)
      await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))
      return newBook
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

      // Actualiza los datos del usuario
      Object.assign(books[bookIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/books.json', JSON.stringify(books, null, 2))

      return books[bookIndex]
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

      // Crear valores por defecto
      const newBook = {
        titulo: data.titulo || '',
        autor: data.autor || '',
        precio: data.precio || 0,
        oferta: data.oferta || null,
        images: data.images || [],
        keywords: data.keywords || [],
        _id: data._id,
        descripcion: data.descripcion || '',
        estado: data.estado || 'Nuevo',
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
        mensajes: data.mensajes || []

      }

      books.push(newBook)
      await fs.writeFile('./models/booksBackStage.json', JSON.stringify(books, null, 2))
      return newBook
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
}

export { BooksModel }
