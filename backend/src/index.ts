import express, { NextFunction } from 'express'
import cors from 'cors'
import { createUsersRouter } from './routes/users/usersRouter.js'
import { createBooksRouter } from './routes/books/booksRouter.js'
import { createMessagesRouter } from './routes/messages/messagesRouter.js'
import { createConversationsRouter } from './routes/conversations/conversationsRouter.js'
import { createNotificationsRouter } from './routes/notifications/notificationsRouter.js'
import { createTransactionsRouter } from './routes/transactions/transactionsRouter.js'
import { createEmailsRouter } from './routes/email/emailRouter.js'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { createCollectionsRouter } from './routes/collections/collectionsRouter.js'
import { jwtMiddleware } from './middlewares/jwtMiddleware.js'
import swaggerUI from 'swagger-ui-express'
import { handleStats } from './middlewares/handleStats.js'
import fs from 'fs/promises'
dotenv.config()
// import { handleStats } from './assets/handleStats.js'
export const createApp = async ({
  BooksModel,
  UsersModel,
  MessagesModel,
  CollectionsModel,
  ConversationsModel,
  NotificationsModel,
  TransactionsModel,
  EmailsModel
}: {
  BooksModel: any
  UsersModel: any
  MessagesModel: any
  CollectionsModel: any
  ConversationsModel: any
  NotificationsModel: any
  TransactionsModel: any
  EmailsModel: any
}) => {
  // Configuración de la aplicación Express
  const app: express.Application = express()
  // Puerto
  const PORT: number = parseInt(process.env.PORT ?? '3030', 10)
  // Lista de orígenes permitidos
  const whitelist: string[] = [
    `http://localhost:${PORT}`,
    `https://localhost:${PORT}`,
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:5173',
    'localhost:5173',
    'https://www.googleapis.com/auth/gmail.send',
    'https://cbbc-2800-e2-7280-24a-446c-a467-dc81-f31d.ngrok-free.app',
    'http://cbbc-2800-e2-7280-24a-446c-a467-dc81-f31d.ngrok-free.app'
  ]

  const corsOptions: cors.CorsOptions = {
    origin: function (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void
    ): void {
      // Permitir solicitudes con 'undefined' origin (como las de Postman)
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true // Habilitar el envío de credenciales (cookies)
  }

  // Habilitar CORS con las opciones definidas
  app.use(cors(corsOptions)) /* corsOptions */
  // Habilitar el manejo de cookies
  app.use(cookieParser())
  // Middleware para manejar las cookies y el token JWT
  app.use(jwtMiddleware)
  // Middleware para trackear las solicitudes
  app.use(handleStats)
  // habilitar req.body
  app.use(express.urlencoded({ extended: true }))
  // Habilitar respuestas solo en json
  app.use(express.json())
  const swaggerDoc = await fs.readFile('./dist/data/swagger.json', 'utf-8').then(data => JSON.parse(data))
  app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
  // Estadísticas
  // app.use((req, res, next) => handleStats(req, res, next))

  // Archivos estáticos para uploads y optimized
  app.use('/uploads', express.static('uploads'))
  app.use('/optimized', express.static('optimized'))

  const models = {
    BooksModel,
    UsersModel,
    MessagesModel,
    CollectionsModel,
    ConversationsModel,
    NotificationsModel,
    TransactionsModel,
    EmailsModel
  }
  app.use('/api/users', createUsersRouter(models))
  app.use('/api/books', createBooksRouter(models))
  app.use('/api/messages', createMessagesRouter(models))
  app.use('/api/conversations', createConversationsRouter(models))
  app.use('/api/notifications', createNotificationsRouter(models))
  app.use('/api/collections', createCollectionsRouter(models))
  app.use('/api/emails', createEmailsRouter(models))
  app.use('/api/transactions', createTransactionsRouter(models))

  // Middleware para manejar errores
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack)
      res.status(500).json({
        error:
          process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message
      })
      next()
    }
  )
  app.listen(PORT, () => {
    console.log('Server is listening on http://localhost:' + PORT)
  })
}
