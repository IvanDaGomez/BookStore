import fs from 'node:fs/promises'

const EMAILS_FILE_PATH = './models/emails.json'

class EmailsModel {
  static async getAllEmails () {
    try {
      const data = await fs.readFile(EMAILS_FILE_PATH, 'utf-8')
      if (data.length === 0) {
        return []
      }
      return JSON.parse(data)
    } catch (err) {
      console.error('Error reading emails:', err)
      throw new Error('Error loading emails data')
    }
  }

  static async getEmailById (id) {
    try {
      const emails = await this.getAllEmails()
      const email = emails.find(email => email._id === id)
      return email || null
    } catch (err) {
      console.error('Error retrieving email by ID:', err)
      throw new Error(`Error retrieving email by ID: ${err.message}`)
    }
  }

  static async createEmail (data) {
    try {
      if (!data.email) {
        throw new Error('Invalid data: Missing email')
      }

      const emails = await this.getAllEmails()
      if (emails.some(email => email === data.email)) {
        return null
      }

      emails.push(data.email)
      await fs.writeFile(EMAILS_FILE_PATH, JSON.stringify(emails, null, 2))
      return data
    } catch (err) {
      console.error('Error creating email:', err)
      throw new Error('Error creating email')
    }
  }

  static async deleteEmail (id) {
    try {
      const emails = await this.getAllEmails()
      const emailIndex = emails.findIndex(email => email._id === id)
      if (emailIndex === -1) {
        return null
      }

      emails.splice(emailIndex, 1)
      await fs.writeFile(EMAILS_FILE_PATH, JSON.stringify(emails, null, 2))
      return { message: 'Email deleted successfully' }
    } catch (err) {
      console.error('Error deleting email:', err)
      throw new Error('Error deleting email')
    }
  }

  static async updateEmail (id, data) {
    try {
      const emails = await this.getAllEmails()
      const emailIndex = emails.findIndex(email => email._id === id)
      if (emailIndex === -1) {
        return null
      }

      Object.assign(emails[emailIndex], data)
      await fs.writeFile(EMAILS_FILE_PATH, JSON.stringify(emails, null, 2))
      return true
    } catch (err) {
      console.error('Error updating email:', err)
      throw new Error(`Error updating email: ${err.message}`)
    }
  }
}
export { EmailsModel }
