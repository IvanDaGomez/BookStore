import { UsersModel } from '../../models/users/local/usersLocal.js'
import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { AuthToken } from '../../types/authToken.js'
import express from 'express'
import { PartialUserInfoType, UserInfoType } from '../../types/user.js'
import { ID, ImageType, ISOString } from '../../types/objects.js'
import path from 'node:path'
import { Multer } from 'multer'
import saveOptimizedImages from '../../assets/saveOptimizedImages.js'

async function checkEmailExists (email: string) {
  const correo = await UsersModel.getUserByEmail(email)
  
  if (correo?.correo) {
    throw new Error('El correo ya existe')
  }
}
function initializeDataCreateUser (data: UserInfoType) {
  const time = new Date().toISOString() as ISOString
  data.fecha_registro = time
  data.actualizado_en = time
  data.validated = false
  data.id = crypto.randomUUID()
  data.balance = {
    disponible: 0,
    pendiente: 0
  }
  return data
}
async function processUserUpdate (
  data: Partial<UserInfoType> & { accion?: string },
  userId: ID,
  req: express.Request
) {
  const file: Express.Multer.File | undefined = req.file
  if (req.file) {

    data.foto_perfil = req.file.filename as ImageType
    await saveOptimizedImages([data.foto_perfil])
    
  }

  if (data.correo) {
    await checkEmailExists(data.correo)
    data.validated = false
  }

  return filterAllowedFields(data)
}

async function updateUserFavorites (
  userId: ID,
  bookId: ID,
  accion: string
): Promise<ID[]> {
  const user = await UsersModel.getUserById(userId)
  if (!user) throw new Error('Usuario no encontrado')

  let updatedFavorites = user.favoritos || []

  if (accion === 'agregar' && !updatedFavorites.includes(bookId)) {
    updatedFavorites.push(bookId)
  } else if (accion === 'eliminar') {
    updatedFavorites = updatedFavorites.filter(fav => fav !== bookId)
  }

  return updatedFavorites
}

function filterAllowedFields (
  data: Partial<UserInfoType>
): Partial<UserInfoType> {
  const allowedFields: (keyof UserInfoType)[] = [
    'nombre',
    'correo',
    'direccion_envio',
    'foto_perfil',
    'contraseña',
    'bio',
    'favoritos',
    'estado_cuenta'
  ]
  const filteredData: Partial<UserInfoType> = {}

  allowedFields.forEach(key => {
    if (data[key] !== undefined) filteredData[key] = data[key] as any
  })

  filteredData.actualizado_en = new Date().toISOString() as ISOString
  return filteredData
}

function generateAuthToken (user: PartialUserInfoType | UserInfoType): string {
  try {
    const tokenPayload: AuthToken = {
      id: user.id,
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
  jwtPipeline,
  updateUserFavorites
}
