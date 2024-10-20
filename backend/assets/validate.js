import { z } from 'zod'
// PENDIENTE EL PATCH

/*  {
    "nombre": "Ivan Gomez",
    "librosIds": [],
    "correo": "ivandavidgomezsilva@hotmail.com",
    "contraseña": "Idgs2603",
    "rol": "usuario",
    "estadoCuenta": "activo",
    "direccionEnvio": {
      "calle": "123 Avenida Central",
      "ciudad": "Bucaramanga",
      "pais": "Colombia",
      "codigoPostal": "12345"
    },
    "fotoPerfil": "url/a/la/foto/perfil.jpg",
  } */
const userSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),

  librosIds: z.array(z.string()).default([]), // IDs de los libros con un array vacío por defecto

  correo: z.string()
    .email('El correo electrónico no es válido')
    .transform(email => email.toLowerCase()), // Convierte el correo a minúsculas

  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(20, 'La contraseña debe tener menos de 20 caracteres'),

  rol: z.enum(['usuario', 'administrador']).default('usuario'), // Rol por defecto como 'usuario'

  estadoCuenta: z.enum(['activo', 'inactivo', 'suspendido']).default('activo'), // Estado por defecto 'activo'

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

  fotoPerfil: z.string().url('La foto de perfil debe ser una URL válida').default('https://default-profile.com/default.jpg') // URL por defecto para la foto de perfil
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
  oferta: z.number(),
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
  ubicacion: z.string(), // Validates that 'ubicacion' is a string
  tapa: z.string().optional(), // Validates that 'tapa' is either 'Dura' or 'Blanda'
  edad: z.string().optional(), // Validates that 'edad' is a string
  fechaPublicacion: z.string(), // Validates that 'fechaPublicacion' is a date string in YYYY-MM-DD format
  actualizadoEn: z.string(),
  disponibilidad: z.enum(['Disponible', 'No Disponible']).optional() // Validates that 'disponibilidad' is either 'Disponible' or 'No Disponible'
})
function validateBook (data) {
  console.log(data)
  return bookSchema.safeParse(data)
}
function validatePartialBook (data) {
  return bookSchema.partial().safeParse(data)
}
export { validateUser, validatePartialUser, validateBook, validatePartialBook }
