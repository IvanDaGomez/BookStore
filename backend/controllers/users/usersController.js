/* eslint-disable camelcase */
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { randomUUID } from 'node:crypto'
import { validateUser, validatePartialUser } from '../../assets/validate.js'
import jwt from 'jsonwebtoken'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { Preference, MercadoPagoConfig, Payment } from 'mercadopago'
import { createNotification } from '../../assets/notifications/createNotification.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'
import { TransactionsModel } from '../../models/transactions/local/transactionsModel.js'
// eslint-disable-next-line no-unused-vars
import { CreateOrdenDeEnvío } from '../../assets/createOrdenDeEnvio.js'
import { handlePaymentResponse } from '../../assets/handlePaymentResponse.js'
import { validateSignature } from '../../assets/validateSignature.js'
import { processPaymentResponse } from './processPaymentResponse.js'
import { checkEmailExists, initializeDataCreateUser, jwtPipeline, processUserUpdate, validateUserLogin } from './helperFunctions.js'

const SECRET_KEY = process.env.JWT_SECRET
export class UsersController {
  static async getAllUsers (req, res) {
    try {
      const users = await UsersModel.getAllUsers()
      if (!users) {
        res.status(500).json({ error: 'Error al leer usuarios' })
      }
      res.json(users)
    } catch (err) {
      console.error('Error reading users:', err)
      res.status(500).json({ error: 'Error leyendo usuarios' })
    }
  }

  static async getAllUsersSafe (req, res) {
    try {
      const users = await UsersModel.getAllUsersSafe()
      if (!users) {
        res.status(500).json({ error: 'Error leyendo usuarios' })
      }
      res.json(users)
    } catch (err) {
      console.error('Error leyendo usuarios:', err)
      res.status(500).json({ error: 'Error leyendo usuarios' })
    }
  }

