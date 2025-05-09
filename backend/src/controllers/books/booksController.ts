/* eslint-disable camelcase */

import crypto from 'node:crypto'
import { validateBook, validatePartialBook } from '../../assets/validate.js'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { chromium } from 'playwright'
import {
  ScrapeResponseType,
  scrapingFunctions
} from '../../assets/scrappingConfig.js'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'
import { createNotification } from '../../assets/notifications/createNotification.js'
import {
  filterData,
  prepareCreateBookData,
  prepareUpdateBookData
} from './prepareCreateBookData.js'
import { updateData } from './updateData.js'
import { IBooksModel, IUsersModel } from '../../types/models'
import express from 'express'
import { ParsedQs } from 'qs'
import { ID, ISOString } from '../../types/objects'
import { AuthToken } from '../../types/authToken'
import { BookObjectType } from '../../types/book'
import { CollectionObjectType } from '../../types/collection'

// import { helperImg } from '../../assets/helperImg.js'

export class BooksController {
  private UsersModel: IUsersModel
  private BooksModel: IBooksModel
  constructor ({
    UsersModel,
    BooksModel
  }: {
    UsersModel: IUsersModel
    BooksModel: IBooksModel
  }) {
    /*
      Utilizamos este estilo de importación para hacer inyecciones de dependencias
      en lugar de importar directamente los modelos en este archivo
    */
    this.UsersModel = UsersModel
    this.BooksModel = BooksModel
  }

