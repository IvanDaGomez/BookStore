import { Router } from 'express'
import { EmailsController } from '../../controllers/emails/emailsController.js'

export const createEmailsRouter = ({ EmailsModel }) => {
  // Crear una instancia del controlador de emails
  const emailsController = new EmailsController({ EmailsModel })
  // Crear el router de emails
  const emailsRouter = Router()

  emailsRouter.get('/', emailsController.getAllEmails) // R
  // emailsRouter.get('/safe', EmailsController.getAllEmailsSafe) // R
  emailsRouter.post('/', emailsController.createEmail) // C
  emailsRouter.get('/:emailId', emailsController.getEmailById) // R
  emailsRouter.delete('/:emailId', emailsController.deleteEmail)

  return emailsRouter
}
