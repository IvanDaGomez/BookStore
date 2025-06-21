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
import fs from 'node:fs'
import path from 'node:path'
import { PORT, __dirname, pool } from './assets/config.js'
import { corsOptions } from './assets/corsOptions.js'
import { statsHandler } from './middlewares/statsHandler.js'
import { Server } from 'http'
import { seeEmailTemplate } from './middlewares/seeEmailTemplate.js'
//import { rateLimitter } from './middlewares/rateLimitter.js'

dotenv.config()
// import { handleStats } from './assets/handleStats.js'
export const createApp = ({
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
}): Server => {
  // Configuración de la aplicación Express
  const app: express.Application = express()

  // Habilitar CORS con las opciones definidas
  app.use(cors(corsOptions)) /* corsOptions */
  // Habilitar el manejo de cookies
  app.use(cookieParser())

  app.use((req: express.Request, res: express.Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(req.method, 'request at:', req.url)
    }
    next()
  })
  // // Middleware para manejar las cookies y el token JWT
  app.use(jwtMiddleware)
  // // Middleware para trackear las solicitudes
  app.use(handleStats)

  //app.use(rateLimitter)
  // // habilitar req.body
  app.use(express.urlencoded({ extended: true }))
  // Habilitar respuestas solo en json
  app.use(express.json())

  // Archivos estáticos para uploads y optimized
  // const uploadsDir = path.join(__dirname, 'uploads')
  // const optimizedDir = path.join(__dirname, 'optimized')
  app.get('/test', (_, res) => {
    res.send('Hello world')
  })
  // Serve static files from AWS S3 using a proxy route
  app.get('/uploads/*', (req, res) => {
    const s3Key = req.path.replace(/^\/uploads\//, '')
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}/uploads/${s3Key}`
    res.redirect(s3Url)
  })

  app.get('/optimized/*', (req, res) => {
    const s3Key = req.path.replace(/^\/optimized\//, '')
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}/optimized/${s3Key}`
    res.redirect(s3Url)
  })

  app.use('/api/books', createBooksRouter({ BooksModel, UsersModel }))
  app.use(
    '/api/users',
    createUsersRouter({ UsersModel, TransactionsModel, BooksModel })
  )
  app.use(
    '/api/messages',
    createMessagesRouter({ MessagesModel, ConversationsModel })
  )
  app.use(
    '/api/conversations',
    createConversationsRouter({ ConversationsModel, UsersModel })
  )
  app.use(
    '/api/notifications',
    createNotificationsRouter({ NotificationsModel, UsersModel })
  )
  app.use(
    '/api/collections',
    createCollectionsRouter({ CollectionsModel, BooksModel })
  )
  app.use('/api/emails', createEmailsRouter({ EmailsModel }))
  app.use(
    '/api/transactions',
    createTransactionsRouter({ TransactionsModel, UsersModel, BooksModel })
  )

  app.get('/api/stats', statsHandler)
  app.get('/api/emailTemplate/:template', seeEmailTemplate)
  const swaggerDoc = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'swagger.json'), 'utf-8')
  )
  app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDoc))
  // // Middleware para manejar errores
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ): void => {
      if (!res.headersSent) {
        res.json({
          error:
            process.env.NODE_ENV === 'production'
              ? 'Internal Server Error'
              : err.message,
          stack: process.env.NODE_ENV === 'production' ? undefined : err.stack // Include stack trace in development
        })
      }
    }
  )
  // if (process.env.NODE_ENV !== 'development') {
  //   // Serve the frontend build files in production
  //   const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'dist');
  //   app.use(express.static(frontendBuildPath));

  //   // Serve the index.html file for all other routes
  //   app.get('*', (req, res) => {
  //     res.sendFile(path.join(frontendBuildPath, 'index.html'));
  //   });
  // }
  // Create HTTP server instance
  const server = app.listen(PORT, () => {
    const url = `${process.env.BACKEND_URL || 'http://localhost'}:${PORT}`
    console.log(`Backend is running at ${url}`)
  })

  return server
}
