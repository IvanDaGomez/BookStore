import { Pool } from 'pg'

// Configuración de conexión a PostgreSQL
const pool = new Pool({
  user: 'tu_usuario',
  host: 'tu_host',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432 // Asegúrate de usar el puerto correcto
})
/*

CREATE TABLE emails (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL
);

*/
export class EmailsModel {
  static async getAllEmails () {
    try {
      const result = await pool.query('SELECT * FROM emails')
      return result.rows
    } catch (err) {
      console.error('Error retrieving emails:', err)
      throw new Error('Error loading emails data')
    }
  }

  static async getEmailById (id) {
    try {
      const result = await pool.query('SELECT * FROM emails WHERE id = $1', [id])
      return result.rows[0] || null
    } catch (err) {
      console.error('Error retrieving email by ID:', err)
      throw new Error('Error retrieving email by ID')
    }
  }

  static async createEmail (data) {
    try {
      if (!data.email) {
        throw new Error('Invalid data: Missing email')
      }

      const existingEmail = await pool.query('SELECT * FROM emails WHERE email = $1', [data.email])
      if (existingEmail.rows.length > 0) {
        return null // El email ya existe
      }

      const result = await pool.query(
        'INSERT INTO emails (email) VALUES ($1) RETURNING *',
        [data.email]
      )
      return result.rows[0]
    } catch (err) {
      console.error('Error creating email:', err)
      throw new Error('Error creating email')
    }
  }

  static async deleteEmail (id) {
    try {
      const result = await pool.query('DELETE FROM emails WHERE id = $1 RETURNING *', [id])
      if (result.rowCount === 0) {
        return null // No se encontró el email
      }
      return { message: 'Email deleted successfully' }
    } catch (err) {
      console.error('Error deleting email:', err)
      throw new Error('Error deleting email')
    }
  }

  static async updateEmail (id, data) {
    try {
      if (!data.email) {
        throw new Error('Invalid data: Missing email')
      }

      const result = await pool.query(
        'UPDATE emails SET email = $1 WHERE id = $2 RETURNING *',
        [data.email, id]
      )

      if (result.rowCount === 0) {
        return null // No se encontró el email para actualizar
      }
      return result.rows[0]
    } catch (err) {
      console.error('Error updating email:', err)
      throw new Error('Error updating email')
    }
  }
}
