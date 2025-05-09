import fs from 'node:fs/promises'
import bcrypt from 'bcrypt'
import { pool, SALT_ROUNDS } from '../../../assets/config.js'
import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
import crypto from 'node:crypto'
import { userObject } from '../userObject.js'
import { PartialUserInfoType, UserInfoType } from '../../../types/user.js'
import { ID, ImageType, ISOString } from '../../../types/objects.js'
import { calculateMatchScore } from '../../../assets/calculateMatchScore.js'
import { changeToArray } from '../../../assets/changeToArray.js'
import {
  DatabaseError,
  executeQuery,
  executeSingleResultQuery
} from '../../../utils/dbUtils.js'
class UsersModel {
  private static getEssencialFields (): string[] {
    return Object.keys(userObject({}, false))
  }
  static async getAllUsers (): Promise<UserInfoType[]> {
    // Esta función devuelve todos los usuarios, incluyendo información sensible como la contraseña
    const users = await executeQuery(
      pool,
      () => pool.query('SELECT * FROM users;'),
      'Error getting users'
    )
    return users
  }

  static async getAllUsersSafe (): Promise<PartialUserInfoType[]> {
    // Esta función devuelve todos los usuarios, pero sin información sensible como la contraseña
    const users = await executeQuery(
      pool,
      () =>
        pool.query(
          `SELECT ${this.getEssencialFields().join(', ')} FROM users;`
        ),
      'Error getting users'
    )
    return users
  }

