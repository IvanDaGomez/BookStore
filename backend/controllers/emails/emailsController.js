import { EmailsModel } from '../../models/emails/emailsModel.js'

export class EmailsController {
  static async getAllEmails (req, res) {
    try {
      const emails = await EmailsModel.getAllEmails()
      res.json(emails)
    } catch (error) {
      console.error('Error al obtener las notificaciones:', error)
      res.status(500).json({ error: 'Error de servidor al obtener las notificaciones' })
    }
  }

  static async getEmailById (req, res) {
    try {
      const { emailId } = req.params
      if (!emailId) {
        return res.status(400).json({ error: 'ID de notificación requerido' })
      }

      const email = await EmailsModel.getEmailById(emailId)
      if (!email) {
        return res.status(404).json({ error: 'Notificación no encontrada' })
      }

      res.json(email)
    } catch (error) {
      console.error('Error al obtener la notificación:', error)
      res.status(500).json({ error: 'Error de servidor al obtener la notificación' })
    }
  }

  static async createEmail (req, res) {
    try {
      const data = req.body

      if (!data.email) {
        return res.status(400).json({ error: 'Datos inválidos: Se requiere email' })
      }

      const email = await EmailsModel.createEmail(data)
      if (!email) {
        return res.status(400).json({ error: 'Este correo ya fue ingresado' })
      }

      res.status(201).json(email)
    } catch (error) {
      console.error('Error al crear la notificación:', error)
      res.status(500).json({ error: 'Error de servidor al crear la notificación' })
    }
  }

  static async deleteEmail (req, res) {
    try {
      const { emailId } = req.params
      if (!emailId) {
        return res.status(400).json({ error: 'ID de notificación requerido' })
      }

      const result = await EmailsModel.deleteEmail(emailId)
      if (!result) {
        return res.status(404).json({ error: 'Notificación no encontrada' })
      }

      res.status(200).json({ message: 'Notificación eliminada con éxito' })
    } catch (error) {
      console.error('Error al eliminar la notificación:', error)
      res.status(500).json({ error: 'Error de servidor al eliminar la notificación' })
    }
  }
}
