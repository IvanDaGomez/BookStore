import { RequestHandler, Router } from 'express'
import { UsersController } from '../../controllers/users/usersController.js'
import { upload } from '../../assets/config.js'
import { IBooksModel, ITransactionsModel, IUsersModel } from '../../types/models.js'

export const createUsersRouter = ({
  UsersModel,
  TransactionsModel,
  BooksModel
}: {
  UsersModel: IUsersModel
  TransactionsModel: ITransactionsModel
  BooksModel: IBooksModel
}) => {
  const usersController = new UsersController({ UsersModel, TransactionsModel, BooksModel })
  const usersRouter = Router()

  usersRouter.get('/', usersController.getAllUsersSafe as RequestHandler) // R
  usersRouter.post('/', usersController.createUser as RequestHandler) // C
  // usersRouter.get('/safe', usersController.getAllUsersSafe) // R

  usersRouter.post('/login', usersController.login as RequestHandler)
  usersRouter.post(
    '/google-login',
    usersController.googleLogin as RequestHandler
  )
  usersRouter.post(
    '/facebook-login',
    usersController.facebookLogin as RequestHandler
  )
  usersRouter.post('/logout', usersController.logout as RequestHandler)
  usersRouter.post('/userSession', usersController.userData as RequestHandler)

  usersRouter.post(
    '/changePasswordEmail',
    usersController.sendChangePasswordEmail as RequestHandler
  )
  usersRouter.post(
    '/changePassword',
    usersController.changePassword as RequestHandler
  )

  usersRouter.use(
    '/mercadoPagoWebHooks',
    usersController.MercadoPagoWebhooks as RequestHandler
  )

  usersRouter.get('/query', usersController.getUserByQuery as RequestHandler)

  usersRouter.post(
    '/newCollection',
    usersController.createCollection as RequestHandler
  )
  usersRouter.post(
    '/addToCollection',
    usersController.addToCollection as RequestHandler
  )

  usersRouter.post('/follow', usersController.followUser as RequestHandler)

  usersRouter.post(
    '/process_payment',
    usersController.processPayment as RequestHandler
  )
  usersRouter.post(
    '/pay-with-balance',
    usersController.payWithBalance as RequestHandler
  )
  usersRouter.post(
    '/getPreferenceId',
    usersController.getPreferenceId as RequestHandler
  )
  usersRouter.post(
    '/sendValidationEmail',
    usersController.sendValidationEmail as RequestHandler
  )
  usersRouter.get(
    '/validateUser/:token',
    usersController.userValidation as RequestHandler
  )

  usersRouter.get(
    '/balance/:userId',
    usersController.getBalance as RequestHandler
  )
  usersRouter.get('/c/:userId', usersController.getEmailById as RequestHandler) // R
  usersRouter.get(
    '/:userId/photoAndName',
    usersController.getPhotoAndNameUser as RequestHandler
  ) // R
  usersRouter.get('/:userId', usersController.getUserById as RequestHandler) // R
  usersRouter.patch('/favorites/:userId', usersController.updateFavorites as RequestHandler) // U
  usersRouter.patch(
    '/:userId',
    upload.single('images'),
    usersController.updateUser as RequestHandler
  ) // U
  usersRouter.delete('/:userId', usersController.deleteUser as RequestHandler)

  return usersRouter
}
