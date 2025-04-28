/* eslint-disable camelcase */
import { randomUUID } from 'node:crypto'
import { validateUser, validatePartialUser } from '../../assets/validate.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { Preference, MercadoPagoConfig, Payment } from 'mercadopago'
import { createNotification } from '../../assets/notifications/createNotification.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'
// eslint-disable-next-line no-unused-vars
import { CreateOrdenDeEnvío } from '../../assets/createOrdenDeEnvio.js'
import { validateSignature } from '../../assets/validateSignature.js'
import { processPaymentResponse } from './processPaymentResponse.js'
import {
  checkEmailExists,
  initializeDataCreateUser,
  jwtPipeline,
  processUserUpdate,
  updateUserFavorites
} from './helperFunctions.js'
import express from 'express'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { PartialUserInfoType, UserInfoType } from '../../types/user.js'
import { ID, ImageType, ISOString } from '../../types/objects.js'
import { IBooksModel, ITransactionsModel, IUsersModel } from '../../types/models.js'
import { AuthToken } from '../../types/authToken.js'
import { sendProcessPaymentEmails } from './sendProcessPaymentEmails.js'
import { TransactionObjectType } from '../../types/transaction.js'
import { createMercadoPagoPayment } from './createMercadoPagoPayment.js'
const SECRET_KEY: string = process.env.JWT_SECRET ?? ''
export class UsersController {
  private UsersModel: IUsersModel
  private TransactionsModel: ITransactionsModel
  private BooksModel: IBooksModel
  constructor ({
    UsersModel,
    TransactionsModel,
    BooksModel
  }: {
    UsersModel: IUsersModel
    TransactionsModel: ITransactionsModel,
    BooksModel: IBooksModel
  }) {
    this.UsersModel = UsersModel as typeof UsersModel
    this.TransactionsModel = TransactionsModel as typeof TransactionsModel
    this.TransactionsModel = TransactionsModel
    this.BooksModel = BooksModel
  }

  getAllUsers = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const users = await this.UsersModel.getAllUsers()

