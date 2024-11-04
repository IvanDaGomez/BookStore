import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users/usersRouter.js'
import { booksRouter } from './routes/books/booksRouter.js'
import { messagesRouter } from './routes/messages/messagesRouter.js'
import { conversationsRouter } from './routes/conversations/conversationsRouter.js'
// import { messagesRouter } from './routes/messages/messagesRouter.js'
import { SECRET_KEY } from './assets/config.js'
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
const app = express()

const PORT = process.env.PORT ?? 3030
// Lista de orígenes permitidos
const whitelist = [
  `http://localhost:${PORT}`,
  `https://localhost:${PORT}`,
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:5173',
  'localhost:5173'
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
app.use(cors(corsOptions))

app.use(cookieParser())
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const info = jwt.verify(token, SECRET_KEY)
    req.session.user = info
  } catch {}
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

// Archivos para uploads y optimizados
app.use('/uploads', express.static('uploads'))
app.use('/optimized', express.static('optimized'))

app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)
app.use('/api/messages', messagesRouter)
app.use('/api/conversations', conversationsRouter)
// app.use('/api/notifications', notificationsRouter)

app.listen(PORT, () => {
  console.log('Server is listening on http://localhost:' + PORT)
})
