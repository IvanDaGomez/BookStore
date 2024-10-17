import { UsersModel } from '../../models/local/usersLocal.js'
import crypto from 'node:crypto'
import { validateUser, validatePartialUser } from '../../assets/validate.js'
import { SECRET_KEY } from '../../assets/config.js'
import jwt from 'jsonwebtoken'

export class UsersController {
  static async getAllUsers (req, res) {
    try {
      const users = await UsersModel.getAllUsers()
      if (!users) {
        res.status(500).json({ error: 'Cannot read users' })
      }
      res.json(users)
    } catch (err) {
      console.error('Error reading users:', err)
      res.status(500).json({ error: 'Error reading users' })
    }
  }

  static async getAllUsersSafe (req, res) {
    try {
      const users = await UsersModel.getAllUsersSafe()
      if (!users) {
        res.status(500).json({ error: 'Cannot read users' })
      }
      res.json(users)
    } catch (err) {
      console.error('Error reading users:', err)
      res.status(500).json({ error: 'Error reading users' })
    }
  }

  static async getUserById (req, res) {
    try {
      const { userId } = req.params
      const user = await UsersModel.getUserById(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(user)
    } catch (err) {
      console.error('Error reading user:', err)
      res.status(500).json({ error: 'Error reading user' })
    }
  }

  static async getUserByQuery (req, res) {
    try {
      const { q } = req.query // Obtener el valor del parámetro de consulta 'q'

      if (!q) {
        return res.status(400).json({ error: 'Query parameter "q" is required' })
      }

      const users = await UsersModel.getUserByQuery(q) // Asegurarse de implementar este método en UsersModel
      if (users.length === 0) {
        return res.status(404).json({ error: 'No users found' })
      }

      res.json(users)
    } catch (err) {
      console.error('Error reading users by query:', err)
      res.status(500).json({ error: 'Error reading users' })
    }
  }

  static async login (req, res) {
    try {
      const { correo, contraseña } = req.body // Obtener el valor del parámetro de consulta 'e'
      if (!correo || !contraseña) {
        return res.status(400).json({ error: 'Some spaces are in blank' })
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
          expiresIn: '1h'
        }
      )
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60 // 1 hora
        })
        .send({ user, token })
    } catch (err) {
      console.error('Error reading user by email:', err)
      res.status(500).json({ error: 'Error reading user' })
    }
  }

  static async createUser (req, res) {
    const data = req.body
    // Validación
    const validated = validateUser(data)
    if (!validated.success) {
      return res.status(400).json({ error: validated.error })
    }

    data._id = crypto.randomUUID()

    // Revisar si el correo ya está en uso
    const users = await UsersModel.getAllUsers()
    const emailRepeated = users.some(user => user.correo === data.correo)
    if (emailRepeated) {
      return res.status(409).json({ error: 'El correo ya está en uso' })
    }
    const time = new Date()
    data.creadoEn = time
    data.actualizadoEn = time
    // Crear usuario
    console.log(data)
    const user = await UsersModel.createUser(data)
    if (!user) {
      return res.status(500).json({ error: 'Error creando usuario' })
    }

    const token = jwt.sign(
      user,
      SECRET_KEY,
      {
        expiresIn: '1h'
      }
    )

    if (!token) {
      return res.status(500).send({ error: 'Error al generar el token' })
    }

    // Si todo es exitoso, devolver el usuario creado
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
      })
      .send({ user })
  }

  static async deleteUser (req, res) {
    try {
      const { userId } = req.params
      const result = await UsersModel.deleteUser(userId)
      if (!result) {
        return res.status(404).json({ error: 'User not found' })
      }
      res.json(result)
    } catch (err) {
      console.error('Error deleting user:', err)
      res.status(500).json({ error: 'Error deleting user' })
    }
  }

  static async updateUser (req, res) {
    try {
      const { userId } = req.params
      const data = req.body

      // Validar datos
      const validated = validatePartialUser(data)
      if (!validated.success) {
        return res.status(400).json({ error: 'Error Validating user', details: validated.error.errors })
      }

      // Comprobar si el correo ya está en uso
      if (data.correo) {
        const existingUser = await UsersModel.getUserByEmail(data.correo)
        if (existingUser && existingUser.id !== userId) {
          return res.status(409).json({ error: 'Email is already in use' })
        }
      }

      // Filtrar los campos permitidos
      const allowedFields = ['nombre', 'correo', 'direccionEnvio', 'fotoPerfil', 'contraseña']
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
        res.status(404).json({ error: 'User not found or not updated' })
      }

      res.status(200).json(user)
    } catch (err) {
      console.error('Error updating user:', err)
      res.status(500).json({ error: 'Internal server error' })
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
}
