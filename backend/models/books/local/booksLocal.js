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
  static async getBookByQuery (query) {
    const books = await this.getAllBooks()

    // Función para calcular el nivel de coincidencia entre la query y los resultados
    const calculateMatchScore = (book, queryWords) => {
      let score = 0
      const tolerance = 2 // Ajusta este valor para más o menos tolerancia

      for (const value of Object.values(book)) {
        if (typeof value === 'string') {
          const valueWords = value.split(' ')
          for (const queryWord of queryWords) {
            valueWords.forEach(word => {
              const distance = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
              if (distance <= tolerance) {
                score += 1 // Incrementa el score si la distancia está dentro del umbral de tolerancia
              }
            })
          }
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string') {
              const itemWords = item.split(' ')
              for (const queryWord of queryWords) {
                itemWords.forEach(word => {
                  const distance = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
                  if (distance <= tolerance) {
                    score += 1
                  }
                })
              }
            }
          })
        }
      }

      return score
    }

    // Dividimos la query en palabras
    const queryWords = query.split(' ')

    // Recorremos todos los libros y calculamos el puntaje de coincidencia
    const booksWithScores = books.map(book => {
      const score = calculateMatchScore(book, queryWords)

      // Ajusta aquí el umbral de coincidencia deseado
      if (score < queryWords.length * 0.5) return null // Más estricto: cambia a 0.7 o menos tolerante: cambia a 0.3

      return { book, score } // Devolvemos el libro junto con su puntaje si pasa la validación
    })
      .filter(item => item !== null) // Filtramos los resultados nulos

    // Ordenamos los libros por el puntaje en orden descendente
    booksWithScores.sort((a, b) => b.score - a.score)

    // Devolvemos los libros ordenados, pero solo los datos del libro
    return booksWithScores.map(item => item.book)
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
        disponibilidad: data.disponibilidad || 'Disponible'

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
      if (data.mail) {
        const emailRepeated = books.splice(bookIndex, 1).some(book => book.mail === data.mail)
        if (emailRepeated) {
          throw new Error('Email is already in use')
        }
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
}

export { BooksModel }
