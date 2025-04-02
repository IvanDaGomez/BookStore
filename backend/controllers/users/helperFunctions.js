import { UsersModel } from '../../models/users/local/usersLocal.js'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
function validateUserLogin (user, res) {
  if (user === 'No encontrado') {
    return res.status(404).json({ error: 'Usuario no encontrado' })
  }
  if (user === 'Contraseña no coincide') {
    return res.status(404).json({ error: 'La contraseña es incorrecta' })
  }
}
async function checkEmailExists (email, res) {
  const correo = await UsersModel.getUserByEmail(email)
  if (correo.correo) {
    return { status: 400, json: { error: 'El correo ya está en uso' } }
  }
}
async function initializeDataCreateUser (data) {
  const time = new Date()
  data.creadoEn = time
  data.actualizadoEn = time
  data.validated = false
  data._id = crypto.randomUUID()
  data.balance = {
    disponible: 0,
    pendiente: 0
  }
  return data
}
async function processUserUpdate (data, userId, req) {
  if (req.file) data.fotoPerfil = req.file.filename

  if (data.favoritos && data.accion) {
    data.favoritos = await updateUserFavorites(userId, data.favoritos, data.accion)
  }

  if (data.correo) {
    const emailError = await checkEmailExists(data.correo)
    if (emailError) return emailError
    data.validated = false
  }

  return filterAllowedFields(data)
}

async function updateUserFavorites (userId, favoritoId, accion) {
  const user = await UsersModel.getUserById(userId)
  if (!user) throw new Error({ status: 404, message: 'No se encontró el usuario' })

  let updatedFavorites = user.favoritos || []
  favoritoId = String(favoritoId)

  if (accion === 'agregar' && !updatedFavorites.includes(favoritoId)) {
    updatedFavorites.push(favoritoId)
  } else if (accion === 'eliminar') {
    updatedFavorites = updatedFavorites.filter(fav => fav !== favoritoId)
  }

  return updatedFavorites
}

function filterAllowedFields (data) {
  const allowedFields = ['nombre', 'correo', 'direccionEnvio', 'fotoPerfil', 'contraseña', 'bio', 'favoritos']
  const filteredData = {}

  allowedFields.forEach(key => {
    if (data[key] !== undefined) filteredData[key] = data[key]
  })

  filteredData.actualizadoEn = new Date()
  return filteredData
}

function generateAuthToken (user) {
  try {
    const tokenPayload = {
      _id: user._id,
      nombre: user.nombre
    }
    return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '3h' })
  } catch (error) {
    console.error('Error generando token:', error)
    return null
  }
}

function setAuthCookie (res, token) {
  res
    .clearCookie('access_token')
    .cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 3 // 3 horas
    })
}
function jwtPipeline (user, res) {
  const newToken = generateAuthToken(user)
  if (!newToken) {
    throw new Error('Error generando el token')
  }
  setAuthCookie(res, newToken)
}
export {
  validateUserLogin,
  checkEmailExists,
  initializeDataCreateUser,
  processUserUpdate,
  jwtPipeline
}
