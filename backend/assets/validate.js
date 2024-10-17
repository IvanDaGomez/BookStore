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
const schema = z.object({
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
    codigoPostal: z.string().default('')
  }).default({ // Objeto de dirección predeterminado vacío
    calle: '',
    ciudad: '',
    pais: '',
    codigoPostal: ''
  }),

  fotoPerfil: z.string().url('La foto de perfil debe ser una URL válida').default('https://default-profile.com/default.jpg') // URL por defecto para la foto de perfil
})

function validateUser (data) {
  return schema.safeParse(data)
}
function validatePartialUser (data) {
  return schema.partial().safeParse(data)
}
export { validateUser, validatePartialUser }
