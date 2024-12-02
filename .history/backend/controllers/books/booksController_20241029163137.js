import { BooksModel } from '../../models/books/local/booksLocal.js'
import crypto from 'node:crypto'
import { validateBook, validatePartialBook } from '../../assets/validate.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { helperImg } from '../../assets/helperImg.js'

export class BooksController {
  static async getAllBooks (req, res) {
    try {
      const books = await BooksModel.getAllBooks()
      if (!books) {
        res.status(500).json({ error: 'Error al leer libros' })
      }
      res.json(books)
    } catch (err) {
      console.error('Error al leer libros:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  static async getBookById (req, res) {
    try {
      const { bookId } = req.params
      const book = await BooksModel.getBookById(bookId)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }
      res.json(book)
    } catch (err) {
      console.error('Error al leer el libro:', err)
      res.status(500).json({ error: 'Error al leer el libro' })
    }
  }

  static async getBookByQuery (req, res) {
    try {
      let { q, l } = req.query // Obtener el valor del parámetro de consulta 'q'
      q = cambiarGuionesAEspacio(q)

      if (!q) {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      if (!l) {
        l = 24
      }

      const books = await BooksModel.getBookByQuery(q, l) // Asegurarse de implementar este método en BooksModel
      if (books.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }

      res.json(books)
    } catch (err) {
      console.error('Error al leer libros por consulta:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  // Filtrar libros
  static async createBook (req, res) {
    const data = req.body

    if (data.oferta) data.oferta = parseInt(data.oferta)
    data.precio = parseInt(data.precio)
    // Manejo de keywords
    if (data.keywords && typeof data.keywords === 'string') {
      data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
    } else {
      data.keywords = [] // O manejar como sea necesario si no se proporcionan keywords
    }

    // Imágenes
    // Diferentes tamaños
    data.images = req.files.map(file => `${file.filename}`)

    // En un futuro para imágenes de distintos tamaños

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
      return res.status(500).json({ error: 'Error al crear libro' })
    }

    // Si todo es exitoso, devolver el libro creado
    res.send({ book })
  }

  static async deleteBook (req, res) {
    try {
      const { bookId } = req.params

      // Obtener los detalles del libro para encontrar al vendedor (idVendedor)
      const book = await UsersModel.getBookById(bookId)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      // Obtener el usuario asociado con el libro
      const user = await UsersModel.getUserById(book.idVendedor)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      // Eliminar el bookId del array librosIds del usuario
      const updatedLibrosIds = user.librosIds.filter(id => id !== bookId)

      // Actualizar el usuario con los nuevos librosIds
      const updatedUser = await UsersModel.updateUser(user._id, {
        librosIds: updatedLibrosIds
      })

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no actualizado' })
      }

      // Eliminar el libro de la base de datos
      const result = await BooksModel.deleteBook(bookId)
      if (!result) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      res.json({ message: 'Libro eliminado con éxito', result })
    } catch (err) {
      console.error('Error al eliminar el libro:', err)
      res.status(500).json({ error: 'Error al eliminar el libro' })
    }
  }

  static async updateBook (req, res) {
    try {
      const { bookId } = req.params
      const data = req.body

      // Obtener el libro existente para obtener los mensajes actuales
      const existingBook = await BooksModel.getBookById(bookId)
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      // Asegúrate de que los precios y ofertas sean números
      if (data.oferta) data.oferta = parseInt(data.oferta)
      if (data.precio) data.precio = parseInt(data.precio)

      // Manejo de keywords
      if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      } else {
        data.keywords = [] // Manejo de caso si no se proporcionan keywords
      }

      // Imágenes
      if (req.files) {
        data.images = req.files.map(file => `${file.filename}`)
      }

      // Validar datos
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: 'Error al validar libro', details: validated.error.errors })
      }
      // Manejo del mensaje
      if (data.mensaje && data.tipo) {
        // Inicializa el array de mensajes si no existe
        const messagesArray = existingBook.mensajes || []

        if (data.tipo === 'pregunta') {
          // Verifica si la pregunta ya existe
          const questionIndex = messagesArray.findIndex(item => item[0] === data.mensaje)

          if (questionIndex === -1) { // Si no se encuentra, se puede agregar
            messagesArray.push([data.mensaje, ''])
          }
        } else if (data.tipo === 'respuesta' && data.pregunta) {
          // Busca la pregunta correspondiente
          const questionIndex = messagesArray.findIndex(
            item => item[0] === data.pregunta // Verificamos si el mensaje.pregunta coincide con el mensaje
          )
          if (questionIndex !== -1) {
            // Si encontramos la pregunta, agregamos la respuesta
            messagesArray[questionIndex][1].push(data.mensaje)
          }
        }

        data.mensajes = messagesArray // Actualiza los mensajes en los datos
      }
      // Filtrar los campos permitidos
      const allowedFields = [
        'titulo', 'autor', 'precio', 'oferta', 'formato', 'images', 'keywords', 'descripcion',
        'estado', 'genero', 'vendedor', 'idVendedor', 'edicion', 'idioma',
        'ubicacion', 'tapa', 'edad', 'fechaPublicacion', 'actualizadoEn', 'disponibilidad', 'mensajes'
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
        return res.status(404).json({ error: 'Libro no encontrado o no actualizado' })
      }

      res.status(200).json(book)
    } catch (err) {
      console.error('Error al actualizar el libro:', err)
      res.status(500).json({ error: err.message })
    }
  }
}
