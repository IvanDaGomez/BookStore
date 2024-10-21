import { BooksModel } from '../../models/books/local/booksLocal.js'
import crypto from 'node:crypto'
import { validateBook, validatePartialBook } from '../../assets/validate.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { helperImg } from '../../assets/helperImg.js'
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
export class BooksController {
  static async getAllBooks (req, res) {
    try {
      const books = await BooksModel.getAllBooks()
      if (!books) {
        res.status(500).json({ error: 'Cannot read books' })
      }
      res.json(books)
    } catch (err) {
      console.error('Error reading books:', err)
      res.status(500).json({ error: 'Error reading books' })
    }
  }

  static async getBookById (req, res) {
    try {
      const { bookId } = req.params
      const book = await BooksModel.getBookById(bookId)
      if (!book) {
        return res.status(404).json({ error: 'Book not found' })
      }
      res.json(book)
    } catch (err) {
      console.error('Error reading book:', err)
      res.status(500).json({ error: 'Error reading book' })
    }
  }

  static async getBookByQuery (req, res) {
    try {
      let { q } = req.query // Obtener el valor del parámetro de consulta 'q'
      q = cambiarGuionesAEspacio(q)

      if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" es requerido' })
      }

      const books = await BooksModel.getBookByQuery(q) // Asegurarse de implementar este método en BooksModel
      if (books.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }

      res.json(books)
    } catch (err) {
      console.error('Error leyendo libros por query:', err)
      res.status(500).json({ error: 'Error leyendo libros' })
    }
  }

  // Filter books
  static async createBook (req, res) {
    const data = req.body

    if (data.oferta) data.oferta = parseInt(data.oferta)
    data.precio = parseInt(data.precio)
    // Manejo de keywords
    if (data.keywords && typeof data.keywords === 'string') {
      data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
    } else {
      data.keywords = [] // Or handle as needed if no keywords are provided
    }

    // Imagenes
    // Diferentes tamaños
    data.images = req.files.map(file => `${file.filename}`)

    // En un futuro para imagenes de distintos tamaños

    /* console.log(req.files)
    // Usar Promise.all para esperar a que todas las imágenes sean procesadas
    await Promise.all(req.files.map(file => {
      return Promise.all([
        helperImg(`${file.filePath}/${file.filename}`, `small-${file.filename}`, '20'),
        helperImg(file.path, `medium-${file.filename}`, '200'),
        helperImg(file.path, `large-${file.filename}`, '500'),
        helperImg(file.path, `extraLarge-${file.filename}`, '1000')
      ])
    })) */

    // Validación
    const validated = validateBook(data)
    if (!validated.success) {
      console.log('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    // Asignar un ID único al libro
    data._id = crypto.randomUUID()

    // Agregar el ID del libro al usuario
    const user = await UsersModel.getUserById(data.idVendedor)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const updated = await UsersModel.updateUser(user._id, {
      librosIds: [...user.librosIds, data._id]
    })

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no actualizado' })
    }

    const time = new Date()
    data.creadoEn = time
    data.actualizadoEn = time

    // Crear el libro en la base de datos
    const book = await BooksModel.createBook(data)
    if (typeof book === 'string' && book.startsWith('Error')) {
      return res.status(500).json({ error: book })
    }
    if (!book) {
      return res.status(500).json({ error: 'Error creando libro' })
    }

    // Si todo es exitoso, devolver el libro creado
    res.send({ book })
  }
  /*
  static async uploadImage (req, res) {
    try {
      // Example: validate image size/type in booksController
      if (!req.file.mimetype.startsWith('image/')) {
        return res.status(400).json({ error: 'Invalid file type.' })
      }
      if (req.file.size > 5 * 1024 * 1024) { // 5MB
        return res.status(400).json({ error: 'File too large.' })
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo' })
      }

      // La imagen fue subida correctamente
      const imageUrl = `/uploads/${req.file.filename}` // Ruta relativa del archivo

      // Aquí podrías guardar la URL en tu base de datos, si lo necesitas
      // Por ejemplo: await Book.updateOne({ _id: req.bookId }, { image: imageUrl });

      res.status(200).json({
        message: 'Imagen subida con éxito',
        imageUrl // Devuelve la URL de la imagen
      })
    } catch (err) {
      console.error('Error al subir la imagen:', err)
      res.status(500).json({ error: 'Error al subir la imagen' })
    }
  };
*/

  static async deleteBook (req, res) {
    try {
      const { bookId } = req.params
      const result = await BooksModel.deleteBook(bookId)
      if (!result) {
        return res.status(404).json({ error: 'Book not found' })
      }
      res.json(result)
    } catch (err) {
      console.error('Error deleting book:', err)
      res.status(500).json({ error: 'Error deleting book' })
    }
  }

  static async updateBook (req, res) {
    // Las imagenes pasarlas a algo permanente
    try {
      const { bookId } = req.params
      const data = req.body

      if (data.oferta) data.oferta = parseInt(data.oferta)
      data.precio = parseInt(data.precio)
      // Manejo de keywords
      if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      } else {
        data.keywords = [] // Or handle as needed if no keywords are provided
      }
      // Imagenes
      // Diferentes tamaños
      if (req.files) data.images = req.files.map(file => `${file.filename}`)
      // Validar datos
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: 'Error Validating book', details: validated.error.errors })
      }

      // Filtrar los campos permitidos
      const allowedFields = [
        'titulo', 'autor', 'precio', 'images', 'keywords', 'descripcion',
        'estado', 'genero', 'vendedor', 'idVendedor', 'edicion', 'idioma',
        'ubicacion', 'tapa', 'edad', 'fechaPublicacion', 'disponibilidad'
      ]
      const filteredData = {}
      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = data[key]
        }
      })

      filteredData.actualizadoEn = new Date()

      // Actualizar libro
      const book = await BooksModel.updateBook(bookId, filteredData)
      if (!book) {
        res.status(404).json({ error: 'Book not found or not updated' })
      }

      res.status(200).json(book)
    } catch (err) {
      console.error('Error updating book:', err)
      res.status(500).json({ error: err })
    }
  }
}
