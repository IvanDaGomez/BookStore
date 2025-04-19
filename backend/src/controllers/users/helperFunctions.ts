import { UsersModel } from '../../models/users/local/usersLocal.js'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { AuthToken } from '../../types/authToken.js'
import express from 'express'
import { PartialUserInfoType, UserInfoType } from '../../types/user.js'
import { ID, ImageType } from '../../types/objects.js'

async function checkEmailExists (email: string) {
  const correo = await UsersModel.getUserByEmail(email)
  if (correo.correo) {
    throw new Error('El correo ya existe')
  }
}
function initializeDataCreateUser (data: UserInfoType) {
  const time = new Date().toISOString()
  data.fechaRegistro = time
  data.actualizadoEn = time
  data.validated = false
  data._id = crypto.randomUUID()
  data.balance = {
    disponible: 0,
    pendiente: 0
  }
  return data
}
async function processUserUpdate (
  data: UserInfoType & { accion?: string },
  userId: ID,
  req: express.Request
) {
  if (req.file) data.fotoPerfil = req.file.filename as ImageType

  if (data.favoritos && data.accion) {
    // TODO
    data.favoritos = await updateUserFavorites(userId, data.accion)
  }

  if (data.correo) {
    await checkEmailExists(data.correo)
    data.validated = false
  }

  return filterAllowedFields(data)
}

async function updateUserFavorites (userId: ID, accion: string): Promise<ID[]> {
  const user = await UsersModel.getUserById(userId)
  if (!user) throw new Error('Usuario no encontrado')

  let updatedFavorites = user.favoritos || []

  if (accion === 'agregar' && !updatedFavorites.includes(userId)) {
    updatedFavorites.push(userId)
  } else if (accion === 'eliminar') {
    updatedFavorites = updatedFavorites.filter(fav => fav !== userId)
  }

  return updatedFavorites
}

function filterAllowedFields (data: UserInfoType) {
  const allowedFields: (keyof UserInfoType)[] = [
    'nombre',
    'correo',
    'direccionEnvio',
    'fotoPerfil',
    'contraseña',
    'bio',
    'favoritos'
  ]
  const filteredData: Partial<UserInfoType> = {}

  allowedFields.forEach(key => {
    if (data[key] !== undefined) filteredData[key] = data[key] as any
  })

  filteredData.actualizadoEn = new Date().toISOString()
  return filteredData as UserInfoType
}

function generateAuthToken (user: PartialUserInfoType | UserInfoType): string {
  try {
    const tokenPayload: AuthToken = {
      _id: user._id,
      nombre: user.nombre
    }
    return jwt.sign(tokenPayload, process.env.JWT_SECRET ?? '', {
      expiresIn: '3h'
    })
  } catch (error) {
    throw new Error('Error generando el token')
  }
}

function setAuthCookie (res: express.Response, token: string) {
  res.clearCookie('access_token').cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 3 // 3 horas
  })
}
function jwtPipeline (
  user: PartialUserInfoType | UserInfoType,
  res: express.Response
) {
  const newToken = generateAuthToken(user)
  if (!newToken) {
    throw new Error('Error generando el token')
  }
  setAuthCookie(res, newToken)
}
export {
  checkEmailExists,
  initializeDataCreateUser,
  processUserUpdate,
  jwtPipeline
}
