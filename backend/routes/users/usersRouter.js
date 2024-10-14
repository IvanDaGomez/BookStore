import { Router } from 'express'
import { UsersController } from '../../controllers/users/usersController.js'

const usersRouter = Router()

usersRouter.get('/', UsersController.getAllUsers)
usersRouter.post('/', UsersController.createUser)
usersRouter.get('/:userId', UsersController.getUserById)


export { usersRouter }
