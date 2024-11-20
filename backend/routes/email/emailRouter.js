import { Router } from 'express'
import { EmailsController } from '../../controllers/emails/emailsController.js'
const emailsRouter = Router()

emailsRouter.get('/', EmailsController.getAllEmails) // R
// emailsRouter.get('/safe', EmailsController.getAllEmailsSafe) // R
emailsRouter.post('/', EmailsController.createEmail) // C
emailsRouter.get('/:emailId', EmailsController.getEmailById) // R
emailsRouter.delete('/:emailId', EmailsController.deleteEmail)

export { emailsRouter }