      res.json(users)
    } catch (err) {
      next(err)
    }
  }

  getAllUsersSafe = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const users = await this.UsersModel.getAllUsersSafe()

      res.json(users)
    } catch (err) {
      next(err)
    }
  }

  getUserById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID
      const user = await this.UsersModel.getUserById(userId)

      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  getPhotoAndNameUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID

      const user = await this.UsersModel.getPhotoAndNameUser(userId)

      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  getEmailById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID
      const email = await this.UsersModel.getEmailById(userId)

      res.json(email)
    } catch (err) {
      next(err)
    }
  }

  getUserByQuery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      let q = req.query.q as string | undefined // Obtener el valor del parámetro de consulta 'q'
      q = cambiarGuionesAEspacio(q)
      if (!q) {
        return res
          .status(400)
          .json({ error: 'El query parameter "q" es requerido' })
      }

      const users = await this.UsersModel.getUserByQuery(q) // Asegurarse de implementar este método en this.UsersModel

      res.json(users)
    } catch (err) {
      next(err)
    }
  }

  login = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { correo, contraseña }: { correo: string; contraseña: string } =
        req.body

      if (!correo || !contraseña) {
        return res
          .status(400)
          .json({ error: 'Algunos espacios están en blanco' })
      }

      const user = await this.UsersModel.login(correo, contraseña)

      jwtPipeline(user, res)

      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  googleLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const data = req.body as { 
        correo: string
        nombre: string
        fotoPerfil: ImageType
      }
      // If there is a mail, no matter if is manually logged or google, the user is the same
      const user = await this.UsersModel.googleLogin(data)

      jwtPipeline(user, res)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  facebookLogin = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { nombre, correo, fotoPerfil } = req.body as {
        correo: string | undefined
        nombre: string | undefined
        fotoPerfil?: ImageType
      }
      if (!nombre || !correo) {
        return res.status(400).json({
          error: 'Algunos espacios están en blanco',
          details: 'Nombre y correo son requeridos'
        })
      }
      const user = await this.UsersModel.facebookLogin({ nombre, correo, fotoPerfil: fotoPerfil ?? ''})

      jwtPipeline(user, res)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  createUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let data: UserInfoType = req.body
    // Validación
    try {
      const validated = validateUser(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error })
      }
      // Revisar si el correo ya está en uso
      await checkEmailExists(data.correo)
      // Inicializar los datos
      data = initializeDataCreateUser(data)
      // Crear usuario
      const user = await this.UsersModel.createUser(data)

      // Enviar correo de agradecimiento por unirse a meridian
      await sendEmail(
        `${data.nombre} ${data.correo}`,
        'Bienvenido a Meridian!',
        createEmail({ user }, 'thankEmail')
      )
      // Enviar notificación de bienvenida
      await sendNotification(createNotification(data, 'welcomeUser'))
      // Si todo es exitoso, devolver el usuario creado
      jwtPipeline(user, res)
      res.json(user)
    } catch (err) {
      next(err)
    }
  }

  deleteUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID
      const result = await this.UsersModel.deleteUser(userId)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  updateUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID
      const data: Partial<UserInfoType> = req.body
      // Validar datos
      console.log(data)
      const validated = validatePartialUser(data)
      if (!validated.success) {
        return res.status(400).json({
          error: 'Error validando usuario',
          details: validated.error.errors
        })
      }

      const updatedData = await processUserUpdate(data, userId, req)

      // Actualizar usuario
      const user = await this.UsersModel.updateUser(userId, updatedData)

      jwtPipeline(user, res)
      // Enviar el nuevo token en la cookie
      res.json(user)
    } catch (err) {
      next(err)
    }
  }
  updateFavorites = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID
      const { accion, bookId } = req.body as { accion: string, bookId: ID}

      if (!accion) {
        return res.status(400).json({ error: 'Acción no proporcionada' })
      }

      const updatedFavorites = await updateUserFavorites(userId, bookId,  accion)

      await this.UsersModel.updateUser(userId, {
        favoritos: updatedFavorites
      })
      res.json(updatedFavorites)
    } catch (err) {
      next(err)
    }
  }

  logout = async (
    req: express.Request,
    res: express.Response
  ): Promise<express.Response | void> => {
    res
      .clearCookie('access_token')
      .json({ message: 'Se cerró exitosamente la sesión' })
  }

  userData = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      
      if (req.session.user) {
        // Devolver los datos del usuario
        const user = await this.UsersModel.getUserById(req.session.user._id)
        return res.json(user)
      } else {
        res.status(401).json({ message: 'No autenticado' })
      }
    } catch (err) {
      next(err)
    }
  }

  sendValidationEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const data: {
      _id: ID
      nombre: string
      correo: string
      validated: string
    } = req.body
    if (!data || !data.nombre || !data.correo) {
      return res
        .status(400)
        .json({ error: 'No se proporcionaron todos los campos: nombre or correo' })
    }
    if (data.validated === 'true') {
      // Si el usuario ya está validado, no se envía el correo
      return res.json({ verified: true })
    }
    try {
      // Generate a token with user ID (or email) for validation
      const token = jwt.sign(
        {
          _id: data._id,
          nombre: data.nombre
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      )

      // Create the validation code of 6 digits
      const validationCode = Math.floor(100000 + Math.random() * 900000)

      // Prepare the email content
      const validated = data.validated === 'true'
      const emailContent = createEmail(
        { 
          user: {
            ...data, 
            validated
          }, 
          metadata: {
            validationCode
          } 
        },
        'validationEmail'
      )

      // Send the email
      await sendEmail(
        `${data.nombre} <${data.correo}>`,
        'Correo de validación en Meridian',
        emailContent
      )

      res.json({
        ok: true,
        status: 'Validation email sent successfully',
        token,
        code: validationCode
      })
    } catch (err) {
      next(err)
    }
  }

  userValidation = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({ error: 'Token not provided' })
    }

    try {
      // Verify the token
      const data = jwt.verify(token, SECRET_KEY) as AuthToken

      // Retrieve the user and their email
      const user: PartialUserInfoType = await this.UsersModel.getUserById(
        data._id
      )
      const correo = await this.UsersModel.getEmailById(data._id)

      // Verify that the email matches
      if (data.nombre !== correo.nombre) {
        return res.status(400).json({ error: 'Email mismatch' })
      }

      // Check if the user is already validated
      // if (user.validated) {
      //   return res.json({ status: 'User already validated' })
      // }

      // Update the user's validation status
      await this.UsersModel.updateUser(data._id, {
        validated: true
      })

      jwtPipeline(user, res)
      // Set the new cookie
      res.json({ message: 'User successfully validated' })
    } catch (err) {
      next(err)
    }
  }

  sendChangePasswordEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const { email }: { email: string } = req.body

    try {
      if (!email) {
        return res.status(400).json({ error: 'Correo no proveído', ok: false })
      }

      // Verificar existencia del correo
      const user = await this.UsersModel.getUserByEmail(email)

      // Generar token
      const tokenPayload = { _id: user._id } // No incluir información sensible
      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '15m' })

      const validationLink = `${process.env.FRONTEND_URL}/opciones/cambiarContraseña/${token}`
      const emailContent = createEmail(
        { user, metadata: { validationLink } },
        'changePassword'
      )

      await sendEmail(email, 'Correo de reinicio de contraseña', emailContent)

      return res.json({ ok: true, message: 'Correo enviado con éxito' })
    } catch (err) {
      next(err)
    }
  }

  changePassword = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const { token, password } = req.body

    try {
      if (!token) {
        return res
          .status(400)
          .json({ error: 'Token no proporcionado', ok: false })
      }

      if (!password) {
        return res
          .status(400)
          .json({ error: 'Contraseña no proporcionada', ok: false })
      }

      const decodedToken = jwt.verify(token, SECRET_KEY) as AuthToken

      const _id = decodedToken._id
      // Actualizar la contraseña (el hash se realiza en el modelo)
      await this.UsersModel.updateUser(_id, { contraseña: password })

      return res.json({ ok: true, message: 'Contraseña actualizada con éxito' })
    } catch (err) {
      next(err)
    }
  }

  getPreferenceId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
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
        ] as any
        // Dont know if it works
        /* ,
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
    } catch (err) {
      next(err)
    }
  }

  processPayment = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
    TODO: Sequelize transaction
    Steps
    1. Registrar el pago en la base de datos
    2. Actualizar el saldo del usuario y vendedor
    3. Cambiar la disponibilidad del libro a vendido
    4. Crear la orden de envío
    4. Crear la transacción
    5. Enviar notificación al vendedor y comprador
    6. Enviar correo al vendedor y comprador
    7. Devolver el resultado
    */
    try {
      const {
        sellerId,
        userId,
        bookId,
        shippingDetails,
        transaction_amount,
        application_fee,
        ...data
      } = req.body
      if (!sellerId || !userId || !bookId || !shippingDetails) {
        return res
          .status(400)
          .json({ error: 'Faltan datos requeridos en la solicitud' })
      }

      const [user, seller, book] = await Promise.all([
        this.UsersModel.getUserById(userId),
        this.UsersModel.getUserById(sellerId),
        this.BooksModel.getBookById(bookId)
      ])     
      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
      })
      // Hay que agregar el precio del domicilio si aplica
      const payment = new Payment(client)
      // Configuración del pago con split payments
      const info = createMercadoPagoPayment({
        ...req.body,
        book,
        userId,
        data,
        transaction_amount,
        application_fee
      })
      console.dir(info, { depth: null })
      const response = await payment.create(info)

      const result = await processPaymentResponse({
        result: response,
        sellerId,
        book,
        data,
        res
      })


      // Actualizar el saldo del usuario y vendedor
      // I dont update the user balance because if the payment is with mercadopago, the user balance is not updated
      await Promise.all([
        this.UsersModel.updateUser(sellerId, {
          balance: {
            porLlegar: (seller.balance.porLlegar ?? 0) + transaction_amount
          }
        }),
        this.BooksModel.updateBook(bookId, {
          disponibilidad: 'Vendido'
        })
      ])
      // PENDIENTE
      const order = await CreateOrdenDeEnvío({
        ...shippingDetails,
        seller
      })
      // Crear la transacción
      // TODO
      const transaction = await this.TransactionsModel.createSuccessfullTransaction({
        userId,
        bookId: book._id,
        shippingDetails,
        transaction_amount,
        status: 'approved'
      })
      // Enviar notificaciones y correos al vendedor y comprador
      await sendProcessPaymentEmails({
        user,
        seller,
        book,
        transaction,
        shippingDetails
      })
      res.json({ message: 'Pago exitoso', result })
    } catch (err) {
      res.status(500).json({
        error: 'Error al procesar el pago',
        details: err
      })
    }
  }
  payWithBalance = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
    TODO: Sequelize transaction
    Steps
    1. Verificar que el usuario tenga saldo suficiente
    2. Buscar el libro por ID
    2. Actualizar el saldo del usuario y vendedor
    3. Cambiar la disponibilidad del libro a vendido
    4. Crear la orden de envío
    4. Crear la transacción
    5. Enviar notificación al vendedor y comprador
    6. Enviar correo al vendedor y comprador
    7. Devolver el resultado
    */
    try {
      // const transaction = sequelize.transaction()
      const { userId, sellerId, transaction_amount, bookId, shippingDetails } = req.body as TransactionObjectType

      if (!userId || !transaction_amount || !bookId) {
        return res.status(400).json({ error: 'Faltan datos requeridos' })
      }
            // Actualizar el saldo del usuario y vendedor
      const [user, seller, book] = await Promise.all([
        this.UsersModel.getUserById(userId),
        this.UsersModel.getUserById(sellerId),
        this.BooksModel.getBookById(bookId)
      ])
      
      // Verificar que el usuario tenga saldo suficiente
      if (user.balance.disponible < transaction_amount) {
        return res.status(400).json({ error: 'Saldo insuficiente' })
      }
      // Actualizar el saldo del usuario y vendedor
      const [updatedUser, updatedSeller, updatedBook] = await Promise.all([
        this.UsersModel.updateUser(userId, {
          balance: {
            disponible: user.balance.disponible - transaction_amount
          }
        }),
        this.UsersModel.updateUser(sellerId, {
          balance: {
            porLlegar: (seller.balance.porLlegar ?? 0) + transaction_amount
          }
        }),
        this.BooksModel.updateBook(bookId, {
          disponibilidad: 'Vendido'
        })
      ])
      // PENDIENTE
      const order = await CreateOrdenDeEnvío({
        ...shippingDetails

      })
      // Crear la transacción
      // TODO
      const transaction = await this.TransactionsModel.createSuccessfullTransaction({
        userId,
        bookId,
        shippingDetails,
        transaction_amount,
        status: 'approved'
      })
      // Enviar notificaciones y correos al vendedor y comprador
      await sendProcessPaymentEmails({
        user: updatedUser,
        seller: updatedSeller,
        book,
        transaction,
        shippingDetails
      })
      res.json({ message: 'Pago exitoso' })
    } catch (err) {
      res.status(500).json({
        error: 'Error al procesar el pago',
        details: err
      })
    }
  }
  MercadoPagoWebhooks = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { type } = req.query
      const paymentData = req.body
      const signature = req.headers['x-signature'] ?? '' 
      const reqId = req.headers['x-request-id'] ?? '' 
      if (Array.isArray(signature) || Array.isArray(reqId)) {
        return res.status(400).json({ error: 'Firma no válida' })
      }
      const isValid = validateSignature({ signature, reqId, body: paymentData })
      if (!isValid) {
        return res.status(400).json({ error: 'Firma no válida' })
      }

      const client = new MercadoPagoConfig({
        accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
      })
      const payment = new Payment(client)
      let paymentResponse = {
        status: 'error',
        message: 'Error al procesar el pago'
      }
      // if (type === 'payment') {
      //   const data = await payment.get({ id: paymentData.id })
 
      //   // Verificar si ya se procesó esta transacción
      //   const existingTransaction =
      //     await this.TransactionsModel.getTransactionById(data.id ?? '')
      //   if (existingTransaction) {
      //     console.log('Webhook: transacción ya procesada:', data.id)
      //     return res.status(200).json({ status: 'success' })
      //   }

      //   const book = await this.TransactionsModel.getBookByTransactionId(
      //     paymentData.id
      //   )
      //   paymentResponse = await processPaymentResponse({
      //     result: data,
      //     sellerId: book.idVendedor,
      //     book,
      //     data,
      //     res
      //   })
      // }

      res.status(200).json(paymentResponse)
    } catch (err) {
      next(err)
    }
  }
  shippingWebhook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { type } = req.query
      const data = req.body

    } 
    catch (err) {
      next(err)
    }
  }

  processDelivery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
    } catch (err) {
      next(err)
    }
  }

  followUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const { followerId, userId }: { followerId: ID; userId: ID } = req.body
    try {
      if (!followerId || !userId) {
        return res
          .status(404)
          .json({ ok: false, error: 'No se proporcionó usuario y seguidor' })
      }
      // Es necesario conseguir el usuario para saber que otros seguidores tenía
      const [follower, user] = await Promise.all([
        this.UsersModel.getUserById(followerId),
        this.UsersModel.getUserById(userId)
      ])

      let action
      // Agregar el seguidor
      if (!follower.seguidores.includes(userId)) {
        follower.seguidores = [...follower.seguidores, userId]
        user.siguiendo = [...user.siguiendo, followerId]
        action = 'Agregado'

      // Eliminar el seguidor
      } else {
        follower.seguidores = follower.seguidores.filter(
          seguidorId => seguidorId !== userId
        )
        user.siguiendo = follower.seguidores.filter(
          siguiendoId => siguiendoId !== followerId
        )
        action = 'Eliminado'
      }

      
      await Promise.all([
        this.UsersModel.updateUser(followerId, follower),
        this.UsersModel.updateUser(userId, user)
      ])

      // Notificación de nuevo seguidor
      if (action === 'Agregado') {
        await sendNotification(
          createNotification({ follower }, 'newFollower')
        )
      }

      jwtPipeline(user, res)
      res.json({ ok: true, action, follower, user })
    } catch (err) {
      next(err)
    }
  }

  getBalance = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.userId as ID

      if (!userId)
        return res
          .status(404)
          .json({ error: 'No se proporcionó id de usuario' })
          
      const balance = await this.UsersModel.getBalance(userId)

      res.json({ balance })
    } catch (err) {
      next(err)
    }
  }

  createCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { collectionName, userId }: { collectionName: string; userId: ID } =
      req.body
    try {
      if (!userId || !collectionName) {
        return res
          .status(400)
          .json({ error: 'No se entregaron todos los campos' })
      }

      const user = await this.UsersModel.getUserById(userId)

      // Agregar la nueva colección
      const updated = await this.UsersModel.updateUser(userId, {
        coleccionsIds: [
          ...user.coleccionsIds,
          { nombre: collectionName, librosIds: [] }
        ]
      })

      jwtPipeline(user, res)
      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  addToCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const { bookId, collectionName, userId } = req.body
    try {
      if (!userId || !collectionName) {
        return res
          .status(400)
          .json({ error: 'No se entregaron todos los campos' })
      }

      const user = await this.UsersModel.getUserById(userId)

      const collection = user.coleccionsIds.find(
        coleccion => coleccion.nombre === collectionName
      )
      if (!collection) {
        return res.status(404).json({ error: 'No se encontró la colección' })
      }

      // Verificar si el libro ya está en la colección
      if (collection.librosIds.includes(bookId)) {
        return res
          .status(200)
          .json({ message: 'El libro ya está en la colección' })
      }

      // Actualizar colección
      await this.UsersModel.updateUser(userId, {
        coleccionsIds: [
          ...user.coleccionsIds.filter(
            coleccion => coleccion.nombre !== collectionName
          ),
          {
            nombre: collection.nombre,
            librosIds: [...collection.librosIds, bookId]
          }
        ]
      })

      res.json({ message: 'Libro agregado a la colección' })
    } catch (err) {
      next(err)
    }
  }
}
