import { Router } from 'express'
import { UsersController } from '../../controllers/users/usersController.js'
import { upload } from '../../assets/config.js'

const usersRouter = Router()

usersRouter.get('/', UsersController.getAllUsersSafe) // R
usersRouter.post('/', UsersController.createUser) // C
// usersRouter.get('/safe', UsersController.getAllUsersSafe) // R

usersRouter.post('/login', UsersController.login)
usersRouter.post('/google-login', UsersController.googleLogin)
usersRouter.post('/facebook-login', UsersController.facebookLogin)
usersRouter.post('/logout', UsersController.logout)
usersRouter.post('/userSession', UsersController.userData)

usersRouter.post('/changePasswordEmail', UsersController.sendChangePasswordEmail)
usersRouter.post('/changePassword', UsersController.changePassword)

usersRouter.use('/mercadoPagoWebHooks', UsersController.MercadoPagoWebhooks)

usersRouter.get('/query', UsersController.getUserByQuery)

usersRouter.post('/newCollection', UsersController.createColection)
usersRouter.post('/addToCollection', UsersController.addToColection)
usersRouter.post('/getBooksByCollection', UsersController.getBooksByCollection)

usersRouter.post('/follow', UsersController.followUser)

usersRouter.post('/process_payment', UsersController.processPayment)
usersRouter.post('/getPreferenceId', UsersController.getPreferenceId)
usersRouter.post('/sendValidationEmail', UsersController.sendValidationEmail)
usersRouter.get('/validateUser/:token', UsersController.userValidation)

usersRouter.get('/balance/:userId', UsersController.getBalance)
usersRouter.get('/c/:userId', UsersController.getEmailById) // R
usersRouter.get('/:userId/photoAndName', UsersController.getPhotoAndNameUser) // R
usersRouter.get('/:userId', UsersController.getUserById) // R

usersRouter.patch('/:userId', upload.single('images'), UsersController.updateUser) // U
usersRouter.delete('/:userId', UsersController.deleteUser)

export { usersRouter }
