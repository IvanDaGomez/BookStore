import express from 'express'
import cors from 'cors'
import { usersRouter } from './routes/users/usersRouter.js'

const app = express()

const PORT = process.env.PORT ?? 3030

const whitelist = [`http://localhost:${PORT}`, `https://localhost:${PORT}`, 'https://localhost:3000', 'http://localhost:3000']
const corsOptions = {
  origin: function (origin, callback) {
    // Permite solicitudes con 'undefined' origin (como las de Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

// Habilitar CORS con las opciones definidas
app.use(cors(corsOptions))
// habilitar req.body
app.use(express.urlencoded({ extended: true }))

// Habilitar respuestas solo en json
app.use(express.json())

app.use('/api/users', usersRouter)

// app.use("/api/books", booksRouter)

app.listen(PORT, () => {
  console.log('Server is listening on http://localhost:' + PORT)
})
