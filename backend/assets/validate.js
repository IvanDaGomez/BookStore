import { z } from 'zod'
// PENDIENTE EL PATCH
const schema = z.object({
  username: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  mail: z.string()
    .email('Invalid email address')
    .transform(email => email.toLowerCase()), // Convierte el correo a minúsculas
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must be less than 20 characters')
})
function validateUser (data) {
  return schema.safeParse(data)
}
function validatePartialUser (data) {
  return schema.partial().safeParse(data)
}
export { validateUser, validatePartialUser }
