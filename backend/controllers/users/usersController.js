import { UsersModel } from '../../models/local/usersLocal.js'
import crypto from 'node:crypto'
import { validateUser, validatePartialUser } from '../../assets/validate.js'

export class UsersController {
  static async getAllUsers (req, res) {
    try {
      const users = await UsersModel.getAllUsers()
      if (!users) {
        return res.status(500).json({ error: 'Cannot read users' })
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

  static async createUser (req, res) {
    const data = req.body

    // Validación
    //const validated = validateUser(data)
    //if (!validated.success) {
    //  return res.status(400).json({ error: validated.error })
    //}

    data.id = crypto.randomUUID()

    // Revisar si el correo ya está en uso
    const users = await UsersModel.getAllUsers()
    const emailRepeated = users.some(user => user.correo === data.correo)
    if (emailRepeated) {
      return res.status(409).json({ error: 'Email is already in use' })
    }
    const time = new Date()
    data.creadoEn = time
    data.actualizadoEn = time
    // Crear usuario
    const user = await UsersModel.createUser(data)
    if (!user) {
      return res.status(500).json({ error: 'Error creating user' })
    }

    // Si todo es exitoso, devolver el usuario creado
    return res.status(201).json(user)
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
      console.log(data)
      // Validar datos
      const validated = validatePartialUser(data)
      if (!validated.success) {
        return res.status(400).json({ error: 'Error Validating user' })
      }

      data.updatedIn = Date.now()
      // Actualizar usuario
      const user = await UsersModel.updateUser(userId, data)
      if (!user) {
        return res.status(404).json({ error: 'User not found or not updated' })
      }

      res.status(200).json(user)
    } catch (err) {
      console.error('Error updating user:', err)
      res.status(500).json({ error: err })
    }
  }
}
