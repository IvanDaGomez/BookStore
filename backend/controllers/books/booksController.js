/* eslint-disable camelcase */

import crypto from 'node:crypto'
import { validateBook, validatePartialBook } from '../../assets/validate.js'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { chromium } from 'playwright'
import { scrapingFunctions } from '../../assets/scrappingConfig.js'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'
import { createNotification } from '../../assets/notifications/createNotification.js'
import { filterData, prepareCreateBookData, prepareUpdateBookData } from './prepareCreateBookData.js'
import { updateData } from './updateData.js'
// import { helperImg } from '../../assets/helperImg.js'

export class BooksController {
  constructor ({ UsersModel, BooksModel }) {
    /*
      Utilizamos este estilo de importación para hacer inyecciones de dependencias
      en lugar de importar directamente los modelos en este archivo
    */
    this.UsersModel = UsersModel
    this.BooksModel = BooksModel
  }

  getAllBooks = async (req, res, next) => {
    /*
      Aquí se obtiene todos los libros de la base de datos y se envían como respuesta.
      Si no se encuentran libros, se envía un error 500.
    */
    try {
      const books = await this.BooksModel.getAllBooks()
      if (!books) {
        res.status(500).json({ error: 'Error al leer libros' })
      }
      res.json(books)
    } catch (err) {
      next(err)
    }
  }

