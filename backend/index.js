import express from 'express'
import cors from 'cors'
import { createUsersRouter } from './routes/users/usersRouter.js'
import { createBooksRouter } from './routes/books/booksRouter.js'
import { createMessagesRouter } from './routes/messages/messagesRouter.js'
import { createConversationsRouter } from './routes/conversations/conversationsRouter.js'
import { createNotificationsRouter } from './routes/notifications/notificationsRouter.js'
import { createTransactionsRouter } from './routes/transactions/transactionsRouter.js'
import { createEmailsRouter } from './routes/email/emailRouter.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { createCollectionsRouter } from './routes/collections/collectionsRouter.js'
dotenv.config()
// import { handleStats } from './assets/handleStats.js'
export const createApp = ({ BooksModel, UsersModel, MessagesModel, CollectionsModel, ConversationsModel, NotificationsModel, TransactionsModel, EmailsModel }) => {
  // Configuración de la aplicación Express
  const app = express()
  // Puerto
  const PORT = process.env.PORT ?? 3030
  // Lista de orígenes permitidos
  const whitelist = [
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

  // Configuración de CORS
  const corsOptions = {
    origin: function (origin, callback) {
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
  app.use(cors(corsOptions))/* corsOptions */
  // Habilitar el manejo de cookies
  app.use(cookieParser())
  // Middleware para manejar las cookies y el token JWT
  app.use((req, res, next) => {
    // eslint-disable-next-line dot-notation
    const token = req.cookies.access_token
    // Only reset req.session.user if it doesn't already exist
    if (!req.session) req.session = { user: null }

    try {
      const info = jwt.verify(token, process.env.JWT_SECRET)

      req.session.user = info // Update session with user info from token
    } catch (error) {
      // Do nothing if an error occurs
    }

    next()
  })
  // Middleware para trackear las solicitudes
  app.use((req, res, next) => {
    console.log(`Request URL: ${req.url}, Method: ${req.method}`)
    next()
  })
  // habilitar req.body
  app.use(express.urlencoded({ extended: true }))
  // Habilitar respuestas solo en json
  app.use(express.json())

  // Estadísticas
  // app.use((req, res, next) => handleStats(req, res, next))

  // Archivos para uploads y optimizados
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
  app.listen(PORT, () => {
    console.log('Server is listening on http://localhost:' + PORT)
  })
}
