import fs from 'node:fs/promises'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../../assets/config.js'
import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
import crypto from 'node:crypto'
import { userObject } from '../userObject.js'
import { PartialUserInfoType, UserInfoType } from '../../../types/user.js'
import { ID, ImageType } from '../../../types/objects.js'
import { calculateMatchScore } from '../../../assets/calculateMatchScore.js'
import { changeToArray } from '../../../assets/changeToArray.js'
import path from 'node:path'
// __dirname is not available in ES modules, so we need to use import.meta.url
import { __dirname } from '../../../assets/config.js'
const usersPath = path.join(__dirname, 'data', 'users.json')
class UsersModel {
  static async getAllUsers (): Promise<UserInfoType[]> {
    // Esta función devuelve todos los usuarios, incluyendo información sensible como la contraseña
    const data = await fs.readFile(usersPath, 'utf-8')
    if (!data) {
      throw new Error('No se encontraron usuarios')
    }
    const users: UserInfoType[] = JSON.parse(data)
    return users.map(user => userObject(user, true) as UserInfoType)
  }

  static async getAllUsersSafe (): Promise<PartialUserInfoType[]> {
    // Esta función devuelve todos los usuarios, pero sin información sensible como la contraseña
    const data = await fs.readFile(usersPath, 'utf-8')
    const users: PartialUserInfoType[] = JSON.parse(data)
    if (!data) {
      throw new Error('No se encontraron usuarios')
    }
    return users.map(user => userObject(user, false) as PartialUserInfoType)
  }

