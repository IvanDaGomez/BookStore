import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users/usersRouter.js'
import { booksRouter } from './routes/books/booksRouter.js'
import { messagesRouter } from './routes/messages/messagesRouter.js'
import { conversationsRouter } from './routes/conversations/conversationsRouter.js'
import { notificationsRouter } from './routes/notifications/notificationsRouter.js'
import { transactionsRouter } from './routes/transactions/transactionsRouter.js'
import { emailsRouter } from './routes/email/emailRouter.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { collectionsRouter } from './routes/collections/collectionsRouter.js'
dotenv.config()
// import { handleStats } from './assets/handleStats.js'
const app = express()

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

app.use(cookieParser())
app.use((req, res, next) => {
  // eslint-disable-next-line dot-notation
  const token = req.cookies.access_token
  // Only reset req.session.user if it doesn't already exist
  if (!req.session) req.session = { user: null }

  try {
    const info = jwt.verify(token, process.env.JWT_SECRET)

    req.session.user = info // Update session with user info from token
  } catch (error) {
    // Ignore token verification errors (e.g., expired or invalid tokens)
    console.error('Token verification failed:')//, error)
  }

  next()
})

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

app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/conversations', conversationsRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/collections', collectionsRouter)
app.use('/api/emails', emailsRouter)
app.use('/api/transactions', transactionsRouter)
app.listen(PORT, () => {
  console.log('Server is listening on http://localhost:' + PORT)
})
