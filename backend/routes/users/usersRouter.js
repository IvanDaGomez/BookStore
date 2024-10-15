import { Router } from 'express'
import { UsersController } from '../../controllers/users/usersController.js'

const usersRouter = Router()

usersRouter.get('/', UsersController.getAllUsers) // R
usersRouter.post('/', UsersController.createUser) // C
usersRouter.get('/correo', UsersController.getUserByEmail)
usersRouter.get('/query', UsersController.getUserByQuery)
usersRouter.get('/:userId', UsersController.getUserById) // R
usersRouter.patch('/:userId', UsersController.updateUser) // U
usersRouter.delete('/:userId', UsersController.deleteUser)
export { usersRouter }