  getBookById = async (req, res, next) => {
    /*
      Aquí se obtiene un libro específico por su ID y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
    */
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
        await updateData(user, bookCopy, 'openedBook')
      }
      res.json(book)
    } catch (err) {
      next(err)
    }
  }

  getBookByQuery = async (req, res, next) => {
    /*
      Aquí se obtiene libros específicos por su query y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
      Las consultas actualizan las estadísticas de los libros y los usuarios.
    */
    try {
      let { q, l } = req.query

      // Validación de la query
      if (q) {
        q = cambiarGuionesAEspacio(q)
      } else {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      l = parseInt(l) || 24

      if (l > 100) {
        l = 100
      }
      // Consigue los libros del modelo
      const books = await this.BooksModel.getBookByQuery(q, l)
      if (books.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }
      // Si hay usuario en la sesión, actualiza las estadísticas de los libros
      const user = req.session.user
      if (user) {
        for (const book of books.slice(0, 3)) {
          const bookCopy = JSON.parse(JSON.stringify(book))
          await updateData(user, bookCopy, 'query')
        }
      }
      res.json(books)
    } catch (err) {
      next(err)
    }
  }

  getBooksByQueryWithFilters = async (req, res, next) => {
    /*
      Aquí se obtiene libros específicos por su query y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
      Las consultas actualizan las estadísticas de los libros y los usuarios.
      Se pueden aplicar filtros como categoría, ubicación, edad, tapa, fecha de publicación, idioma y estado.
    */
    try {
      let { categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado, q, l } = req.query

      const filters = { categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado }
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          filters[key] = cambiarGuionesAEspacio(filters[key])
        }
      })
      ;({ categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado } = filters)

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
        return res.status(404).json({ error: 'No se encontraron libros' })
      }

      res.status(200).json({ books })
    } catch (err) {
      next(err)
    }
  }

  createBook = async (req, res, next) => {
    /*
      Aquí se crea un libro nuevo con el modelo.
      Si no se encuentra el libro, se envía un error 500.
      Se valida el libro y se envía una notificación al vendedor.
    */
    let data = req.body
    try {
      data = prepareCreateBookData(data, req)
      const validated = validateBook(data)
      if (!validated.success) {
        console.error('Error de validación:', validated.error)
        return res.status(400).json({ error: validated.error })
      }
      // Recibe el usuario para actualizar sus librosIds
      const user = await this.UsersModel.getUserById(data.idVendedor)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      // Turn user to Vendedor if not already
      if (!user.rol || user.rol === 'usuario') {
        user.rol = 'vendedor'
      }
      const updated = await this.UsersModel.updateUser(user._id, {
        librosIds: [...(user?.librosIds || []), data._id],
        rol: user.rol
      })

      if (!updated) {
        return res.status(404).json({ error: 'Usuario no actualizado' })
      }

      const book = await this.BooksModel.createBook(data)

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
    } catch (err) {
      next(err)
    }
  }

  deleteBook = async (req, res, next) => {
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
      next(err)
    }
  }

  updateBook = async (req, res, next) => {
    try {
      const { bookId } = req.params
      let data = req.body
      const existingBook = await this.BooksModel.getBookById(bookId)
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      data = prepareUpdateBookData(data, req, existingBook)
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error.errors })
      }

      const filteredData = filterData(data)
      const book = await this.BooksModel.updateBook(bookId, filteredData)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado o no actualizado' })
      }

      if (!data.mensaje && !data.tipo) {
        await sendNotification(createNotification(data, 'bookUpdated'))
      }

      res.status(200).json(book)
    } catch (err) {
      next(err)
    }
  }

  searchByBookTitle = async (req, res, next) => {
    const browser = await chromium.launch({ headless: true })
    try {
      const { bookTitle } = req.params
      const context = await browser.newContext()
      const page = await context.newPage()

      let results = []

      for (const scrapeFunction of scrapingFunctions) {
        const result = await scrapeFunction(page, bookTitle)
        results = [...results, ...result]
      }

      await browser.close()
      res.json(results)
    } catch (err) {
      await browser.close()
      next(err)
    }
  }

  getAllReviewBooks = async (req, res, next) => {
    try {
      const books = await this.BooksModel.getAllReviewBooks()
      if (!books) {
        res.status(500).json({ error: 'Error al leer libros' })
      }
      res.json(books)
    } catch (err) {
      next(err)
    }
  }

  createReviewBook = async (req, res, next) => {
    try {
      let data = req.body

      const validated = validateBook(data)
      if (!validated.success) {
        console.error('Error de validación:', validated.error)
        return res.status(400).json({ error: validated.error })
      }
      data = prepareCreateBookData(data, req)
      if (!data._id) {
        data._id = crypto.randomUUID()
      }

      const book = await this.BooksModel.createReviewBook(data)

      if (!book) {
        return res.status(500).json({ error: 'Error al crear libro' })
      }

      res.send({ book })
    } catch (err) {
      next(err)
    }
  }

  deleteReviewBook = async (req, res, next) => {
    try {
      const { bookId } = req.params
      const result = await this.BooksModel.deleteReviewBook(bookId)
      if (!result) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      res.json({ message: 'Libro revisión eliminado con éxito', result })
    } catch (err) {
      next(err)
    }
  }

  updateReviewBook = async (req, res, next) => {
    try {
      const { bookId } = req.params
      let data = req.body
      const existingBook = await this.BooksModel.getBookById(bookId)
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      data = prepareUpdateBookData(data, req, existingBook)
      const validated = validatePartialBook(data)
      if (!validated.success) {
        console.error(validated)
        return res.status(400).json({ error: validated.error.errors })
      }
      const filteredData = filterData(data)
      filteredData.actualizadoEn = new Date().toISOString()
      filteredData.method = 'PUT'
      const book = await this.BooksModel.updateReviewBook(bookId, filteredData)
      if (!book) {
        return res.status(404).json({ error: 'Libro no encontrado o no actualizado' })
      }
      res.status(200).json(book)
    } catch (err) {
      next(err)
    }
  }

  forYouPage = async (req, res, next) => {
    try {
      const { l } = req.query
      const results = await this.BooksModel.forYouPage(req.session.user, l)

      if (!results) {
        return res.status(400).json({ ok: false, error: 'No se encontraron resultados' })
      }

      res.json({ books: results, ok: true })
    } catch (err) {
      next(err)
    }
  }

  getFavoritesByUser = async (req, res, next) => {
    const { userId } = req.params
    try {
      if (!userId) return res.status(401).json({ error: 'No se proporcionó userId' })
      const user = await this.UsersModel.getUserById(userId)
      if (!user) return res.status(402).json({ error: 'No se encontró el usuario' })
      const favorites = await this.BooksModel.getFavoritesByUser(user?.favoritos || [])
      if (!favorites) return res.status(400).json({ error: 'No hay favoritos' })

      res.json({ data: favorites })
    } catch (err) {
      next(err)
    }
  }

  predictInfo = async (req, res, next) => {
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
    } catch (err) {
      next(err)
    }
  }
}
