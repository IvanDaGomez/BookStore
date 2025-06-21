import multer from 'multer'
import path from 'node:path'
import pkg from 'pg'
import dotenv from 'dotenv'
dotenv.config()
const { Pool } = pkg
import { fileURLToPath } from 'node:url'
import { Payment, MercadoPagoConfig, Preference } from 'mercadopago'
import { S3Client } from '@aws-sdk/client-s3'
import multerS3 from 'multer-s3'
import { getContentTypeByExtension } from './getContentTypeByExtension.js'
const __filename = fileURLToPath(import.meta.url)
const assetsDir = path.dirname(__filename)
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
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? ''
  },
  region: process.env.AWS_REGION ?? 'us-east-1'
})

// Limitar el tamaño del archivo a 5 MB
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
    contentType: (req, file, cb) => {
      cb(null, getContentTypeByExtension(file.originalname))
    },

    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname })
    },
    key: function (req, file, cb) {
      cb(
        null,
        `uploads/${
          Date.now() + '-' + Math.round(Math.random() * 1e9)
        }${path.extname(file.originalname)}`
      ) // Nombre único
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
})

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? ''
})
const PORT: number = parseInt(process.env.PORT ?? '3030', 10)

const preference = new Preference(client)
const payment = new Payment(client)
export { SALT_ROUNDS, upload, pool, s3, PORT, __dirname, payment, preference }
