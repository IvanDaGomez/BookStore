/* eslint-disable camelcase */

import crypto from 'node:crypto'
import { validateBook, validatePartialBook } from '../../assets/validate.js'

import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { chromium } from 'playwright'
import { scrapingFunctions } from '../../assets/scrappingConfig.js'
// import { helperImg } from '../../assets/helperImg.js'

import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'
import { createNotification } from '../../assets/notifications/createNotification.js'
import { updateTrends } from '../../assets/trends/updateTrends.js'
import { updateUserSearchHistory } from '../../assets/trends/updateUserSearchHistory.js'
import { updateUserPreferences } from '../../assets/trends/updateUserPreferences.js'
export class BooksController {
  constructor ({ UsersModel, BooksModel }) {
    this.UsersModel = UsersModel
    this.BooksModel = BooksModel
  }

  getAllBooks = async (req, res) => {
    try {
      const books = await this.BooksModel.getAllBooks()
      if (!books) {
        res.status(500).json({ error: 'Error al leer libros' })
      }
      res.json(books)
    } catch (err) {
      console.error('Error al leer libros:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  getBookById = async (req, res) => {
    try {
      const { bookId } = req.params
      const book = await this.BooksModel.getBookById(bookId)

      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      const update = req.headers.update === book._id
      const user = req.session.user
      if (update) {
        const bookCopy = JSON.parse(JSON.stringify(book)) // asegurás que es limpio y plano
        await updateUserPreferences(user, bookCopy, 'openedBook')
        await updateUserSearchHistory(user, bookCopy, 'openedBook')
        await updateTrends(bookCopy, 'openedBook')
      }

      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }
      res.json(book)
    } catch (err) {
      console.error('Error al leer el libro:', err)
      res.status(500).json({ error: 'Error al leer el libro' })
    }
  }

  getBookByQuery = async (req, res) => {
    try {
      let { q, l } = req.query
      q = cambiarGuionesAEspacio(q)

      if (!q) {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      if (!l) {
        l = 24
      }
      const books = await this.BooksModel.getBookByQuery(q, l)
      if (books.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }
      const user = req.session.user
      for (const book of books.slice(0, 3)) {
        const bookCopy = JSON.parse(JSON.stringify(book))
        await updateUserPreferences(user, bookCopy, 'query')
        await updateUserSearchHistory(user, bookCopy, 'query')
        await updateTrends(bookCopy, 'query')
      }
      res.json(books)
    } catch (err) {
      console.error('Error al leer libros por consulta:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  getBooksByQueryWithFilters = async (req, res) => {
    let { categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado, q, l } = req.query
    categoria = cambiarGuionesAEspacio(categoria)
    ubicacion = cambiarGuionesAEspacio(ubicacion)
    edad = cambiarGuionesAEspacio(edad)
    tapa = cambiarGuionesAEspacio(tapa)
    fechaPublicacion = cambiarGuionesAEspacio(fechaPublicacion)
    idioma = cambiarGuionesAEspacio(idioma)
    estado = cambiarGuionesAEspacio(estado)

    if (!q) {
      return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
    }

    l = parseInt(l) || 24

    const filterObj = {
      categoria,
      ubicacion,
      edad,
      tapa,
      fechaPublicacion,
      idioma,
      estado
    }

    try {
      const query = {
        query: q,
        where: {},
        limit: l,
        offset: 0
      }

      Object.keys(filterObj).forEach((filterKey) => {
        const value = filterObj[filterKey]
        if (value) {
          query.where[filterKey] = value
        }
      })

      const books = await this.BooksModel.getBooksByQueryWithFilters(query)

      if (books.length === 0) {
        return res.status(404).json({ message: 'No books found matching your filters.' })
      }

      return res.status(200).json({ books })
    } catch (error) {
      console.error('Error fetching books:', error)
      return res.status(500).json({ error: 'An error occurred while fetching the books.' })
    }
  }

  createBook = async (req, res) => {
    const data = req.body
    try {
      if (data.oferta) data.oferta = parseInt(data.oferta)
      data.precio = parseInt(data.precio)
      if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      } else {
        data.keywords = []
      }

      if (req.files) data.images = req.files.map(file => `${file.filename}`)

      const validated = validateBook(data)
      if (!validated.success) {
        console.error('Error de validación:', validated.error)
        return res.status(400).json({ error: validated.error })
      }
      const user = await this.UsersModel.getUserById(data.idVendedor)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      if (!user.rol || user.rol === 'usuario') {
        user.rol = 'Vendedor'
      }
      const updated = await this.UsersModel.updateUser(user._id, {
        librosIds: [...(user?.librosIds || []), data._id],
        rol: user?.rol || 'Usuario'
      })

      if (!updated) {
        return res.status(404).json({ error: 'Usuario no actualizado' })
      }

      const book = await this.BooksModel.createBook(data)
      if (typeof book === 'string' && book.startsWith('Error')) {
        return res.status(500).json({ error: book })
      }
      if (!book) {
        return res.status(500).json({ error: 'Error al crear libro' })
      }

      const notification = await sendNotification(createNotification(data, 'bookPublished'))

      const correo = await this.UsersModel.getEmailById(data.idVendedor)
      if (!correo || !notification) {
        console.error('No se pudo enviar el correo o la notificación')
      }
      await sendEmail(`${data.vendedor} ${correo.correo}`, 'Libro publicado con éxito', createEmail(data, 'bookPublished'))
      res.send({ book })
    } catch (error) {
      console.error('Error al crear el libro:', error)
      res.status(500).json({ error: error.message })
    }
  }

  deleteBook = async (req, res) => {
    try {
      const { bookId } = req.params

      const book = await this.BooksModel.getBookById(bookId)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      const user = await this.UsersModel.getUserById(book.idVendedor)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      const updatedLibrosIds = user.librosIds.filter(id => id !== bookId)

      const updatedUser = await this.UsersModel.updateUser(user._id, {
        librosIds: updatedLibrosIds
      })

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no actualizado' })
      }

      const result = await this.BooksModel.deleteBook(bookId)
      if (!result) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      res.json({ message: 'Libro eliminado con éxito', result })
    } catch (err) {
      console.error('Error al eliminar el libro:', err)
      res.status(500).json({ error: 'Error al eliminar el libro' })
    }
  }

  updateBook = async (req, res) => {
    try {
      const { bookId } = req.params
      const data = req.body
      const existingBook = await this.BooksModel.getBookById(bookId)
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      if (data.oferta) data.oferta = parseInt(data.oferta)
      if (data.precio) data.precio = parseInt(data.precio)

      if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      }

      if (req.files) {
        data.images = req.files.map(file => `${file.filename}`)
      }
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error.errors })
      }

