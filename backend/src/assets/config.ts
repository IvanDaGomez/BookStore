import multer from 'multer'
import path from 'node:path'
import pkg from 'pg'
const { Pool } = pkg
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const assetsDir = path.dirname(__filename);
const __dirname = path.join(assetsDir, '..', '..')
//dirname is the first subfolder after backend/
const POSTGRESQL_PORT = process.env.POSTGRESQL_PORT
  ? parseInt(process.env.POSTGRESQL_PORT, 10)
  : 5432
const pool = new Pool({
  user: process.env.POSTGRESQL_USERNAME ?? '',
  host: process.env.POSTGRESQL_HOST ?? 'localhost',
  database: process.env.POSTGRESQL_DATABASE ?? '',
  password: process.env.POSTGRESQL_PASSWORD ?? '',
  port: POSTGRESQL_PORT,
  max: 20, // max number of clients in the pool
  idleTimeoutMillis: 30000, // close idle clients after 30 second
  connectionTimeoutMillis: 2000 // return an error after 2 seconds if connection could not be established
})

const SALT_ROUNDS: number = 10 
// Crear el directorio de subida si no existe
// Configurar Multer para guardar en una carpeta 'uploads' y con nombre único
const uploadsPath = path.join(__dirname, '..', '..', 'uploads')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) // Nombre único
  }
})
const PORT: number = parseInt(process.env.PORT ?? '3030', 10)
// Limitar el tamaño del archivo a 5 MB 
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
})
export { SALT_ROUNDS, upload, pool, PORT, __dirname }