  static async getUserById (req, res) {
    try {
      const { userId } = req.params
      const user = await UsersModel.getUserById(userId)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(user)
    } catch (err) {
      console.error('Error leyendo usuario:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async getPhotoAndNameUser (req, res) {
    try {
      const { userId } = req.params
      const user = await UsersModel.getPhotoAndNameUser(userId)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(user)
    } catch (err) {
      console.error('Error leyendo usuario:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async getEmailById (req, res) {
    try {
      const { userId } = req.params
      const user = await UsersModel.getEmailById(userId)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(user)
    } catch (err) {
      console.error('Error leyendo usuario:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async getUserByQuery (req, res) {
    try {
      let { q } = req.query // Obtener el valor del parámetro de consulta 'q'
      q = cambiarGuionesAEspacio(q)
      if (!q) {
        return res.status(400).json({ error: 'El query parameter "q" es requerido' })
      }

      const users = await UsersModel.getUserByQuery(q) // Asegurarse de implementar este método en UsersModel
      if (users.length === 0) {
        return res.status(404).json({ error: 'No se encontraron usuarios' })
      }

      res.json(users)
    } catch (err) {
      console.error('Error leyendo usuarios por query:', err)
      res.status(500).json({ error: 'Error leyendo usuarios' })
    }
  }

  static async login (req, res) {
    try {
      const { correo, contraseña } = req.body
      if (!correo || !contraseña) {
        return res.status(400).json({ error: 'Algunos espacios están en blanco' })
      }

      const user = await UsersModel.login(correo, contraseña)

      validateUserLogin(user, res)

      jwtPipeline(user, res)

      res.json(user)
    } catch (err) {
      console.error('Error leyendo usuario por correo:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async googleLogin (req, res) {
    try {
      const data = req.body
      // If there is a mail, no matter if is manually logged or google, the user is the same
      const user = await UsersModel.googleLogin(data)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      jwtPipeline(user, res)
      res.json(user)
    } catch (err) {
      console.error('Error leyendo usuario por correo:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async facebookLogin (req, res) {
    try {
      const data = req.body
      // If there is a mail, no matter if is manually logged or facebook, the user is the same
      const user = await UsersModel.facebookLogin(data)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(user)
    } catch (err) {
      console.error('Error leyendo usuario por correo:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async createUser (req, res) {
    let data = req.body
    // Validación
    try {
      const validated = validateUser(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error })
      }
      // Revisar si el correo ya está en uso
      await checkEmailExists(data.correo, res)
      // Inicializar los datos
      data = initializeDataCreateUser(data)
      // Crear usuario
      const user = await UsersModel.createUser(data)
      if (!user) {
        return res.status(500).json({ error: 'Error creando usuario' })
      }
      // Enviar correo de agradecimiento por unirse a meridian
      await sendEmail(`${data.nombre} ${data.correo}`, 'Bienvenido a Meridian!', createEmail(data, 'thankEmail'))
      // Enviar notificación de bienvenida
      await sendNotification(createNotification(data, 'welcomeUser'))
      // Si todo es exitoso, devolver el usuario creado
      jwtPipeline(user, res)
      res.json(user)
    } catch (error) {
      console.error(error)
    }
  }

  static async deleteUser (req, res) {
    try {
      const { userId } = req.params
      const result = await UsersModel.deleteUser(userId)
      if (!result) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      res.json(result)
    } catch (err) {
      console.error('Error eliminando usuario:', err)
      res.status(500).json({ error: 'Error eliminando usuario' })
    }
  }

  static async updateUser (req, res) {
    try {
      const { userId } = req.params
      const data = req.body

      // Validar datos
      const validated = validatePartialUser(data)
      if (!validated.success) {
        return res.status(400).json({ error: 'Error validando usuario', details: validated.error.errors })
      }

      const updatedData = await processUserUpdate(data, userId, req)

      if (updatedData.status) {
        return res.status(updatedData.status).json(updatedData.json)
      }
      // Actualizar usuario
      const user = await UsersModel.updateUser(userId, updatedData)
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado o no actualizado' })
      }
      jwtPipeline(user, res)
      // Enviar el nuevo token en la cookie
      res.json(user)
    } catch (err) {
      console.error('Error actualizando usuario:', err)
      res.status(500).json({ error: 'Error del servidor' })
    }
  }

  static async logout (req, res) {
    res
      .clearCookie('access_token')
      .json({ message: 'Se cerró exitosamente la sesión' })
  }

  static async userData (req, res) {
    if (req.session.user) {
      // Devolver los datos del usuario
      const user = await UsersModel.getUserById(req.session.user._id)
      if (!user) {
        return res.status(401).json({ error: 'Usuario no encontrado' })
      }
      res.json({ user })
    } else {
      res.status(401).json({ message: 'No autenticado' })
    }
  }

  static async sendValidationEmail (req, res) {
    const data = req.body
    if (!data || !data.nombre || !data.correo) {
      return res.status(400).json({ error: 'Missing required fields: nombre or correo' })
    }
    if (data.validated) {
      return res.json({ verified: true })
    }
    try {
      // Generate a token with user ID (or email) for validation
      const token = jwt.sign({
        _id: data._id,
        nombre: data.nombre
      }, SECRET_KEY, { expiresIn: '1h' })

      // Create the validation code of 6 digits
      const validationCode = Math.floor(100000 + Math.random() * 900000)

      // Prepare the email content
      const emailContent = createEmail(
        { ...data, validationCode },
        'validationEmail'
      )

      // Send the email
      await sendEmail(
        `${data.nombre} <${data.correo}>`,
        'Correo de validación en Meridian',
        emailContent
      )

      res.json({ ok: true, status: 'Validation email sent successfully', token, code: validationCode })
    } catch (error) {
      console.error('Error sending validation email:', error)
      res.status(500).json({ ok: false, error: 'Failed to send validation email' })
    }
  }

  static async userValidation (req, res) {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({ error: 'Token not provided' })
    }

    try {
      // Verify the token
      const data = jwt.verify(token, SECRET_KEY)

      // Retrieve the user and their email
      const user = await UsersModel.getUserById(data._id)
      const correo = await UsersModel.getEmailById(data._id)

      if (!user || !correo) {
        return res.status(404).json({ error: 'User not found' })
      }

      // Verify that the email matches
      if (data.nombre !== correo.nombre) {
        return res.status(400).json({ error: 'Email mismatch' })
      }

      // Check if the user is already validated
      // if (user.validated) {
      //   return res.json({ status: 'User already validated' })
      // }

      // Update the user's validation status
      const updated = await UsersModel.updateUser(data._id, { validated: true })

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update user validation status' })
      }
      jwtPipeline(user, res)
      // Set the new cookie
      res.json({ status: 'User successfully validated', updated })
    } catch (error) {
      console.error('Error validating user:', error)

      // Handle token expiration or invalidity
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token has expired' })
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(400).json({ error: 'Invalid token' })
      }

      res.status(500).json({ error: 'Server error during validation' })
    }
  }

  static async sendChangePasswordEmail (req, res) {
    const { email } = req.body

    try {
      if (!email) {
        return res.status(400).json({ error: 'Correo no proveído', ok: false })
      }

      // Verificar existencia del correo
      const user = await UsersModel.getUserByEmail(email)
      if (!user) {
        return res.status(404).json({ error: 'El correo no está registrado', ok: false })
      }

      // Generar token
      const tokenPayload = { _id: user._id } // No incluir información sensible
      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '15m' })

      const validationLink = `${process.env.FRONTEND_URL}/opciones/cambiarContraseña/${token}`
      const emailContent = createEmail({ correo: email, validationLink, nombre: user.nombre }, 'changePassword')

      await sendEmail(email, 'Correo de reinicio de contraseña', emailContent)

      return res.json({ ok: true, message: 'Correo enviado con éxito' })
    } catch (error) {
      console.error('Error en sendChangePasswordEmail:', error)
      return res.status(500).json({ ok: false, error: 'Error en el servidor' })
    }
  }

  static async changePassword (req, res) {
    const { token, password } = req.body

    try {
      if (!token) {
        return res.status(400).json({ error: 'Token no proporcionado', ok: false })
      }

      if (!password) {
        return res.status(400).json({ error: 'Contraseña no proporcionada', ok: false })
      }

      let decodedToken
      try {
        decodedToken = jwt.verify(token, SECRET_KEY)
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'El token ha expirado', ok: false })
        }
        return res.status(401).json({ error: 'Token inválido', ok: false })
      }

      const { _id } = decodedToken

      const user = await UsersModel.getUserById(_id)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado', ok: false })
      }

      // Actualizar la contraseña (el hash se realiza en el modelo)
      const userUpdated = await UsersModel.updateUser(_id, { contraseña: password })

      if (!userUpdated) {
        return res.status(500).json({ error: 'Error al actualizar la contraseña', ok: false })
      }

      return res.json({ ok: true, message: 'Contraseña actualizada con éxito' })
    } catch (error) {
      console.error('Error en changePassword:', error)
      return res.status(500).json({ ok: false, error: 'Error en el servidor' })
    }
  }