  static async getUserById (id: ID): Promise<PartialUserInfoType> {
    // Esta función devuelve un usuario específico por su ID, pero sin información sensible como la contraseña
    const user: PartialUserInfoType = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          `SELECT ${this.getEssencialFields().join(', ')} FROM users WHERE id = $1;`,
          [id]
        ),
      'Error getting user'
    )
    console.log(id)
    return user
  }

  static async getPhotoAndNameUser (id: ID): Promise<{
    id: ID
    foto_perfil: ImageType
    nombre: string
  }> {
    const user = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(`SELECT id, foto_perfil, nombre FROM users WHERE id = $1;`, [
          id
        ]),
      'Error getting user'
    )
    console.log(id)
    // Return user with limited public information
    return user
  }

  static async getEmailById (
    id: ID
  ): Promise<{ correo: string; nombre: string }> {
    const user = await executeSingleResultQuery(
      pool,
      () => pool.query(`SELECT correo, nombre FROM users WHERE id = $1;`, [id]),
      'Error getting user'
    )
    return user
  }

  // Pendiente desarrollar, una buena query para buscar varios patrones
  static async getUserByQuery (
    query: string,
    l: number = 100
  ): Promise<PartialUserInfoType[]> {
    const users: PartialUserInfoType[] = await executeQuery(
      pool,
      () =>
        pool.query(
          `SELECT ${this.getEssencialFields().join(', ')} 
              FROM users ORDER BY RANDOM() LIMIT $1;`,
          [l]
        ),
      'Failed to fetch books from database'
    )
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

    // Ordenamos los libros por el puntaje en orden descendente
    usersWithScores.sort((a, b) => b.score - a.score)

    // Devolvemos los libros ordenados, pero solo los datos del libro
    return usersWithScores.map(item => item.user)
  }

  static async login (
    correo: string,
    contraseña: string
  ): Promise<PartialUserInfoType> {
    const user = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          `SELECT ${this.getEssencialFields().join(
            ', '
          )}, contraseña FROM users WHERE correo = $1;`,
          [correo]
        ),
      'Error getting user'
    )

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
    const user = await executeSingleResultQuery(
      pool,
      () => pool.query(`SELECT * FROM users WHERE correo = $1;`, [data.correo]),
      'Error getting user'
    )
    if (!user) {
      // Google sign-up flow
      const newUser = userObject(data, true) // Ensure `userObject` sanitizes and structures the input
      newUser.login = 'Google' // Mark this as a Google user
      // userObject() elimina el correo y la contraseña (que no hay)
      newUser.correo = data.correo
      // La validación es por defecto true si se hace este método
      newUser.validated = true
      await this.createUser(newUser)
      return userObject(newUser, false)
    }
    return userObject(user, false)
  }

  static async facebookLogin (data: {
    nombre: string
    correo: string
    foto_perfil: ImageType
  }): Promise<PartialUserInfoType> {
    const user = await executeSingleResultQuery(
      pool,
      () => pool.query(`SELECT * FROM users WHERE correo = $1;`, [data.correo]),
      'Error getting user'
    )
    if (!user) {
      // Google sign-up flow
      const newUser = userObject(data, true) // Ensure `userObject` sanitizes and structures the input
      newUser.login = 'Facebook' // Mark this as a Google user
      // userObject() elimina el correo y la contraseña (que no hay)
      newUser.correo = data.correo
      // La validación es por defecto true si se hace este método
      newUser.validated = true
      await executeQuery(
        pool,
        () =>
          pool.query(
            `INSERT INTO users (${this.getEssencialFields().join(
              ', '
            )}) VALUES (${this.getEssencialFields()
              .map((_, i) => `$${i + 1}`)
              .join(', ')}) RETURNING *;`,
            Object.values(newUser)
          ),
        'Error creating user'
      )
      return userObject(newUser, false)
    }
    return userObject(user, false)
  }

  static async getUserByEmail (correo: string): Promise<Partial<UserInfoType>> {
    const user = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          `SELECT ${this.getEssencialFields().join(
            ', '
          )} FROM users WHERE correo = $1;`,
          [correo]
        ),
      'Error getting user'
    )

    if (!user) {
      throw new Error('El correo no existe')
    }

    return user
  }

  static async createUser (data: {
    nombre: string
    correo: string
    contraseña: string
  }): Promise<UserInfoType> {
    // Crear valores por defecto
    const newUser = userObject(data, true) as UserInfoType // Ensure `userObject` sanitizes and structures the input
    newUser.contraseña = await bcrypt.hash(newUser.contraseña, SALT_ROUNDS)
    await executeQuery(
      pool,
      () =>
        pool.query(
          `INSERT INTO users (id, nombre, rol, foto_perfil, correo, direccion_envio, libros_ids, estado_cuenta,
          fecha_registro, actualizado_en, bio, favoritos, conversations_ids, notifications_ids, validated, login,
          ubicacion, seguidores, siguiendo, collections_ids, preferencias, historial_busquedas, balance, compras_ids, contraseña)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
          $17, $18, $19, $20, $21, $22, $23, $24, $25);`,
          [
            newUser.id,
            newUser.nombre,
            newUser.rol,
            newUser.foto_perfil,
            newUser.correo,
            newUser.direccion_envio,
            newUser.libros_ids,
            newUser.estado_cuenta,
            newUser.fecha_registro,
            newUser.actualizado_en,
            newUser.bio,
            newUser.favoritos,
            newUser.conversations_ids,
            newUser.notifications_ids,
            newUser.validated,
            newUser.login,
            newUser.ubicacion,
            newUser.seguidores,
            newUser.siguiendo,
            newUser.collections_ids,
            newUser.preferencias,
            newUser.historial_busquedas,
            JSON.stringify(newUser.balance),
            newUser.compras_ids,
            newUser.contraseña
          ]
        ),
      'Error creating user'
    )
    return newUser
  }

  static async updateUser (
    id: ID,
    data: Partial<UserInfoType>
  ): Promise<PartialUserInfoType> {
    try {
      data.actualizado_en = new Date().toISOString() as ISOString
      const keys = Object.keys(data)
      const values = Object.values(data)
      
      let updateString = ''
      for (const i of keys) {
        updateString += `${i} = $${keys.indexOf(i) + 1}, `
      }
      updateString = updateString.slice(0, -2) // Remove last comma and space


      const existingUser = await this.getEmailById(id)
      if (existingUser.correo === data.correo) {
        throw new Error('El correo ya está en uso')
      }
      if (data.contraseña) {
        data.contraseña = await bcrypt.hash(data.contraseña, SALT_ROUNDS)
      }
      const result = await executeSingleResultQuery(
        pool,
        () =>
          pool.query(
            `UPDATE users SET ${updateString} WHERE id = $${keys.length + 1} 
            RETURNING ${this.getEssencialFields().join(', ')};`,
            [...values, id]
          ),
        `Failed to update user with ID ${id}`
      )

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(`Error updating book with ID ${id}`, error)
    }
  }

  static async deleteUser (id: ID): Promise<{ message: string }> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new Error('Usuario no encontrado')
    }
    await executeQuery(
      pool,
      () => pool.query('DELETE FROM users WHERE id = $1;', [id]),
      'Error deleting user'
    )
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
  static async banUser(value: ID): Promise<{ message: string }> {
    const user = await this.getUserById(value);
    const userEmail = await this.getUserByEmail(value);
    if (!user && !userEmail) {
      throw new Error('Usuario no encontrado');
    }
  
    const client = await pool.connect();
    try {
      // Start a transaction
      await client.query('BEGIN');
  
      // Update the user's account status
      await client.query(
        `UPDATE users SET estado_cuenta='Suspendido' WHERE correo = $1 OR nombre = $1;`,
        [value]
      );
  
      // Delete related books
      await client.query(
        `DELETE FROM books WHERE id_vendedor IN (SELECT id FROM users WHERE correo = $1);`,
        [value]
      );
  
      // Delete related notifications
      await client.query(
        `DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE correo = $1);`,
        [value]
      );
  
      // Commit the transaction
      await client.query('COMMIT');
  
      return { message: 'Usuario suspendido y datos relacionados eliminados con éxito' };
  
    } catch (error) {
      // If any error occurs, rollback the transaction

      await client.query('ROLLBACK');
      if (error instanceof Error) {
        console.error('Error al suspender el usuario:', error);
        throw new Error('Error al suspender el usuario');
      }
      return { message: 'Error al suspender el usuario' };
    } finally {
      // Release the client
      client.release();
    }
  }
  
}

export { UsersModel }
