import dbLocal from 'db-local'

const { Schema } = new dbLocal({ path: './models/' })

const UserSchemaName = 'users'
const usersModel = {
  _id: {
    type: String,
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  librosIds: {
    type: Array,
    items: {
      type: String // Ensure each item in librosIds is a string
    },
    default: []
  },
  correo: {
    type: String,
    required: true,
    unique: true
  },
  contraseña: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'admin'],
    default: 'usuario'
  },
  fechaRegistro: {
    type: String
  },
  estadoCuenta: {
    type: String,
    enum: ['activo', 'inactivo', 'suspendido'],
    default: 'activo'
  },
  direccionEnvio: {
    calle: {
      type: String,
      default: ''
    },
    ciudad: {
      type: String,
      default: ''
    },
    pais: {
      type: String,
      default: ''
    },
    codigoPostal: {
      type: String,
      default: ''
    }
  },
  fotoPerfil: {
    type: String,
    default: ''
  },
  creadoEn: {
    type: String
  },
  actualizadoEn: {
    type: String
  }
}

const User = Schema(UserSchemaName, usersModel)

class UsersModel {
  static async getAllUsers () {
    try {
      const data = await User.find()
      return data
    } catch (err) {
      console.error('Error reading users:', err)
      throw new Error(err)
    }
  }

  static async getUserById (id) {
    try {
      const user = User.find(user => user._id === id)
      if (!user) {
        return null // Si no se encuentra el usuario, retorna null
      }
      return user
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getUserByQuery (query) {

  }

  static async getUserByEmail (email) {
    try {
      const user = User.find(user => user.correo === email)
      if (!user) {
        return null // Si no se encuentra el usuario, retorna null
      }
      return user
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  static async createUser (data) {
    try {
      User.create(data).save()
      return data // Retorna el usuario creado
    } catch (err) {
      console.error('Error creating user:', err)
      throw new Error('Error creating user')
    }
  }

  static async updateUser (id, data) {
    try {
      const userFound = User.find(user => user._id === id)
      userFound.update(data)
      if (data.correo && User.find(user => user.correo === data.correo)) {
        throw new Error('Email is already in use')
      }

      return userFound // Retorna el usuario actualizado
    } catch (err) {
      console.error('Error updating user:', err)
      throw new Error(err)
    }
  }

  static async deleteUser (id) {
    try {
      const userFound = User.find(user => user._id === id)[0]
      if (!userFound) throw new Error('User not found')
      const deleted = userFound.remove()
      if (deleted) {
        return { message: 'User deleted successfully' } // Mensaje de éxito
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      throw new Error('Error deleting user')
    }
  }
}

export { UsersModel }
