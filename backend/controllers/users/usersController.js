import { UsersModel } from '../../models/users/local/usersLocal.js'
import crypto from 'node:crypto'
import { validateUser, validatePartialUser } from '../../assets/validate.js'
import { SECRET_KEY } from '../../assets/config.js'
import jwt from 'jsonwebtoken'
import { cambiarGuionesAEspacio } from '../../../frontend/src/assets/agregarMas.js'
import { sendEmail } from '../../assets/sendEmail.js'
import { createEmail } from '../../assets/htmlEmails.js'

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
      const { correo, contraseña } = req.body // Obtener el valor del parámetro de consulta 'e'
      if (!correo || !contraseña) {
        return res.status(400).json({ error: 'Algunos espacios están en blanco' })
      }

      const user = await UsersModel.login(correo, contraseña) // Asegúrate de implementar este método en UsersModel
      if (user === 'No encontrado') {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      if (user === 'Contraseña no coincide') {
        return res.status(404).json({ error: 'La contraseña no coincide' })
      }
      // Token
      const token = jwt.sign(
        user,
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

  static async googleLogin (req, res) {
    try {
      const data = req.body
      // If there is a mail, no matter if is manually logged or google, the user is the same
      const user = await UsersModel.googleLogin(data)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      // Token
      const token = jwt.sign(
        user,
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

      // Token
      const token = jwt.sign(
        user,
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

    const token = jwt.sign(
      user,
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
    // Si todo es exitoso, devolver el usuario creado
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 3 // 3 Horas
      })
      .send({ user })
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

      // Generar un nuevo token con los datos actualizados
      const newToken = jwt.sign(
        user,
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
      res.json({ user: req.session.user })
    } else {
      res.status(401).json({ message: 'No autenticado' })
    }
  }

  static async sendValidationEmail (req, res) {
    const data = req.body
    console.log('Llego')
    if (!data || !data.nombre || !data.correo) {
      return res.status(400).json({ error: 'Missing required fields: nombre or correo' })
    }

    try {
      // Generate a token with user ID (or email) for validation
      const token = jwt.sign({ _id: data._id, correo: data.correo }, SECRET_KEY, { expiresIn: '1h' })

      // Create the validation link
      const validationLink = `${process.env.FRONTEND_URL}/verificar/${token}`

      // Prepare the email content
      const emailContent = createEmail(
        { ...data, validationLink },
        'validationEmail'
      )

      // Send the email
      await sendEmail(
        `${data.nombre} <${data.correo}>`,
        'Correo de validación en Meridian',
        emailContent
      )

      res.json({ ok: true, status: 'Validation email sent successfully' })
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

      if (data.correo !== correo.correo) {
        return res.status(400).json({ error: 'Email mismatch' })
      }

      // Check if the user is already validated
      if (user.validated) {
        return res.status(200).json({ status: 'User already validated' })
      }

      // Update the user's validation status
      const updated = await UsersModel.updateUser(data._id, { validated: true })

      if (!updated) {
        return res.status(500).json({ error: 'Failed to update user validation status' })
      }
      console.log(updated)
      // Update de user cookie
      const newToken = jwt.sign(
        updated,
        SECRET_KEY,
        {
          expiresIn: '3h'
        }
      )
      // logout and then send the cookie
      // await this.logout(req, res)

      // Not working the update od the cookie
      res
        .cookie('access_token', newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 * 3 // 3 horas
        })
        .send({ status: 'User successfully validated' })
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
}