  getAllBooks = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene todos los libros de la base de datos y se envían como respuesta.
      Si no se encuentran libros, se envía un error 500.
    */
    try {
      const books = await this.BooksModel.getAllBooks()
      return res.json(books)
    } catch (err) {
      next(err)
    }
  }

  getBookById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene un libro específico por su ID y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
    */
    try {
      const bookId = req.params.book_id as ID
      const book = await this.BooksModel.getBookById(bookId)

      const update = req.headers.update === book.id
      const user = req.session.user as AuthToken | undefined
      if (update && user) {
        const bookCopy = JSON.parse(JSON.stringify(book)) // aseguro que es limpio y plano
        // await updateData(user, bookCopy, 'openedBook')
      }
      return res.json(book)
    } catch (err) {
      next(err)
    }
  }
  getBooksByIdList = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene libros específicos por su ID y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
    */
    try {
      const ids = req.params.ids

      const idsArray = ids.split(',').map(id => id.trim()) as ID[]
      if (!ids || ids.length === 0) {
        return res.status(400).json({ error: 'No se proporcionaron IDs' })
      }

      const books = await this.BooksModel.getBooksByIdList(
        idsArray,
        idsArray.length
      )
      return res.json(books)
    } catch (err) {
      next(err)
    }
  }
  getBookByQuery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene libros específicos por su query y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
      Las consultas actualizan las estadísticas de los libros y los usuarios.
    */

    try {
      let { q, l } = req.query as { q: string | ParsedQs; l: string | ParsedQs }
      console.log(q)
      // Validación de la query
      if (q) {
        q = cambiarGuionesAEspacio(q as string)
      } else {
        return res
          .status(400)
          .json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      let lParsed: number = parseInt((l as string) ?? '24', 10)

      if (lParsed > 100) lParsed = 100
      // Consigue los libros del modelo

      const books = await this.BooksModel.getBookByQuery(q, lParsed)

      // Si hay usuario en la sesión, actualiza las estadísticas de los libros
      const user = req.session.user as AuthToken | undefined
      if (user) {
        for (const book of books.slice(0, 3)) {
          const bookCopy: Partial<BookObjectType> = JSON.parse(
            JSON.stringify(book)
          )
          // await updateData(user, bookCopy, 'query')
        }
      }
      return res.json(books)
    } catch (err) {
      next(err)
    }
  }

  getBooksByQueryWithFilters = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene libros específicos por su query y se envía como respuesta.
      Si no se encuentra el libro, se envía un error 404.
      Las consultas actualizan las estadísticas de los libros y los usuarios.
      Se pueden aplicar filtros como categoría, ubicación, edad, tapa, fecha de publicación, idioma y estado.
    */
    try {
      let { q, l, ...filters } = req.query

      if (!q || typeof q !== 'string') {
        return res
          .status(400)
          .json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      Object.keys(filters).forEach(key => {
        const filterKey = key as keyof typeof filters
        if (filters[filterKey]) {
          filters[filterKey] = cambiarGuionesAEspacio(
            filters[filterKey] as string
          )
        }
      })

      const lParsed = parseInt(l as string, 10) || 24

      const books = await this.BooksModel.getBooksByQueryWithFilters(
        q,
        filters,
        lParsed
      )

      if (books.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }

      res.status(200).json(books)
    } catch (err) {
      next(err)
    }
  }

  createBook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se crea un libro nuevo con el modelo.
      Si no se encuentra el libro, se envía un error 500.
      Se valida el libro y se envía una notificación al vendedor.
    */

    let data: BookObjectType = req.body
    try {
      data = await prepareCreateBookData(data, req)

      const validated = validateBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error })
      }

      // Recibe el usuario para actualizar sus librosIds
      const user = await this.UsersModel.getUserById(data.id_vendedor)

      // Turn user to Vendedor if not already
      if (user.rol === 'usuario') {
        user.rol = 'vendedor'
      }
      await this.UsersModel.updateUser(user.id, {
        libros_ids: [...(user.libros_ids ?? []), data.id],
        rol: user.rol
      })
      const book = await this.BooksModel.createBook(data)
      const notificationData = {}
      await sendNotification(
        createNotification(notificationData, 'bookPublished')
      )

      const correo = await this.UsersModel.getEmailById(data.id_vendedor)

      await sendEmail(
        `${data.vendedor} ${correo.correo}`,
        'Libro publicado con éxito',
        createEmail({ book }, 'bookPublished')
      )

      res.json(book)
    } catch (err) {
      next(err)
    }
  }

  deleteBook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const bookId = req.params.book_id as ID

      const book = await this.BooksModel.getBookById(bookId)

      const user = await this.UsersModel.getUserById(book.id_vendedor)

      const updatedLibrosIds = user.libros_ids.filter(id => id !== bookId)

      await this.UsersModel.updateUser(user.id, {
        libros_ids: updatedLibrosIds
      })

      const result = await this.BooksModel.deleteBook(bookId)

      return res.json(result)
    } catch (err) {
      next(err)
    }
  }

  updateBook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const bookId = req.params.book_id as ID
      const rawData = req.body
      const existingBook = await this.BooksModel.getBookById(bookId)

      const data = await prepareUpdateBookData(rawData, req, existingBook)
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error.errors })
      }

      const filteredData = filterData(data)
      const book = await this.BooksModel.updateBook(bookId, filteredData)

      if (!rawData.mensaje && !rawData.tipo) {
        const notificationData = {}
        await sendNotification(
          createNotification(notificationData, 'bookUpdated')
        )
      }

      res.status(200).json(book)
    } catch (err) {
      next(err)
    }
  }

  searchByBookTitle = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const browser = await chromium.launch({ headless: true })
    try {
      const bookTitle = req.params.book_title as string
      const context = await browser.newContext()
      const page = await context.newPage()

      let results: ScrapeResponseType[] = []

      for (const scrapeFunction of scrapingFunctions) {
        const result = await scrapeFunction(page, bookTitle)
        results.push(...result)
      }

      await browser.close()
      return res.json(results)
    } catch (err) {
      await browser.close()
      next(err)
    }
  }

  getAllReviewBooks = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const books = await this.BooksModel.getAllReviewBooks()
      return res.json(books)
    } catch (err) {
      next(err)
    }
  }

  createReviewBook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      let data = req.body as Partial<BookObjectType>

      data = await prepareCreateBookData(data, req)
      const validated = validateBook(data)
      if (!validated.success) {
        console.dir(validated.error, { depth: null })
        return res.status(400).json({ error: validated.error })
      }

      const book = await this.BooksModel.createReviewBook(data)

      res.send(book)
    } catch (err) {
      next(err)
    }
  }

  deleteReviewBook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const bookId = req.params.book_id as ID
      const result = await this.BooksModel.deleteReviewBook(bookId)
      return res.json(result)
    } catch (err) {
      next(err)
    }
  }

  updateReviewBook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const bookId = req.params.book_id as ID
      let rawData = req.body as Partial<BookObjectType>
      const existingBook = await this.BooksModel.getBookById(bookId)

      const data: BookObjectType = await prepareUpdateBookData(
        rawData,
        req,
        existingBook
      )
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error.errors })
      }
      const filteredData = filterData(data)
      filteredData.actualizado_en = new Date().toISOString() as ISOString
      const book = await this.BooksModel.updateReviewBook(bookId, filteredData)

      res.status(200).json(book)
    } catch (err) {
      next(err)
    }
  }

  forYouPage = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene libros específicos por su query y se envía como respuesta.
      Las consultas actualizan las estadísticas de los libros y los usuarios.
    */
    try {
      const l = req.query.l as string
      const lParsed = parseInt(l, 10) || 24
      const user = req.session.user as AuthToken | undefined

      const results = await this.BooksModel.forYouPage(
        user,
        lParsed,
        this.UsersModel
      )

      return res.json(results)
    } catch (err) {
      next(err)
    }
  }

  getFavoritesByUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const userId = req.params.userId as ID | undefined
    try {
      if (!userId)
        return res.status(401).json({ error: 'No se proporcionó userId' })
      const user = await this.UsersModel.getUserById(userId)

      const favorites = await this.BooksModel.getFavoritesByUser(user.favoritos)

      return res.json(favorites)
    } catch (err) {
      next(err)
    }
  }

  getBooksByCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const collection = req.body.collection as CollectionObjectType | undefined
    try {
      if (!collection) {
        return res.status(400).json({ error: 'No se proporcionó la colección' })
      }

      const books = await this.BooksModel.getBooksByCollection(collection)

      return res.json(books)
    } catch (err) {
      next(err)
    }
  }
}