  static async getUserById (id: ID): Promise<PartialUserInfoType> {
    // Esta función devuelve un usuario específico por su ID, pero sin información sensible como la contraseña
    const users = await this.getAllUsersSafe()
    const user = users.find(user => user.id === id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    // Return user with limited public information
    return userObject(user, false) as PartialUserInfoType
  }

  static async getPhotoAndNameUser (id: ID): Promise<{
    id: ID
    foto_perfil: ImageType
    nombre: string
  }> {
    const users = await this.getAllUsersSafe()
    const user = users.find(user => user.id === id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    // Return user with limited public information
    return {
      id: user.id,
      foto_perfil: user.foto_perfil,
      nombre: user.nombre
    }
  }

  static async getEmailById (
    id: ID
  ): Promise<{ correo: string; nombre: string }> {
    const users = await this.getAllUsers()
    const user = users.find(user => user.id === id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    // Return user with limited public information
    return { correo: user.correo, nombre: user.nombre }
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getUserByQuery (query: string): Promise<PartialUserInfoType[]> {
    const users = await this.getAllUsersSafe()

    // Funcion para calcular el nivel de coincidencia entre la query y los resultados

    // Dividimos la query en palabras
    const queryWords = changeToArray(query)

    // Recorremos todos los libros y calculamos el puntaje de coincidencia
    const usersWithScores = users
      .map((user: PartialUserInfoType) => {
        const score = calculateMatchScore(user, queryWords, query)

        // Validamos si el score es suficiente, por ejemplo si es menor a 2 no lo devolvemos

        if (score < queryWords.length * 0.7) return null // Si el score es menor al umbral, devolvemos null para descartarlo

        return { user, score } // Devolvemos el libro junto con su puntaje si pasa la validación
      })
      .filter(item => item !== null) // Filtramos los resultados nulos

    if (usersWithScores.length === 0) {
      throw new Error(
        'No se encontraron usuarios que coincidan con la búsqueda'
      )
    }
    // Ordenamos los libros por el puntaje en orden descendente
    usersWithScores.sort((a, b) => b.score - a.score)

    // Devolvemos los libros ordenados, pero solo los datos del libro
    return usersWithScores.map(item => item.user)
  }

  static async login (
    correo: string,
    contraseña: string
  ): Promise<PartialUserInfoType> {
    const users = await this.getAllUsers()
    const user = users.find(usuario => usuario.correo === correo)
    if (!user) {
      throw new Error('El correo no existe')
    }
    const validated = await bcrypt.compare(contraseña, user.contraseña)
    // Validar que la contraseña sea
    if (!validated) {
      throw new Error('La contraseña es incorrecta')
    }
    // Return user info, but avoid password or sensitive data
    return userObject(user, false) as PartialUserInfoType
  }

  static async googleLogin (data: {
    nombre: string
    correo: string
    fotoPerfil: ImageType
  }): Promise<PartialUserInfoType> {
    // Validate input data
    if (!data.nombre || !data.correo) {
      throw new Error('Data inválida: El correo y el nombre son obligatorios')
    }
    const users = await this.getAllUsers()
    // Check if the user exists
    const user = users.find(usuario => usuario.correo === data.correo)
    if (!user) {
      // Google sign-up flow
      const newUser = userObject(data, true) // Ensure `userObject` sanitizes and structures the input
      newUser.login = 'Google' // Mark this as a Google user
      // userObject() elimina el correo y la contraseña (que no hay)
      newUser.correo = data.correo
      // La validación es por defecto true si se hace este método
      newUser.validated = true
      newUser.id = crypto.randomUUID()
      users.push(newUser)
      // Write the new user to the file
      await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf8')
      return userObject(newUser, false)
    }
    return userObject(user, false)
  }

  static async facebookLogin (data: {
    nombre: string
    correo: string
    fotoPerfil: ImageType
  }): Promise<PartialUserInfoType> {
    const users = await this.getAllUsers()
    // Check if the user exists
    const user = users.find(usuario => usuario.correo === data.correo)
    if (!user) {
      // Google sign-up flow
      const newUser = userObject(data, true) as UserInfoType // Ensure `userObject` sanitizes and structures the input
      newUser.login = 'Facebook' // Mark this as a Facebook user
      // userObject() elimina el correo y la contraseña (que no hay)
      newUser.correo = data.correo
      // La validación es por defecto true si se hace este método
      newUser.validated = true
      users.push(newUser)
      // Write the new user to the file
      await fs.writeFile(usersPath, JSON.stringify(users, null, 2), 'utf8')
      return userObject(newUser, false)
    }
    // Si ya existe el usuario solo devolverlo
    return userObject(user, false)
  }

  static async getUserByEmail (correo: string): Promise<UserInfoType> {
    const users = await this.getAllUsers()
    const user = users.find(usuario => usuario.correo === correo)
    if (!user) {
      throw new Error('El correo no existe')
    }
    // Return user info, but avoid password or sensitive data
    return userObject(user, true) as UserInfoType
  }

  static async createUser (data: {
    nombre: string
    correo: string
    contraseña: string
  }): Promise<UserInfoType> {
    const users = await this.getAllUsers()
    // Crear valores por defecto
    const newUser = userObject(data, true) as UserInfoType // Ensure `userObject` sanitizes and structures the input
    newUser.contraseña = await bcrypt.hash(newUser.contraseña, SALT_ROUNDS)
    users.push(newUser)
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2))
    return newUser
  }

  static async updateUser (
    id: ID,
    data: Partial<UserInfoType>
  ): Promise<PartialUserInfoType> {
    const users = await this.getAllUsers()
    const userIndex = users.findIndex(
      user => user.id.toString() === id.toString()
    )
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado')
    }
    if (data.correo !== undefined && data.correo) {
      const emailRepeated = users
        .filter(user => user.id.toString() !== id.toString())
        .some(user => user.correo === data.correo)
      if (emailRepeated) {
        throw new Error('El correo ya está en uso')
      }
    }
    if (data.contraseña) {
      data.contraseña = await bcrypt.hash(data.contraseña, SALT_ROUNDS)
    }
    // Actualiza los datos del usuario
    Object.assign(users[userIndex], data)
    // Hacer el path hacia aqui
    // const filePath = pat h.join()
    const info = JSON.stringify(users, null, 2)
    await fs.writeFile(usersPath, info, 'utf-8')
    return userObject(users[userIndex], false) as PartialUserInfoType
  }

  static async deleteUser (id: ID): Promise<{ message: string }> {
    const users = await this.getAllUsersSafe()
    const userIndex = users.findIndex(user => user.id === id)
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado')
    }
    users.splice(userIndex, 1)
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2))
    return { message: 'Usuario eliminado con éxito' } // Mensaje de éxito
  }

  static async getBalance (id: ID): Promise<{
    pendiente?: number
    disponible?: number
    porLlegar?: number
  }> {
    const user = await this.getUserById(id)
    return user.balance
  }
}

export { UsersModel }
