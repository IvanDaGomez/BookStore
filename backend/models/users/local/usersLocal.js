import fs from 'node:fs/promises'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../../assets/config.js'
import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
import crypto from 'node:crypto'

function userObject (name) {
  return {
    _id: name._id,
    nombre: name.nombre,
    rol: name.rol,
    fotoPerfil: name.fotoPerfil, // Example of public info
    librosIds: name.librosIds,
    estadoCuenta: name.estadoCuenta,
    creadoEn: name.creadoEn,
    bio: name.bio || '',
    favoritos: name.favoritos || [],
    conversationsIds: name.conversationsIds || [],
    notificationsIds: name.notificationsIds || [],
    validated: name.validated || false,
    login: name.login || 'default',
    ubicacion: name.ubicacion || {}
    // Avoid exposing sensitive fields like password, email, etc.
  }
}
class UsersModel {
  static async getAllUsers () {
    try {
      const data = await fs.readFile('./models/users.json', 'utf-8')
      if (!data) {
        throw new Error('User data is empty or missing.')
      }
      const users = JSON.parse(data)
      return users
    } catch (err) {
      console.error('Error reading users:', err)
      throw err
    }
  }

  static async getAllUsersSafe () {
    try {
      const data = await fs.readFile('./models/users.json', 'utf-8')
      const users = JSON.parse(data)

      return users.map(user => userObject(user))
    } catch (err) {
      console.error('Error reading users:', err)
      throw new Error(err)
    }
  }

