/* eslint-disable camelcase */
import { BooksModel } from '../../models/books/local/booksLocal.js'
import crypto from 'node:crypto'
import { validateBook, validatePartialBook } from '../../assets/validate.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { chromium } from 'playwright'
import { scrapingFunctions } from '../../assets/scrappingConfig.js'
// import { helperImg } from '../../assets/helperImg.js'
import { Preference, MercadoPagoConfig, Payment } from 'mercadopago'
import { ACCESS_TOKEN } from '../../assets/config.js'
import fetch from 'node-fetch'
import { sendEmail } from '../../assets/sendEmail.js'
import { createEmail } from '../../assets/htmlEmails.js'
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

  static async getBooksByQueryWithFilters (req, res) {
    // Destructure query parameters
    let { categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado, q, l } = req.query
    // Apply the filter transformation (change hyphens to spaces)
    categoria = cambiarGuionesAEspacio(categoria)
    ubicacion = cambiarGuionesAEspacio(ubicacion)
    edad = cambiarGuionesAEspacio(edad)
    tapa = cambiarGuionesAEspacio(tapa)
    fechaPublicacion = cambiarGuionesAEspacio(fechaPublicacion)
    idioma = cambiarGuionesAEspacio(idioma)
    estado = cambiarGuionesAEspacio(estado)

    // Validate required query parameter "q"
    if (!q) {
      return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
    }

    // Set default pagination limit if not provided
    l = parseInt(l) || 24 // Default to 24 if l is not a valid number

    // Prepare filter object for query
    const filterObj = {
      categoria,
      ubicacion,
      edad,
      tapa,
      fechaPublicacion,
      idioma,
      estado
    }

    // Initialize the query object to search for books (adjust according to your database/model)
    try {
      // Build the query dynamically based on provided filters
      const query = {
        query: q,
        where: {},
        limit: l,
        offset: 0 // Add offset if you want pagination support
      }

      // Add filters to the query where clause dynamically
      Object.keys(filterObj).forEach((filterKey) => {
        const value = filterObj[filterKey]
        if (value) { // Only add filters with a truthy value
          query.where[filterKey] = value
        }
      })

      const books = await BooksModel.getBooksByQueryWithFilters(query)

      // If no books found
      if (books.length === 0) {
        return res.status(404).json({ message: 'No books found matching your filters.' })
      }

      // Return the books found
      return res.status(200).json({ books })
    } catch (error) {
      console.error('Error fetching books:', error)
      return res.status(500).json({ error: 'An error occurred while fetching the books.' })
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
    if (req.files) data.images = req.files.map(file => `${file.filename}`)

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

    // Agregar el ID del libro al usuario
    const user = await UsersModel.getUserById(data.idVendedor)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const updated = await UsersModel.updateUser(user._id, {
      librosIds: [...(user?.librosIds || []), data._id]
    })
    if (!user.rol || user.rol === 'usuario') {
      user.rol = 'Vendedor'
    }
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

    // Crear notificación
    const notificationUrl = 'http://localhost:3030/api/notifications/'
    const response = await fetch(notificationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

        title: 'Tu libro ha sido publicado con éxito',
        priority: 'high',
        type: 'bookPublished',
        userId: data.idVendedor,
        read: false,
        actionUrl: `http://localhost:5173/libros/${data._id}`,
        metadata: data.metadata || {
          photo: data.images[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      })
    })
    if (!response.ok) {
      return res.send({ error: 'Error creando notificación' })
    }
    const correo = await UsersModel.getEmailById(data.idVendedor)
    // Enviar correo
    console.log(correo)
    await sendEmail(`${data.vendedor} ${correo.correo}`, 'Libro publicado con éxito', createEmail(data, 'bookPublished'))
    // Si todo es exitoso, devolver el libro creado
    res.send({ book })
  }

  static async deleteBook (req, res) {
    try {
      const { bookId } = req.params

      // Obtener los detalles del libro para encontrar al vendedor (idVendedor)
      const book = await BooksModel.getBookById(bookId)
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
      }

      // Imágenes
      if (req.files) {
        data.images = req.files.map(file => `${file.filename}`)
      }
      // Validar datos
      const validated = validatePartialBook(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error.errors })
      }

      // Manejo del mensaje
      if (data.mensaje && data.tipo) {
        // Inicializa el array de mensajes si no existe
        const messagesArray = existingBook.mensajes || []
        if (data.tipo === 'pregunta') {
          // Verifica si la pregunta ya existe
          const questionIndex = messagesArray.findIndex(item => item[0] === data.mensaje)

          if (questionIndex === -1) { // Si no se encuentra, se puede agregar
            messagesArray.push([data.mensaje, '', data.senderId])
          }
        } else if (data.tipo === 'respuesta' && data.pregunta) {
          // Busca la pregunta correspondiente
          const questionIndex = messagesArray.findIndex(
            item => item[0] === data.pregunta // Verificamos si el mensaje.pregunta coincide con el mensaje
          )
          if (questionIndex !== -1) {
            // Si encontramos la pregunta, agregamos la respuesta
            messagesArray[questionIndex][1] = data.mensaje
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

      // Crear notificación si no es una pregunta
      if (!data.mensaje && !data.tipo) {
        const notificationUrl = 'http://localhost:3030/api/notifications/'
        const response = await fetch(notificationUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({

            title: 'Tu libro ha sido actualizado con éxito',
            priority: 'high',
            type: 'bookUpdated',
            userId: data.idVendedor,
            read: false,
            actionUrl: `http://localhost:5173/libros/${data._id}`,
            metadata: data.metadata || {
              photo: data.images[0],
              bookTitle: data.titulo,
              bookId: data._id
            }
          })
        })
        if (!response.ok) {
          return res.send({ error: 'Error creando notificación' })
        }
      }
      res.status(200).json(book)
    } catch (err) {
      console.error('Error al actualizar el libro:', err)
      res.status(500).json({ error: err.message })
    }
  }

  static async searchByBookTitle (req, res) {
    const { bookTitle } = req.params
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      let results = []

      // Use a for-loop to iterate over each scraping function
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

  static async getPreferenceId (req, res) {
    const client = new MercadoPagoConfig({
      accessToken: ACCESS_TOKEN
    })

    try {
      const body = {
        items: [
          {
            title: req.body.title,
            quantity: 1,
            unit_price: Number(req.body.price),
            currency_id: 'COP'
          }

        ]/* ,
        back_urls: {
          success: 'localhost/popUp/successBuying',
          failure: 'localhost/popUp/failureBuying',
          pending: 'localhost/popUp/pendingBuying'
        } */
        // auto_return: 'approved'
      }
      const preference = new Preference(client)
      const result = await preference.create({ body })
      res.json({
        id: result.id
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: 'Error al crear la preferencia'
      })
    }
  }

  static async processPayment (req, res) {
    try {
      const {
        transaction_amount,
        description,
        token,
        payment_method_id,
        payer,
        application_fee // Marketplace commission
      } = req.body

      if (!token) {
        return res.status(400).json({
          status: 'error',
          message: 'Token is required for payment processing'
        })
      }

      const client = new MercadoPagoConfig({
        accessToken: ACCESS_TOKEN, // Your platform's access token
        options: { timeout: 5000 }
      })

      const payment = new Payment(client)

      const response = await payment.create({
        body: {
          transaction_amount,
          description,
          token, // Required for payment processing
          payment_method_id,
          payer,
          application_fee
        }
      })

      res.status(200).json({
        status: 'success',
        message: 'Payment processed successfully',
        data: response.body
      })
    } catch (error) {
      console.error('Error processing payment:', error)
      res.status(500).json({
        status: 'error',
        message: 'Payment processing failed',
        error: error.message
      })
    }
  }

  static async getAllReviewBooks (req, res) {
    try {
      const books = await BooksModel.getAllReviewBooks()
      if (!books) {
        res.status(500).json({ error: 'Error al leer libros' })
      }
      res.json(books)
    } catch (err) {
      console.error('Error al leer libros:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  // Filtrar libros
  static async createReviewBook (req, res) {
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

    // Validación
    const validated = validateBook(data)
    if (!validated.success) {
      console.log('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    // Asignar un ID único al libro
    data._id = crypto.randomUUID()

    // Crear el libro en la base de datos
    const book = await BooksModel.createReviewBook(data)
    if (typeof book === 'string' && book.startsWith('Error')) {
      return res.status(500).json({ error: book })
    }
    if (!book) {
      return res.status(500).json({ error: 'Error al crear libro' })
    }

    // Si todo es exitoso, devolver el libro creado
    res.send({ book })
  }

  static async deleteReviewBook (req, res) {
    try {
      const { bookId } = req.params
      // Eliminar el libro de la base de datos
      const result = await BooksModel.deleteReviewBook(bookId)
      if (!result) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      res.json({ message: 'Libro revisión eliminado con éxito', result })
    } catch (err) {
      console.error('Error al eliminar el libro:', err)
      res.status(500).json({ error: 'Error al eliminar el libro' })
    }
  }

  static async updateReviewBook (req, res) {
    try {
      const { bookId } = req.params
      const data = req.body
      // Obtener el libro existente para obtener los mensajes actuales
      const existingBook = await BooksModel.getBookById(bookId)
      console.log(existingBook)
      if (!existingBook) {
        return res.status(404).json({ error: 'Libro no encontrado' })
      }

      // Asegúrate de que los precios y ofertas sean números
      if (data.oferta) data.oferta = parseInt(data.oferta)
      if (data.precio) data.precio = parseInt(data.precio)

      // Manejo de keywords
      if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords.split(',').map(keyword => keyword.trim()).filter(keyword => keyword)
      }
      if (data.keywords === '') data.keywords = []
      // Imágenes
      if (req.files) {
        data.images = req.files.map(file => `${file.filename}`)
      }

      // Validar datos
      const validated = validatePartialBook(data)
      if (!validated.success) {
        console.log(validated)
        return res.status(400).json({ error: validated.error.errors })
      }
      console.log('Pasó validación')
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
      filteredData.method = 'PUT'
      // Actualizar libro
      const book = await BooksModel.updateReviewBook(bookId, filteredData)
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
