import fs from 'node:fs/promises'
import { ID } from '../../../types/objects'
import { executeQuery, executeSingleResultQuery } from '../../../utils/dbUtils.js'
import { pool } from '../../../assets/config.js'



class EmailsModel {
  static async getAllEmails (): Promise<string[]> {
    const data = await executeQuery(
      pool,
      () => pool.query('SELECT email FROM emails;'),
      'Error getting emails'
    )
    return data
  }

  static async getEmailById (id: ID): Promise<string>{
    const email = await executeSingleResultQuery(
      pool,
      () => pool.query('SELECT email FROM emails WHERE id = $1;', [id]),
      'Email not found'
    )
    return email
  }

  static async createEmail (data: { email: string }): Promise<{ email: string }> {
    const email = await executeSingleResultQuery(
      pool,
      () => pool.query('INSERT INTO emails (email) VALUES ($1) RETURNING email;', [data.email]),
      'Error creating email'
    )
    return data
  }

  static async deleteEmail (emailGiven: string): Promise<{ message: string }> {
    await executeQuery(
      pool,
      () => pool.query('DELETE FROM emails WHERE email = $1;', [emailGiven]),
      'Error deleting email'
    )
    return { message: 'Correo eliminado correctamente' }
  }

}
export { EmailsModel }
