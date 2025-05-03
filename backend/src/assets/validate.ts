import { z } from 'zod'
import { ageArr, availabilityArr, coverArr, editionArr, formatsArr, genresArr, languagesArr, statesArr } from '../types/bookCategories.js'
import { estadoCuentaArr, roleArr } from '../types/userCategories.js'
import { notificationTypeArr } from '../types/notificationCategories.js'
// PENDIENTE EL PATCH

const userSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),

  librosIds: z.array(z.string()).default([]),

  balance: z.union([
    z.number(),
    z.object({
      pendiente: z.number().optional(),
      disponible: z.number().optional(),
      porLlegar: z.number().optional()
    })
  ]).optional(),

  correo: z.string()
    .email('El correo electrónico no es válido')
    .transform(email => email.toLowerCase()),

  validated: z.boolean().default(false),

  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(20, 'La contraseña debe tener menos de 20 caracteres'),

  rol: z.enum(roleArr).default('usuario'),

  estadoCuenta: z.enum(estadoCuentaArr).default('Activo'),

  direccionEnvio: z.object({
    calle: z.string().default(''),
    ciudad: z.string().default(''),
    pais: z.string().default(''),
    departamento: z.string().default(''),
    codigoPostal: z.string().default('')
  }).default({
    calle: '',
    ciudad: '',
    pais: '',
    codigoPostal: '',
    departamento: ''
  }),

  fotoPerfil: z.string().url('La foto de perfil debe ser una URL válida').default('https://default-profile.com/default.jpg'),

  seguidores: z.array(z.string()).default([]),
  siguiendo: z.array(z.string()).default([]),
  preferencias: z.any().optional(), // puede ser objeto o array, depende de tu lógica
  fyp: z.array(z.any()).optional(),

  _id: z.any().optional(),
  fechaRegistro: z.string().optional(),
  bio: z.string().optional(),
  favoritos: z.array(z.string()).optional(),
  conversationsIds: z.array(z.string()).optional(),
  notificationsIds: z.array(z.string()).optional(),
  login: z.string().optional(),
  ubicacion: z.any().optional(),
  coleccionsIds: z.array(z.string()).optional(),
  historialBusquedas: z.any().optional()
})

