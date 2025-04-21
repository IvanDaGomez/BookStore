import fs from 'node:fs/promises'
import { ID } from '../../../types/objects'
import path from 'node:path'
// __dirname is not available in ES modules, so we need to use import.meta.url

const emailPath = path.join('.', 'data', 'emails.json')


class EmailsModel {
  static async getAllEmails (): Promise<string[]> {
    const data = await fs.readFile(emailPath, 'utf-8')
    return data.length > 0 ? JSON.parse(data) as string[] : [];
  }

  static async getEmailById (id: ID): Promise<string>{
    const emails = await this.getAllEmails()
    const email = emails.find(email => email === id)
    if (!email) {
      throw new Error('No se encontró el correo')
    }
    return email
  }

  static async createEmail (data: { email: string }): Promise<{ email: string }> {
    const emails = await this.getAllEmails()
    if (emails.some(email => email === data.email)) {
      throw new Error('Este correo ya fue ingresado')
    }
    emails.push(data.email)
    await fs.writeFile(emailPath, JSON.stringify(emails, null, 2))
    return data
  }

  static async deleteEmail (emailGiven: string): Promise<{ message: string }> {
    const emails = await this.getAllEmails()
    const emailIndex = emails.findIndex(email => email === emailGiven)
    if (emailIndex === -1) {
      throw new Error('Correo no encontrado')
    }
    emails.splice(emailIndex, 1)
    await fs.writeFile(emailPath, JSON.stringify(emails, null, 2))
    return { message: 'Correo eliminado correctamente' }
  }

}
export { EmailsModel }
