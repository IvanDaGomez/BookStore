// import fs from 'node:fs/promises'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from '../../../assets/config.js'
// import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
import crypto from 'node:crypto'
// import { BooksModel } from '../../books/local/booksLocal.js'
import pkg from 'pg'

function userObject (name) {
  return {
    _id: name._id,
    nombre: name.nombre,
    rol: name.rol || 'usuario',
    fotoPerfil: name.fotoPerfil, // Example of public info
    librosIds: name.librosIds,
    estadoCuenta: name.estadoCuenta || 'Activo',
    fechaRegistro: name.fechaRegistro,
    bio: name.bio || '',
    favoritos: name.favoritos || [],
    conversationsIds: name.conversationsIds || [],
    notificationsIds: name.notificationsIds || [],
    validated: name.validated || false,
    login: name.login || 'default',
    ubicacion: name.ubicacion || {},
    seguidores: name.seguidores || [],
    siguiendo: name.siguiendo || [],
    coleccionsIds: name.colecciones || [],
    preferencias: name.preferencias || {},
    historialBusquedas: name.historialBusquedas || {},
    balance: name.balance || 0
    // Avoid exposing sensitive fields like password, email, etc.
  }
}

const { Pool } = pkg

const pool = new Pool({
  user: process.env.POSTGRESQL_USERNAME,
  host: 'localhost',
  database: 'MeridianSQL',
  password: process.env.POSTGRESQL_PASSWORD,
  port: 5432
})
export class UsersModel {
  static async getAllUsers () {
    const result = await pool.query('SELECT * FROM users')
    return result.rows
  }

  static async getAllUsersSafe () {
    const result = await pool.query('SELECT * FROM users')
    return result.rows.map(userObject)
  }

  static async getUserById (id) {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    if (result.rowCount === 0) return null
    return userObject(result.rows[0])
  }

  static async getPhotoAndNameUser (id) {
    const result = await pool.query(
      'SELECT id, foto_perfil, nombre FROM users WHERE id = $1',
      [id]
    )
    return result.rowCount > 0 ? result.rows[0] : null
  }

  static async getEmailById (id) {
    const result = await pool.query('SELECT correo FROM users WHERE id = $1', [id])
    return result.rowCount > 0 ? result.rows[0] : null
  }

  static async getUserByEmail (correo) {
    const result = await pool.query('SELECT * FROM users WHERE correo = $1', [correo])
    if (result.rowCount === 0) return 'No encontrado'
    return userObject(result.rows[0])
  }

  static async login (correo, contraseña) {
    const result = await pool.query('SELECT * FROM users WHERE correo = $1', [correo])
    const user = result.rows[0]
    if (!user) return 'No encontrado'

    const validated = await bcrypt.compare(contraseña, user.contraseña)
    return validated ? userObject(user) : 'Contraseña no coincide'
  }

  static async createUser (data) {
    const hashedPassword = await bcrypt.hash(data.contraseña, SALT_ROUNDS)
    const id = crypto.randomUUID()
    const values = [
      id,
      data.nombre,
      data.correo,
      hashedPassword,
      data.fotoPerfil || null,
      data.balance || 0,
      true, // validated
      data.login || 'manual'
    ]

    await pool.query(
      `INSERT INTO users (id, nombre, correo, contraseña, foto_perfil, balance, validated, login)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      values
    )

    return userObject({ ...data, id })
  }

  static async updateUser (id, data) {
    const existing = await this.getUserById(id)
    if (!existing) return null

    const updates = []
    const values = []
    let i = 1

    for (const [key, value] of Object.entries(data)) {
      if (key === 'contraseña') {
        updates.push(`contraseña = $${i}`)
        values.push(await bcrypt.hash(value, SALT_ROUNDS))
      } else {
        updates.push(`${key} = $${i}`)
        values.push(value)
      }
      i++
    }
    values.push(id)

    await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${i}`,
      values
    )

    return this.getUserById(id)
  }

  static async deleteUser (id) {
    await pool.query('DELETE FROM users WHERE id = $1', [id])
    return { message: 'User deleted successfully' }
  }

  static async getBalance (id) {
    const result = await pool.query('SELECT balance FROM users WHERE id = $1', [id])
    return result.rowCount > 0 ? result.rows[0].balance : null
  }
}
