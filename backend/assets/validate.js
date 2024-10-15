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
  librosIds: z.array(z.string()).optional(), // IDs de los libros, puedes ajustar el tipo si necesitas otro tipo de ID
  correo: z.string()
    .email('El correo electrónico no es válido')
    .transform(email => email.toLowerCase()), // Convierte el correo a minúsculas
  contraseña: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(20, 'La contraseña debe tener menos de 20 caracteres'),
  rol: z.enum(['usuario', 'administrador']), // Asegura que el rol solo sea "usuario" o "administrador"
  estadoCuenta: z.enum(['activo', 'inactivo', 'suspendido']), // Validación para diferentes estados de la cuenta
  direccionEnvio: z.object({
    calle: z.string().min(1, 'La calle es requerida'),
    ciudad: z.string().min(1, 'La ciudad es requerida'),
    pais: z.string().min(1, 'El país es requerido'),
    codigoPostal: z.string().min(5, 'El código postal debe tener al menos 5 caracteres').max(10, 'El código postal debe tener menos de 10 caracteres')
  }).optional(),
  fotoPerfil: z.string().url('La foto de perfil debe ser una URL válida').optional()
})
function validateUser (data) {
  return schema.safeParse(data)
}
function validatePartialUser (data) {
  return schema.partial().safeParse(data)
}
export { validateUser, validatePartialUser }