function validateUser (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof userSchema>>, Partial<z.infer<typeof userSchema>>> {
  return userSchema.safeParse(data)
}
function validatePartialUser (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof userSchema>>, Partial<z.infer<typeof userSchema>>> {
  return userSchema.partial().safeParse(data)
}

export const bookSchema = z.object({
  titulo: z.string(),
  autor: z.string(),
  precio: z.number().positive(),
  oferta: z.number().nullable().optional(),
  isbn: z.string().regex(/^\d{13}$/, 'Invalid ISBN format'),
  images: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  _id: z.string().optional(), // Mongo ID validation (consider ObjectId regex if needed)
  descripcion: z.string(),
  estado: z.enum(statesArr),
  genero: z.enum(genresArr),
  formato: z.enum(formatsArr),
  vendedor: z.string(),
  idVendedor: z.string(),
  edicion: z.enum(editionArr).optional(),
  idioma: z.enum(languagesArr).optional(),
  ubicacion: z
    .object({
      ciudad: z.string(),
      departamento: z.string(),
      pais: z.string()
    })
    .optional(),
  tapa: z.enum(coverArr).optional(),
  edad: z.enum(ageArr).optional(),
  fechaPublicacion: z.coerce.date(),
  actualizadoEn: z.coerce.date(),
  disponibilidad: z.enum(availabilityArr).optional(),
  mensajes: z.array(z.tuple([z.string(), z.string(), z.string()])).optional(),
  mensaje: z.string().optional(),
  tipo: z.array(z.string()).optional(),
  pregunta: z.string().optional(),
  librosVendidos: z.number().optional(),
  collectionsIds: z.array(z.string()).optional()
})

function validateBook (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof bookSchema>>, Partial<z.infer<typeof bookSchema>>>  {
  return bookSchema.safeParse(data)
}
function validatePartialBook (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof bookSchema>>, Partial<z.infer<typeof bookSchema>>> {
  return bookSchema.partial().safeParse(data)
}

export const messageSchema = z.object({
  _id: z.string().optional(), // en caso de que lo uses como MongoID u otro identificador
  userId: z.string(),
  conversationId: z.string(),
  message: z.string(),
  createdIn: z.string().optional(), // puede venir del front
  read: z.boolean().default(false)
})

function validateMessage (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof messageSchema>>, Partial<z.infer<typeof messageSchema>>> {
  console.log(data)
  return messageSchema.safeParse(data)
}
function validatePartialMessage (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof messageSchema>>, Partial<z.infer<typeof messageSchema>>> {
  return messageSchema.partial().safeParse(data)
}
const notificationSchema = z.object({
  _id: z.string().optional(),

  theme: z.enum(['light', 'dark']).default('light'),
  type: z.enum(notificationTypeArr),
  userId: z.string().min(1, 'userId is required'),

  title: z.string().optional(),
  priority: z.enum(['low', 'normal', 'high']).optional(),
  message: z.string().optional(),

  createdIn: z.string().optional().default(new Date().toISOString()),
  read: z.boolean().default(false),

  actionUrl: z.string().url().optional(),
  expiresAt: z.string().optional().default(new Date().toISOString()),
  input: z.string().optional(),
  metadata: z.object({
    photo: z.string().optional(),
    bookTitle: z.string().optional(),
    bookId: z.string().optional()
  }).optional()
})
function validateNotification (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof notificationSchema>>, Partial<z.infer<typeof notificationSchema>>> {
  return notificationSchema.safeParse(data)
}
function validatePartialNotification(data: Object): z.SafeParseReturnType<Partial<z.infer<typeof notificationSchema>>, Partial<z.infer<typeof notificationSchema>>> {
  return notificationSchema.partial().safeParse(data)
}
const transactionSchema = z.object({
  _id: z.string().uuid(),
  userId: z.string().uuid(),
  sellerId: z.string().uuid(),
  bookId: z.string().uuid().optional(),

  transactionId: z.string().optional(),
  paymentLink: z.string().url().optional(),

  fee_details: z.array(z.any()), // puedes definir mejor el tipo si sabes su estructura
  charges_details: z.array(z.any()),

  amount: z.number().positive({ message: 'El monto debe ser un número positivo.' }),
  currency: z.string().length(3, { message: 'La moneda debe ser un código ISO 4217 de 3 caracteres.' }),

  status: z.enum(['pending', 'completed', 'failed', 'cancelled']),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'pse', 'cash', 'mercado_pago']),

  installments: z.number().int().positive().optional(),
  card: z.object({}).passthrough().optional(),

  description: z.string().max(255).optional(),

  createdIn: z.string().optional().default(new Date().toISOString()),
  updatedIn: z.string().optional().default(new Date().toISOString())
})
function validateTransaction (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof transactionSchema>>, Partial<z.infer<typeof transactionSchema>>> {
  return transactionSchema.safeParse(data)
}
function validatePartialTransaction(data: Object): z.SafeParseReturnType<Partial<z.infer<typeof transactionSchema>>, Partial<z.infer<typeof transactionSchema>>> {
  return transactionSchema.partial().safeParse(data)
}
const collectionSchema = z.object({
  _id: z.string().uuid().optional(),
  foto: z.string().optional(),
  userId: z.string().uuid({ message: 'Debe ser un UUID válido' }),
  librosIds: z.array(z.string().uuid()).default([]),
  nombre: z.string(),
  descripcion: z.string().max(255).optional(),
  seguidores: z.array(z.string().uuid()).default([]),
  saga: z.boolean().default(false)
})

function validateCollection (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof collectionSchema>>, Partial<z.infer<typeof collectionSchema>>> {
  return collectionSchema.safeParse(data)
}
function validatePartialCollection (data: Object): z.SafeParseReturnType<Partial<z.infer<typeof collectionSchema>>, Partial<z.infer<typeof collectionSchema>>> {
  return collectionSchema.partial().safeParse(data)
}

const conversationSchema = z.object({
  _id: z.string().uuid().optional(),
  users: z.array(z.string().uuid()).min(2), // mínimo 2 usuarios por conversación
  messages: z.array(z.string().uuid()).default([]), // asumiendo que se guardan los IDs de los mensajes
  createdIn: z.string().optional().default(new Date().toISOString()),
  lastMessage: z.record(z.any()).optional() // si querés guardar todo el mensaje completo (objeto libre)
})

function validateConversation(data: Object): z.SafeParseReturnType<Partial<z.infer<typeof conversationSchema>>, Partial<z.infer<typeof conversationSchema>>> {
  return conversationSchema.safeParse(data)
}
function validatePartialConversation(data: Object): z.SafeParseReturnType<Partial<z.infer<typeof conversationSchema>>, Partial<z.infer<typeof conversationSchema>>> {
  return conversationSchema.partial().safeParse(data)
}
export {
  validateUser, validatePartialUser,
  validateBook, validatePartialBook,
  validateMessage, validatePartialMessage,
  validateNotification, validatePartialNotification,
  validateTransaction, validatePartialTransaction,
  validateCollection, validatePartialCollection,
  validateConversation, validatePartialConversation
}
