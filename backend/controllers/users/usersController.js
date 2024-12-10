/* eslint-disable camelcase */
import { UsersModel } from '../../models/users/local/usersLocal.js'
import crypto, { randomUUID } from 'node:crypto'
import { validateUser, validatePartialUser } from '../../assets/validate.js'
import { SECRET_KEY, ACCESS_TOKEN } from '../../assets/config.js'
import jwt from 'jsonwebtoken'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
import { Preference, MercadoPagoConfig, Payment } from 'mercadopago'
import { createNotification } from '../../assets/notifications/createNotification.js'
import { sendNotification } from '../../assets/notifications/sendNotification.js'

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

      if (user === 'No encontrado') {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      if (user === 'Contraseña no coincide') {
        return res.status(404).json({ error: 'La contraseña es incorrecta' })
      }
      const tokenToSend = {
        _id: user._id,
        nombre: user.nombre
      }
      // Token
      const token = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        {
          expiresIn: '3h'
        }
      )
      console.log('todogood')
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 horas
        })
        .send({ user })
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
      const tokenToSend = {
        _id: user._id,
        nombre: user.nombre
      }
      // Token
      const token = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        {
          expiresIn: '3h'
        }
      )
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 horas
        })
        .send({ user })
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
      const tokenToSend = {
        _id: user._id,
        nombre: user.nombre
      }
      // Token
      const token = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        {
          expiresIn: '3h'
        }
      )
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 horas
        })
        .send({ user })
    } catch (err) {
      console.error('Error leyendo usuario por correo:', err)
      res.status(500).json({ error: 'Error leyendo usuario' })
    }
  }

  static async createUser (req, res) {
    const data = req.body
    // Validación
    try {
      const validated = validateUser(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error })
      }

      data.validated = false
      data._id = crypto.randomUUID()

      // Revisar si el correo ya está en uso
      const users = await UsersModel.getAllUsers()
      const emailRepeated = users.some(user => user.correo === data.correo)
      if (emailRepeated) {
        return res.json({ error: 'El correo ya está en uso' })
      }
      const time = new Date()
      data.creadoEn = time
      data.actualizadoEn = time
      // Crear usuario
      const user = await UsersModel.createUser(data)
      if (!user) {
        return res.status(500).json({ error: 'Error creando usuario' })
      }
      const tokenToSend = {
        _id: user._id,
        nombre: user.nombre
      }
      const token = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        {
          expiresIn: '3h'
        }
      )

      if (!token) {
        return res.status(500).send({ error: 'Error al generar el token' })
      }
      // Enviar correo de agradecimiento por unirse a meridian
      await sendEmail(`${data.nombre} ${data.correo}`, 'Bienvenido a Meridian!', createEmail(data, 'thankEmail'))

      // Enviar notificación de bienvenida

      await sendNotification(createNotification(data, 'welcomeUser'))
      // Si todo es exitoso, devolver el usuario creado
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 Horas
        })
        .send({ user })
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
        console.log(validated.error.errors)
        return res.status(400).json({ error: 'Error validando usuario', details: validated.error.errors })
      }

      if (req.file) data.fotoPerfil = `${req.file.filename}`
      if (data.favoritos && data.accion) {
        const user = await UsersModel.getUserById(userId)

        if (!user) {
          return res.status(404).json({ error: 'No se encontró el usuario' })
        }

        let updatedFavorites = user.favoritos || []

        if (data.accion === 'agregar') {
          // Ensure data.favoritos is treated as a string
          const favoritoId = String(data.favoritos)

          // Add only if it's not already in the array
          if (!updatedFavorites.includes(favoritoId)) {
            updatedFavorites = [...updatedFavorites, favoritoId]
          }
          data.favoritos = updatedFavorites
        } else if (data.accion === 'eliminar') {
          // Ensure data.favoritos is treated as a string
          const favoritoId = String(data.favoritos)

          // Remove the item from the favorites array
          updatedFavorites = updatedFavorites.filter(fav => fav !== favoritoId)

          data.favoritos = updatedFavorites
        }
      }

      // Comprobar si el correo ya está en uso
      if (data.correo) {
        const existingUser = await UsersModel.getUserByEmail(data.correo)

        if (existingUser && existingUser._id !== userId) {
          return res.status(409).json({ error: 'El correo ya está en uso' })
        }
        // Eliminar la validación del correo
        data.validated = false
      }

      // Filtrar los campos permitidos
      const allowedFields = ['nombre', 'correo', 'direccionEnvio', 'fotoPerfil', 'contraseña', 'bio', 'favoritos']
      const filteredData = {}
      Object.keys(data).forEach(key => {
        if (allowedFields.includes(key)) {
          filteredData[key] = data[key]
        }
      })

      filteredData.actualizadoEn = new Date()

      // Actualizar usuario
      const user = await UsersModel.updateUser(userId, filteredData)
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado o no actualizado' })
      }
      const tokenToSend = {
        _id: user._id,
        nombre: user.nombre
      }
      // Generar un nuevo token con los datos actualizados
      const newToken = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        { expiresIn: '3h' } // Tiempo de expiración del token
      )

      if (!newToken) {
        return res.status(500).json({ error: 'Error al generar el token' })
      }

      // Enviar el nuevo token en la cookie
      res
        .clearCookie('access_token')
        .cookie('access_token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 horas
        })
        .json(user)
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
      const token = jwt.sign({ _id: data._id, nombre: data.nombre }, SECRET_KEY, { expiresIn: '1h' })

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
      const tokenToSend = {
        _id: updated._id,
        nombre: updated.nombre
      }
      // Generate a new token with only essential data
      const newToken = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        { expiresIn: '3h' }
      )

      // Set the new cookie
      res
        .clearCookie('access_token')
        .cookie('access_token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 hours
        })
        .json({ status: 'User successfully validated', updated })
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
      const data = req.body
      const XidempotencyKey = randomUUID()

      // if (!token) {
      //   return res.status(400).json({
      //     status: 'error',
      //     message: 'El token de procesamiento ha expirado'
      //   })
      // }

      const client = new MercadoPagoConfig({
        accessToken: ACCESS_TOKEN // Your platform's access token

      })

      const payment = new Payment(client)
      console.log('Req.body:', req.body)
      const response = await payment.create({
        body: {
          ...data
        },
        requestOptions: {
          idempotencyKey: XidempotencyKey
        }
      })

      // Send email
      // Send notifications

      res.json({
        status: 'success',
        message: 'Payment processed successfully',
        id: response.id
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

  static async forYouPage (req, res) {
    const { l } = req.query
    const results = await UsersModel.forYouPage(l)

    if (!results) {
      return res.status(400).json({ ok: false, error: 'No se encontraron resultados' })
    }

    res.json({ data: results, ok: true })
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
      // Update the token
      const tokenToSend = {
        _id: user._id,
        nombre: user.nombre
      }
      // Generar un nuevo token con los datos actualizados
      const newToken = jwt.sign(
        tokenToSend,
        SECRET_KEY,
        { expiresIn: '3h' } // Tiempo de expiración del token
      )

      if (!newToken) {
        return res.status(500).json({ ok: false, error: 'Error al generar el token' })
      }
      // Notificación de nuevo seguidor
      if (action === 'Agregado') {
        await sendNotification(createNotification({ follower, user }, 'newFollower'))
      }

      // Enviar el nuevo token en la cookie
      res
        .clearCookie('access_token')
        .cookie('access_token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 horas
        })
        .json({ ok: true, action, follower, user })
    } catch (error) {
      console.error('Error:', error)
      res.status(500).json({ ok: false, error: 'Error del servidor' })
    }
  }
}
