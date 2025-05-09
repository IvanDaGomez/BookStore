/* eslint-disable camelcase */
import { validateUser, validatePartialUser } from '../../assets/validate.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { createNotification } from '../../assets/notifications/createNotification.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'
// eslint-disable-next-line no-unused-vars

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
import {
  IBooksModel,
  ITransactionsModel,
  IUsersModel
} from '../../types/models.js'
import { AuthToken } from '../../types/authToken.js'
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
    TransactionsModel: ITransactionsModel
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
      const userId = req.params.user_id as ID
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
      const userId = req.params.user_id as ID
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
      const userId = req.params.user_id as ID
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
        foto_perfil: ImageType
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
      const { nombre, correo, foto_perfil } = req.body as {
        correo: string | undefined
        nombre: string | undefined
        foto_perfil?: ImageType
      }
      if (!nombre || !correo) {
        return res.status(400).json({
          error: 'Algunos espacios están en blanco',
          details: 'Nombre y correo son requeridos'
        })
      }
      const user = await this.UsersModel.facebookLogin({
        nombre,
        correo,
        foto_perfil: foto_perfil ?? ''
      })

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
      await sendNotification(
        createNotification(
          {
            id: user.id
          },
          'welcomeUser'
        )
      )
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
      const userId = req.params.user_id as ID
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
      const userId = req.params.user_id as ID
      const data: Partial<UserInfoType> = req.body
      // Validar datos
      const validated = validatePartialUser(data)
      if (!validated.success) {
        console.dir(validated.error.errors, { depth: null })
        return res.status(400).json({
          error: 'Error validando usuario',
          details: validated.error.errors
        })
      }

      const updatedData = await processUserUpdate(data, userId, req)

      // Actualizar usuario
      console.log('Updating user...')
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
    console.log(req.body)
    try {
      const userId = req.params.user_id as ID
      
      const { accion, book_id } = req.body as { accion: string; book_id: ID }
      
      if (!accion) {
        return res.status(400).json({ error: 'Acción no proporcionada' })
      }

      const updatedFavorites = await updateUserFavorites(
        userId,
        book_id,
        accion
      )

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
        const user = await this.UsersModel.getUserById(req.session.user.id)
        if (user.estado_cuenta === 'Suspendido') {
          return res.status(403).json({ message: 'Usuario baneado' })
        }
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
      id: ID
      nombre: string
      correo: string
      validated: string
    } = req.body
    if (!data || !data.nombre || !data.correo) {
      return res
        .status(400)
        .json({
          error: 'No se proporcionaron todos los campos: nombre or correo'
        })
    }
    if (data.validated === 'true') {
      // Si el usuario ya está validado, no se envía el correo
      return res.json({ verified: true })
    }
    try {
      // Generate a token with user ID (or email) for validation
      const token = jwt.sign(
        {
          id: data.id,
          nombre: data.nombre
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      )

      // Create the validation code of 6 digits
      const validation_code = Math.floor(100000 + Math.random() * 900000)

      // Prepare the email content
      const validated = data.validated === 'true'
      const emailContent = createEmail(
        {
          user: {
            ...data,
            validated
          },
          metadata: {
            validation_code
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
        code: validation_code
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
        data.id
      )
      const correo = await this.UsersModel.getEmailById(data.id)

      // Verify that the email matches
      if (data.nombre !== correo.nombre) {
        return res.status(400).json({ error: 'Email mismatch' })
      }

      // Check if the user is already validated
      // if (user.validated) {
      //   return res.json({ status: 'User already validated' })
      // }

      // Update the user's validation status
      await this.UsersModel.updateUser(data.id, {
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
      const tokenPayload = { id: user.id } // No incluir información sensible
      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '15m' })

      const validation_link = `${process.env.FRONTEND_URL}/opciones/cambiarContraseña/${token}`
      const emailContent = createEmail(
        { user, metadata: { validation_link } },
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

      const id = decodedToken.id
      // Actualizar la contraseña (el hash se realiza en el modelo)
      await this.UsersModel.updateUser(id, { contraseña: password })

      return res.json({ ok: true, message: 'Contraseña actualizada con éxito' })
    } catch (err) {
      next(err)
    }
  }

  followUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    const { follower_id, user_id }: { follower_id: ID; user_id: ID } = req.body
    try {
      if (!follower_id || !user_id) {
        return res
          .status(404)
          .json({ ok: false, error: 'No se proporcionó usuario y seguidor' })
      }
      // Es necesario conseguir el usuario para saber que otros seguidores tenía
      const [follower, user] = await Promise.all([
        this.UsersModel.getUserById(follower_id),
        this.UsersModel.getUserById(user_id)
      ])

      let action
      // Agregar el seguidor
      if (!follower.seguidores.includes(user_id)) {
        follower.seguidores = [...follower.seguidores, user_id]
        user.siguiendo = [...user.siguiendo, follower_id]
        action = 'Agregado'

        // Eliminar el seguidor
      } else {
        follower.seguidores = follower.seguidores.filter(
          seguidor_id => seguidor_id !== user_id
        )
        user.siguiendo = follower.seguidores.filter(
          siguiendo_id => siguiendo_id !== follower_id
        )
        action = 'Eliminado'
      }

      await Promise.all([
        this.UsersModel.updateUser(follower_id, follower),
        this.UsersModel.updateUser(user_id, user)
      ])

      // Notificación de nuevo seguidor
      if (action === 'Agregado') {
        await sendNotification(createNotification({ follower }, 'newFollower'))
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
      const userId = req.params.user_id as ID

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
    const {
      collection_name,
      user_id
    }: { collection_name: string; user_id: ID } = req.body
    try {
      if (!user_id || !collection_name) {
        return res
          .status(400)
          .json({ error: 'No se entregaron todos los campos' })
      }

      const user = await this.UsersModel.getUserById(user_id)

      // Agregar la nueva colección
      const updated = await this.UsersModel.updateUser(user_id, {
        collections_ids: [
          ...user.collections_ids,
          { nombre: collection_name, librosIds: [] }
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

      const collection = user.collections_ids.find(
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
        collections_ids: [
          ...user.collections_ids.filter(
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
  banUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { username } = req.body
      const result = await this.UsersModel.banUser(username)
      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}