  static async getPreferenceId (req, res) {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
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
      const { sellerId, userId, book, shippingDetails, transaction_amount, application_fee, ...data } = req.body
      if (!sellerId || !userId || !book || !shippingDetails) {
        return res.status(400).json({ error: 'Faltan datos requeridos en la solicitud' })
      }

      const XidempotencyKey = randomUUID()
      const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })
      // Hay que agregar el precio del domicilio si aplica
      const payment = new Payment(client)
      // Configuración del pago con split payments
      const response = await payment.create({
        body: {
          transaction_amount, // Monto total de la transacción
          payment_method_id: data.payment_method_id,
          payer: data.payer,
          description: data.description,
          installments: data.installments || 1,
          token: data.token || null,
          issuer_id: data.issuer_id || null,
          additional_info: data.additional_info || {

          },
          callback_url: data.callback_url || null,
          application_fee: application_fee || 0, // Tarifa de la aplicación
          /* marketplace: {
            collector_id: process.env.MERCADOPAGO_COLLECTOR_ID // ID de tu cuenta colectora principal
          }, */
          external_reference: `book_${book._id}_${userId}`, // Referencia para identificar el pago
          notification_url: `${process.env.BACKEND_DOMAIN}/api/users/mercadoPagoWebHooks?source_news=webhooks` // Webhook para notificaciones
          /* payments: [
            {
              collector_id: sellerId, // ID de la página de gestiones
              amount: transaction_amount - application_fee, // Lo que queda para el vendedor
              payment_method_id: data.payment_method_id
            },
            {
              collector_id: marketplaceCollectorId, // ID del marketplace (comisiones)
              amount: application_fee, // Comisión del marketplace
              payment_method_id: data.payment_method_id
            }
          ] */
        },
        requestOptions: { idempotencyKey: XidempotencyKey }
      })

      const result = handlePaymentResponse({ ...response, sellerId, userId, book, shippingDetails })
      await processPaymentResponse({ response, result, sellerId, book, data, res })
    } catch (error) {
      console.error('Error processing payment:', error.message, { error })
      res.status(500).json({
        status: 'error',
        message: 'No se pudo procesar el pago.',
        error: error.message
      })
    }
  }

  static async MercadoPagoWebhooks (req, res) {
    try {
      const { type } = req.query
      const paymentData = req.body
      const signature = req.headers['x-signature']
      const reqId = req.headers['x-request-id']
      const isValid = validateSignature({ signature, reqId, body: paymentData })
      if (!isValid) {
        return res.status(400).json({ error: 'Firma no válida' })
      }

      const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN })
      const payment = new Payment(client)

      if (type === 'payment') {
        const data = await payment.get({ id: paymentData.id })
        /* Modelo de respuesta
        https://www.mercadopago.com.co/developers/es/reference/payments/_payments_id/get
        {
          id,
          date_created,
          date_approved,
          date_last_updated,
          date_of_expiration,
          money_release_date,
          operation_type,
          issuer_id,
          payment_method_id,
          payment_type_id,
          status,
          status_detail,
          currency_id,
          description,
          live_mode,
          sponsor_id,
          authorization_code,
          money_release_schema,
          counter_currency,
          collector_id,
          payer,
          metadata,
          additional_info,
          external_reference,
          transaction_amount,
          transaction_amount_refunded,
          coupon_amount,
          differential_pricing_id,
          deduction_schema,
          transaction_details,
          captures,
          binary_mode,
          call_for_authorize_id,
          statement_descriptor,
          card,
          notification_url,
          proccessing_mode,
          merchant_account_id,
          acquirer,
          merchant_number
        }
        */
        // Verificar si ya se procesó esta transacción
        const existingTransaction = await TransactionsModel.getTransactionById(data.id)
        if (existingTransaction) {
          console.log('Webhook: transacción ya procesada:', data.id)
          return res.status(200).json({ status: 'success' })
        }

        const book = await TransactionsModel.getBookByTransactionId(paymentData.id)
        await processPaymentResponse({ result: data, sellerId: book.idVendedor, book, data, res })
      }

      res.status(200).json({ status: 'success' })
    } catch (error) {
      console.error('Error al procesar el webhook:', error.message)
      res.status(500).json({ error: 'Error interno al procesar el webhook' })
    }
  }

  static async processDelivery (req, res) {
  }

  static async followUser (req, res) {
    const { followerId, userId } = req.body
    try {
      if (!followerId || !userId) {
        return res.status(404).json({ ok: false, error: 'No se proporcionó usuario y seguidor' })
      }
      // Es necesario conseguir el usuario para saber que otros seguidores tenía
      const follower = await UsersModel.getUserById(followerId)

      const user = await UsersModel.getUserById(userId)

      if (!follower || !user) {
        return res.status(401).json({ ok: false, error: 'No se encontró el usuario o el seguidor' })
      }
      let action
      // Agregar el seguidor
      if (!follower.seguidores.includes(userId)) {
        follower.seguidores = [...(follower?.seguidores || []), userId]
        user.siguiendo = [...(user?.siguiendo || []), followerId]
        action = 'Agregado'
        // Eliminar el seguidor
      } else {
        follower.seguidores = follower.seguidores.filter(seguidorId => seguidorId !== userId)
        user.siguiendo = follower.seguidores.filter(siguiendoId => siguiendoId !== followerId)
        action = 'Eliminado'
      }

      const followerUpdated = await UsersModel.updateUser(followerId, follower)
      const userUpdated = await UsersModel.updateUser(userId, user)

      if (!followerUpdated || !userUpdated) {
        return res.status(401).json({ ok: false, error: 'No se pudo actualizar el seguidor' })
      }

      // Notificación de nuevo seguidor
      if (action === 'Agregado') {
        await sendNotification(createNotification({ follower, user }, 'newFollower'))
      }

      jwtPipeline(user, res)
      res.json({ ok: true, action, follower, user })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ ok: false, error: 'Error del servidor' })
    }
  }

  static async getBalance (req, res) {
    const { userId } = req.params

    if (!userId) return res.status(404).json({ error: 'No se proporcionó id de usuario' })

    const balance = await UsersModel.getBalance(userId)

    if (!balance) {
      return res.json({ error: 'No se pudo encontrar el balance' })
    }
    res.json({ balance })
  }

  static async createColection (req, res) {
    const { collectionName, userId } = req.body
    try {
      if (!userId || !collectionName) {
        return res.status(400).json({ error: 'No se entregaron todos los campos' })
      }

      const user = await UsersModel.getUserById(userId)
      if (!user) {
        return res.status(404).json({ error: 'No se encontró el libro' })
      }

      // Agregar la nueva colección
      const updated = await UsersModel.updateUser(userId, {
        colecciones: [...(user?.collectionsIds || []), { nombre: collectionName, librosIds: [] }]
      })

      if (!updated) {
        return res.status(500).json({ error: 'No se pudo actualizar el libro' })
      }
      jwtPipeline(user, res)
      res.json({ data: updated })
    } catch (error) {
      console.error('Error en createColection:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  static async addToColection (req, res) {
    const { bookId, collectionName, userId } = req.body
    try {
      if (!userId || !collectionName) {
        return res.status(400).json({ error: 'No se entregaron todos los campos' })
      }

      const user = await UsersModel.getUserById(userId)
      if (!user) {
        return res.status(404).json({ error: 'No se encontró el usuario' })
      }

      const collection = user.colecciones.find((coleccion) => coleccion.nombre === collectionName)
      if (!collection) {
        return res.status(404).json({ error: 'No se encontró la colección' })
      }

      // Verificar si el libro ya está en la colección
      if (collection.librosIds.includes(bookId)) {
        return res.status(200).json({ message: 'El libro ya está en la colección', data: user })
      }

      // Actualizar colección
      const updated = await UsersModel.updateUser(userId, {
        colecciones: [
          ...user.colecciones.filter((coleccion) => coleccion.nombre !== collectionName),
          {
            nombre: collection.nombre,
            librosIds: [...collection.librosIds, bookId]
          }
        ]
      })

      if (!updated) {
        return res.status(500).json({ error: 'No se pudo actualizar el libro' })
      }

      res.json({ data: updated })
    } catch (error) {
      console.error('Error en addToColection:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  static async getBooksByCollection (req, res) {
    const { collection } = req.body
    try {
      if (!collection) {
        return res.status(400).json({ error: 'No se proporcionó la colección' })
      }

      const books = await UsersModel.getBooksByCollection(collection)
      if (!books || books.length === 0) {
        return res.status(404).json({ error: 'No hay libros en esta colección' })
      }

      res.json({ data: books })
    } catch (error) {
      console.error('Error en getBooksByCollection:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }
}
