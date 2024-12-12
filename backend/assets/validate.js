import { z } from 'zod'
import { notificationTypes } from './notifications/notificationTypes.js'
// PENDIENTE EL PATCH

const userSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),

  librosIds: z.array(z.string()).default([]), // IDs de los libros con un array vacío por defecto
  balance: z.object({
    pendiente: z.number().optional(),
    disponible: z.number().optional()
  }).optional(),
  correo: z.string()
    .email('El correo electrónico no es válido')
    .transform(email => email.toLowerCase()), // Convierte el correo a minúsculas

  validated: z.boolean().default(false),

  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(20, 'La contraseña debe tener menos de 20 caracteres'),

  rol: z.enum(['usuario', 'admin', 'Vendedor']).default('usuario'), // Rol por defecto como 'usuario'

  estadoCuenta: z.enum(['Activo', 'Inactivo', 'Vacaciones', 'Suspendido']).default('Activo'), // Estado por defecto 'activo'

  direccionEnvio: z.object({
    calle: z.string().default(''),
    ciudad: z.string().default(''),
    pais: z.string().default(''),
    departamento: z.string().default(''),
    codigoPostal: z.string().default('')
  }).default({ // Objeto de dirección predeterminado vacío
    calle: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
    departamento: ''
  }),

  fotoPerfil: z.string().url('La foto de perfil debe ser una URL válida').default('https://default-profile.com/default.jpg'), // URL por defecto para la foto de perfil
  seguidores: z.array(z.string()).default([]),
  siguiendo: z.array(z.string()).default([])
})

function validateUser (data) {
  return userSchema.safeParse(data)
}
function validatePartialUser (data) {
  return userSchema.partial().safeParse(data)
}

const bookSchema = z.object({
  titulo: z.string(), // Validates that 'titulo' is a string
  autor: z.string(), // Validates that 'autor' is a string
  precio: z.number(), // Validates that 'precio' is a number
  oferta: z.number().optional(),
  // Imagenes ya validadas
  keywords: z.array(z.string()).optional(), // Validates that 'keywords' is an array of strings
  descripcion: z.string(), // Validates that 'descripcion' is a string
  estado: z.string(), // Validates that 'estado' is either 'Nuevo' or 'Usado'
  genero: z.string(), // Validates that 'genero' is a string
  vendedor: z.string(), // Validates that 'vendedor' is a string
  idVendedor: z.string(), // Validates that 'idVendedor' is a UUID string
  formato: z.string(),
  edicion: z.string().optional(), // Validates that 'edicion' is a string
  idioma: z.string().optional(), // Validates that 'idioma' is a string
  tapa: z.string().optional(), // Validates that 'tapa' is either 'Dura' or 'Blanda'
  edad: z.string().optional(), // Validates that 'edad' is a string
  fechaPublicacion: z.string(), // Validates that 'fechaPublicacion' is a date string in YYYY-MM-DD format
  actualizadoEn: z.string(),
  disponibilidad: z.enum(['Disponible', 'No Disponible', 'Vendido']).optional(), // Validates that 'disponibilidad' is either 'Disponible' or 'No Disponible'
  mensajes: z.array(z.tuple([z.string(), z.string(), z.string()])).optional(), // Define nested arrays
  mensaje: z.string().optional(),
  tipo: z.string().optional(),
  pregunta: z.string().optional()
})
function validateBook (data) {
  return bookSchema.safeParse(data)
}
function validatePartialBook (data) {
  return bookSchema.partial().safeParse(data)
}

const messageSchema = z.object({
  userId: z.string(),
  conversationId: z.string(),
  message: z.string(),
  read: z.boolean().default(false)
})

function validateMessage (data) {
  console.log(data)
  return messageSchema.safeParse(data)
}
function validatePartialMessage (data) {
  return messageSchema.partial().safeParse(data)
}
const notificationSchema = z.object({
  theme: z.enum(['light', 'dark']).default('light'), // Limits theme to specific options
  type: z.enum(notificationTypes), // Define valid types
  userId: z.string().min(1, 'userId is required'), // Require non-empty string
  title: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(), // Allows optional priority levels
  message: z.string().optional(),
  createdIn: z.string().optional().default(new Date().toISOString()), // Default to current ISO date if not provided
  read: z.boolean().default(false),
  actionUrl: z.string().url().optional(), // Requires valid URL if provided
  expiresAt: z.string().optional().default(new Date().toISOString()), // Default to current ISO date if not provided
  photo: z.string().url().optional() // Requires valid URL if provided

})
function validateNotification (data) {
  return notificationSchema.safeParse(data)
}
function validatePartialNotification (data) {
  return notificationSchema.partial().safeParse(data)
}

const transactionSchema = z.object({
  _id: z.string().uuid(),
  sellerId: z.string().uuid(),
  fee_details: z.array(),
  charges_details: z.array(),

  userId: z.string().uuid({ message: 'El ID del usuario debe ser un UUID válido.' }),
  amount: z.number().positive({ message: 'El monto debe ser un número positivo.' }),
  currency: z.string().length(3, { message: 'La moneda debe ser un código ISO 4217 de 3 caracteres.' }),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled'], {
    message: 'El estado debe ser uno de: pending, completed, failed o cancelled.'
  }),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'pse', 'cash', 'mercado_pago'], {
    message: 'El método de pago debe ser uno de los métodos válidos.'
  }),
  description: z.string().max(255, { message: 'La descripción debe tener como máximo 255 caracteres.' }).optional()
})

function validateTransaction (data) {
  return transactionSchema.safeParse(data)
}
function validatePartialTransaction (data) {
  return transactionSchema.partial().safeParse(data)
}
export {
  validateUser, validatePartialUser,
  validateBook, validatePartialBook,
  validateMessage, validatePartialMessage,
  validateNotification, validatePartialNotification,
  validateTransaction, validatePartialTransaction
}
