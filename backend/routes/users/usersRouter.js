import { Router } from 'express'
import { UsersController } from '../../controllers/users/usersController.js'

const usersRouter = Router()

usersRouter.get('/', UsersController.getAllUsersSafe) // R
// usersRouter.get('/safe', UsersController.getAllUsersSafe) // R
usersRouter.post('/', UsersController.createUser) // C
usersRouter.post('/login', UsersController.login)
usersRouter.post('/logout', UsersController.logout)
usersRouter.post('/userSession', UsersController.userData)
usersRouter.get('/query', UsersController.getUserByQuery)
usersRouter.get('/:userId', UsersController.getUserById) // R
usersRouter.patch('/:userId', UsersController.updateUser) // U
usersRouter.delete('/:userId', UsersController.deleteUser)

export { usersRouter }