  static async getUserById (id) {
    try {
      const users = await this.getAllUsers()
      const user = users.find(user => user._id === id)
      if (!user) {
        return null
      }

      // Return user with limited public information
      return userObject(user)
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  static async getPhotoAndNameUser (id) {
    try {
      const users = await this.getAllUsers()
      const user = users.find(user => user._id === id)
      if (!user) {
        return null
      }

      // Return user with limited public information
      return {
        _id: user._id,
        fotoPerfil: user.fotoPerfil,
        nombre: user.nombre
      }
    } catch (err) {
      console.error('Error reading user:', err)
      return { error: 'Error reading user' }
    }
  }

  static async getEmailById (id) {
    try {
      const users = await this.getAllUsers()
      const user = users.find(user => user._id === id)
      if (!user) {
        return null
      }

      // Return user with limited public information
      return { correo: user.correo }
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getUserByQuery (query) {
    const users = await this.getAllUsers()

    // Funcion para calcular el nivel de coincidencia entre la query y los resultados
    const calculateMatchScore = (user, queryWords) => {
      let score = 0
      const tolerance = 2 // Máxima distancia de Levenshtein permitida para considerar una coincidencia

      for (const value of Object.values(user)) {
        if (typeof value === 'string') {
          const valueWords = value.split(' ')
          for (const queryWord of queryWords) {
            valueWords.forEach(word => {
              const distance = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
              if (distance <= tolerance) {
                score += 1 // Incrementa el score si la distancia está dentro del umbral de tolerancia
              }
            })
          }
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            if (typeof item === 'string') {
              const itemWords = item.split(' ')
              for (const queryWord of queryWords) {
                itemWords.forEach(word => {
                  const distance = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
                  if (distance <= tolerance) {
                    score += 1
                  }
                })
              }
            }
          })
        }
      }

      return score
    }

    // Dividimos la query en palabras
    const queryWords = query.split(' ')

    // Recorremos todos los libros y calculamos el puntaje de coincidencia
    const usersWithScores = users.map(user => {
      const score = calculateMatchScore(user, queryWords)

      // Validamos si el score es suficiente, por ejemplo si es menor a 2 no lo devolvemos

      if (score < queryWords.length * 0.7) return null // Si el score es menor al umbral, devolvemos null para descartarlo

      return { user, score } // Devolvemos el libro junto con su puntaje si pasa la validación
    }).filter(item => item !== null) // Filtramos los resultados nulos

    // Ordenamos los libros por el puntaje en orden descendente
    usersWithScores.sort((a, b) => b.score - a.score)

    // Devolvemos los libros ordenados, pero solo los datos del libro
    return usersWithScores.map(item => item.user)
  }

  static async login (correo, contraseña) {
    try {
      const users = await this.getAllUsers()
      const user = users.find(usuario => usuario.correo === correo)
      if (!user) {
        return 'No encontrado'
      }
      const validated = await bcrypt.compare(contraseña, user.contraseña)
      // Validar que la contraseña sea
      if (!validated) {
        return 'Contraseña no coincide'
      }

      // Return user info, but avoid password or sensitive data
      return userObject(user)
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  static async googleLogin (data) {
    try {
      // Validate input data
      if (!data.nombre || !data.correo) {
        throw new Error('Invalid data: Email and name are required')
      }

      const users = await this.getAllUsers()

      // Check if the user exists
      const user = users.find(usuario => usuario.correo === data.correo)

      if (!user) {
        // Google sign-up flow
        const newUser = userObject(data) // Ensure `userObject` sanitizes and structures the input
        newUser.login = 'Google' // Mark this as a Google user
        // userObject() elimina el correo y la contraseña (que no hay)
        newUser.correo = data.correo

        newUser._id = crypto.randomUUID()
        users.push(newUser)
        // Write the new user to the file
        await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2), 'utf8')
        return newUser
      }
      return userObject(user)
    } catch (err) {
      console.error('Error handling Google login:', err.message || err)
      throw new Error('An error occurred while processing your request')
    }
  }

  static async facebookLogin (data) {
    try {
      // Validate input data
      if (!data.nombre || !data.correo) {
        throw new Error('Invalid data: Email and name are required')
      }

      const users = await this.getAllUsers()
      console.log(data)
      return
      // Check if the user exists
      const user = users.find(usuario => usuario.correo === data.correo)

      if (!user) {
        // Google sign-up flow
        const newUser = userObject(data) // Ensure `userObject` sanitizes and structures the input
        newUser.login = 'Facebook' // Mark this as a Facebook user
        // userObject() elimina el correo y la contraseña (que no hay)
        newUser.correo = data.correo

        newUser._id = crypto.randomUUID()
        users.push(newUser)
        // Write the new user to the file
        await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2), 'utf8')
        return newUser
      }
      return userObject(user)
    } catch (err) {
      console.error('Error handling Google login:', err.message || err)
      throw new Error('An error occurred while processing your request')
    }
  }
  static async getUserByEmail (correo) {
    try {
      const users = await this.getAllUsers()
      const user = users.find(usuario => usuario.correo === correo)
      if (!user) {
        return 'No encontrado'
      }
      // Return user info, but avoid password or sensitive data
      return userObject(user)
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  static async createUser (data) {
    try {
      const users = await this.getAllUsers()

      // Crear valores por defecto
      const newUser = userObject(data)

      newUser.contraseña = await bcrypt.hash(newUser.contraseña, SALT_ROUNDS)
      users.push(newUser)
      await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2))
      return userObject(newUser)
    } catch (err) {
      console.error('Error creating user:', err)
      throw new Error('Error creating user')
    }
  }

  static async updateUser (id, data) {
    try {
      const users = await this.getAllUsers()

      const userIndex = users.findIndex(user => user._id.toString() === id.toString())
      if (userIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      if (data.correo !== undefined && data.correo) {
        const emailRepeated = users
          .filter(user => user._id.toString() !== id.toString())
          .some(user => user.correo === data.correo)
        if (emailRepeated) {
          throw new Error('El correo ya está en uso')
        }
      }
      if (data.contraseña) {
        data.contraseña = await bcrypt.hash(data.contraseña, SALT_ROUNDS)
      }
      console.log(data)
      // Actualiza los datos del usuario
      Object.assign(users[userIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2))

      return userObject(users[userIndex])
    } catch (err) {
      console.error('Error:', err)
      throw new Error(err)
    }
  }

  static async deleteUser (id) {
    try {
      const users = await this.getAllUsers()
      const userIndex = users.findIndex(user => user._id === id)
      if (userIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      users.splice(userIndex, 1)
      await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2))
      return { message: 'User deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting user:', err)
      throw new Error('Error deleting user')
    }
  }
}

export { UsersModel }
