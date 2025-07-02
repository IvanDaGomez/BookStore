import { CorsOptions } from 'cors'
import { PORT } from './config.js'

const whitelist: string[] = [
  `http://localhost:${PORT}`,
  `https://localhost:${PORT}`,
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:5173',
  'localhost:5173',
  'https://www.googleapis.com/auth/gmail.send',
  'https://cbbc-2800-e2-7280-24a-446c-a467-dc81-f31d.ngrok-free.app',
  'http://cbbc-2800-e2-7280-24a-446c-a467-dc81-f31d.ngrok-free.app',
  'http://bookstore-frontend-ivan.s3-website-sa-east-1.amazonaws.com/',
  'https://bookstore-frontend-ivan.s3-website-sa-east-1.amazonaws.com/',
  'https://api.meridianlib.com',
  'https://meridianlib.com',
  'https://www.meridianlib.com'
]

export const corsOptions: CorsOptions = {
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