      if (data.mensaje && data.tipo) {
        const messagesArray = existingBook.mensajes || []
        if (data.tipo === 'pregunta') {
          const questionIndex = messagesArray.findIndex(item => item[0] === data.mensaje)

          if (questionIndex === -1) {
            messagesArray.push([data.mensaje, '', data.senderId])
          }
        } else if (data.tipo === 'respuesta' && data.pregunta) {
          const questionIndex = messagesArray.findIndex(
            item => item[0] === data.pregunta
          )
          if (questionIndex !== -1) {
            messagesArray[questionIndex][1] = data.mensaje
          }
        }

        data.mensajes = messagesArray
      }
      const allowedFields = [
        'titulo', 'autor', 'precio', 'oferta', 'formato', 'images', 'keywords', 'descripcion',
        'estado', 'genero', 'vendedor', 'idVendedor', 'edicion', 'idioma',
        'ubicacion', 'tapa', 'edad', 'fechaPublicacion', 'actualizadoEn', 'disponibilidad', 'mensajes', 'isbn'
      ]

      const filteredData = {}
      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = data[key]
        }
      })

      const book = await this.BooksModel.updateBook(bookId, filteredData)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado o no actualizado' })
      }

      if (!data.mensaje && !data.tipo) {
        await sendNotification(createNotification(data, 'bookUpdated'))
      }

      res.status(200).json(book)
    } catch (err) {
      console.error('Error al actualizar el libro:', err)
      res.status(500).json({ error: err.message })
    }
  }

  searchByBookTitle = async (req, res) => {
    const { bookTitle } = req.params
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      let results = []

      for (const scrapeFunction of scrapingFunctions) {
        const result = await scrapeFunction(page, bookTitle)
        results = [...results, ...result]
      }

      await browser.close()
      res.json(results)
    } catch (error) {
      await browser.close()
      res.status(500).json({ error: error.message })
    }
  }

  getAllReviewBooks = async (req, res) => {
    try {
      const books = await this.BooksModel.getAllReviewBooks()
      if (!books) {
        res.status(500).json({ error: 'Error al leer libros' })
      }
      res.json(books)
    } catch (err) {
      console.error('Error al leer libros:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  createReviewBook = async (req, res) => {
    const data = req.body
    if (data.oferta) data.oferta = parseInt(data.oferta)
    data.precio = parseInt(data.precio)
    if (data.keywords && typeof data.keywords === 'string') {
      data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
    } else {
      data.keywords = []
    }

    data.images = req.files.map(file => `${file.filename}`)

    const validated = validateBook(data)
    if (!validated.success) {
      console.error('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    if (!data._id) {
      data._id = crypto.randomUUID()
    }

    const book = await this.BooksModel.createReviewBook(data)
    if (typeof book === 'string' && book.startsWith('Error')) {
      return res.status(500).json({ error: book })
    }
    if (!book) {
      return res.status(500).json({ error: 'Error al crear libro' })
    }

    res.send({ book })
  }

  deleteReviewBook = async (req, res) => {
    try {
      const { bookId } = req.params
      const result = await this.BooksModel.deleteReviewBook(bookId)
      if (!result) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      res.json({ message: 'Libro revisión eliminado con éxito', result })
    } catch (err) {
      console.error('Error al eliminar el libro:', err)
      res.status(500).json({ error: 'Error al eliminar el libro' })
    }
  }

  updateReviewBook = async (req, res) => {
    try {
      const { bookId } = req.params
      const data = req.body
      const existingBook = await this.BooksModel.getBookById(bookId)
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      if (data.oferta) data.oferta = parseInt(data.oferta)
      if (data.precio) data.precio = parseInt(data.precio)

      if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      }
      if (data.keywords === '') data.keywords = []
      if (req.files) {
        data.images = req.files.map(file => `${file.filename}`)
      }

      const validated = validatePartialBook(data)
      if (!validated.success) {
        console.error(validated)
        return res.status(400).json({ error: validated.error.errors })
      }

      const allowedFields = [
        'titulo', 'autor', 'precio', 'oferta', 'formato', 'images', 'keywords', 'descripcion',
        'estado', 'genero', 'vendedor', 'idVendedor', 'edicion', 'idioma',
        'ubicacion', 'tapa', 'edad', 'fechaPublicacion', 'actualizadoEn', 'disponibilidad', 'mensajes', 'isbn'
      ]

      const filteredData = {}
      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = data[key]
        }
      })

      filteredData.actualizadoEn = new Date()
      filteredData.method = 'PUT'
      const book = await this.BooksModel.updateReviewBook(bookId, filteredData)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado o no actualizado' })
      }
      res.status(200).json(book)
    } catch (err) {
      console.error('Error al actualizar el libro:', err)
      res.status(500).json({ error: err.message })
    }
  }

  forYouPage = async (req, res) => {
    const { l } = req.query
    const results = await this.BooksModel.forYouPage(req.session.user, l)

    if (!results) {
      return res.status(400).json({ ok: false, error: 'No se encontraron resultados' })
    }

    res.json({ books: results, ok: true })
  }

  getFavoritesByUser = async (req, res) => {
    const { userId } = req.params
    try {
      if (!userId) return res.status(401).json({ error: 'No se proporcionó userId' })
      const user = await this.UsersModel.getUserById(userId)
      if (!user) return res.status(402).json({ error: 'No se encontró el usuario' })
      const favorites = await this.BooksModel.getFavoritesByUser(user?.favoritos || [])
      if (!favorites) return res.status(400).json({ error: 'No hay favoritos' })

      res.json({ data: favorites })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  predictInfo = async (req, res) => {
    try {
      const file = req.file
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }
      const info = await this.BooksModel.predictInfo(file)

      res.json({
        data: {
          title: info.title,
          author: info.author
        },
        ok: true
      })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }
}
