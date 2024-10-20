import fs from 'node:fs/promises'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../../assets/config.js'
class UsersModel {
  static async getAllUsers () {
    try {
      const data = await fs.readFile('./models/users.json', 'utf-8')
      const users = JSON.parse(data)

      return users
      // Return only non-sensitive information
      /* return users.map(user => ({
        _id: user._id,
        nombre: user.nombre,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil, // Example of public info
        librosIds: user.librosIds,
        estadoCuenta: user.estadoCuenta,
        creadoEn: user.creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      })) */
    } catch (err) {
      console.error('Error reading users:', err)
      throw new Error(err)
    }
  }

  static async getAllUsersSafe () {
    try {
      const data = await fs.readFile('./models/users.json', 'utf-8')
      const users = JSON.parse(data)

      return users.map(user => ({
        _id: user._id,
        nombre: user.nombre,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil, // Example of public info
        librosIds: user.librosIds,
        estadoCuenta: user.estadoCuenta,
        creadoEn: user.creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      }))
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
      return {
        _id: user._id,
        nombre: user.nombre,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil, // Example of public info
        librosIds: user.librosIds,
        estadoCuenta: user.estadoCuenta,
        creadoEn: user.creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      }
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getUserByQuery (query) {
    const users = await this.getAllUsers()

    // Calcula la distancia de Levenshtein entre dos strings
    const levenshteinDistance = (a, b) => {
      const matrix = Array.from({ length: a.length + 1 }, () =>
        Array(b.length + 1).fill(0)
      )

      for (let i = 0; i <= a.length; i++) matrix[i][0] = i
      for (let j = 0; j <= b.length; j++) matrix[0][j] = j

      for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1
          matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j - 1] + cost
          )
        }
      }

      return matrix[a.length][b.length]
    }

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
      return {
        _id: user._id,
        nombre: user.nombre,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil, // Example of public info
        librosIds: user.librosIds,
        estadoCuenta: user.estadoCuenta,
        creadoEn: user.creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      }
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
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
      return {
        _id: user._id,
        nombre: user.nombre,
        rol: user.rol,
        fotoPerfil: user.fotoPerfil, // Example of public info
        librosIds: user.librosIds,
        estadoCuenta: user.estadoCuenta,
        creadoEn: user.creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      }
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  static async createUser (data) {
    try {
      const users = await this.getAllUsers()

      // Crear valores por defecto
      const newUser = {
        nombre: data.nombre, // Nombre proporcionado
        librosIds: data.librosIds || [], // Asignar librosIds o array vacío por defecto
        correo: data.correo, // Correo proporcionado
        contraseña: data.contraseña, // Contraseña (asegúrate de encriptarla antes de guardarla)
        rol: data.rol || 'usuario', // Rol por defecto 'usuario'
        fechaRegistro: new Date().toISOString(), // Fecha actual (solo la fecha)
        estadoCuenta: data.estadoCuenta || 'activo', // Estado por defecto 'activo'
        fotoPerfil: data.fotoPerfil || '', // URL por defecto
        _id: data._id, // Generar un ID único para el usuario
        actualizadoEn: new Date().toISOString(), // Fecha y hora de actualización
        direccionEnvio: data.direccionEnvio || { // Asignar dirección de envío o objeto vacío
          calle: '',
          ciudad: '',
          pais: '',
          codigoPostal: ''
        }
      }

      newUser.contraseña = await bcrypt.hash(newUser.contraseña, SALT_ROUNDS)
      users.push(newUser)
      await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2))
      return {
        _id: newUser._id,
        nombre: newUser.nombre,
        rol: newUser.rol,
        fotoPerfil: newUser.fotoPerfil, // Example of public info
        librosIds: newUser.librosIds,
        estadoCuenta: newUser.estadoCuenta,
        creadoEn: newUser.creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      }
    } catch (err) {
      console.error('Error creating user:', err)
      throw new Error('Error creating user')
    }
  }

  static async updateUser (id, data) {
    try {
      const users = await this.getAllUsers()

      const userIndex = users.findIndex(user => user._id === id)
      if (userIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      if (data.mail) {
        const emailRepeated = users.splice(userIndex, 1).some(user => user.mail === data.mail)
        if (emailRepeated) {
          throw new Error('Email is already in use')
        }
      }
      // Actualiza los datos del usuario
      Object.assign(users[userIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/users.json', JSON.stringify(users, null, 2))

      return {
        _id: users[userIndex]._id,
        nombre: users[userIndex].nombre,
        rol: users[userIndex].rol,
        fotoPerfil: users[userIndex].fotoPerfil, // Example of public info
        librosIds: users[userIndex].librosIds,
        estadoCuenta: users[userIndex].estadoCuenta,
        creadoEn: users[userIndex].creadoEn
        // Avoid exposing sensitive fields like password, email, etc.
      }
    } catch (err) {
      console.error('Error updating user:', err)
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
