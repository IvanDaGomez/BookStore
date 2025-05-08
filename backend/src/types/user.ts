import { ID, ImageType, ISOString } from './objects'
import { EstadoCuentaType, RoleType } from './userCategories'

export type CollectionItem = {
  nombre: string // Name of the collection
  librosIds: ID[] // Array of book IDs
}
// Pendiente
export type PartialUserInfoType = {
  id: ID
  nombre: string
  rol: RoleType
  foto_perfil: ImageType
  libros_ids: ID[]
  estado_cuenta: EstadoCuentaType
  fecha_registro: ISOString
  actualizado_en: ISOString
  bio: string
  favoritos: ID[]
  conversations_ids: ID[]
  notifications_ids: ID[]
  validated: boolean
  login: 'Google' | 'Facebook' | 'Default'
  ubicacion: LocationType
  seguidores: ID[]
  siguiendo: ID[]
  collections_ids: CollectionItem[]
  compras_ids: ID[]
  preferencias: {
    [key: string]: number
  }
  historial_busquedas: {
    [key: string]: number
  }
  balance: {
    pendiente: number
    disponible: number
    por_llegar: number
  }
}
type LocationType = {
  calle: string
  ciudad: string
  pais: string
  codigo_postal: string
}
export type UserInfoType = {
  id: ID
  nombre: string
  rol: RoleType
  foto_perfil: ImageType
  correo: string
  contraseña: string
  direccion_envio?: LocationType
  libros_ids: ID[]
  estado_cuenta: EstadoCuentaType
  fecha_registro: ISOString
  actualizado_en: ISOString
  bio: string
  favoritos: ID[]
  conversations_ids: ID[]
  notifications_ids: ID[]
  validated: boolean
  login: 'Google' | 'Facebook' | 'Default'
  ubicacion?: LocationType
  seguidores?: ID[]
  siguiendo?: ID[]
  collections_ids?: CollectionItem[]
  compras_ids: ID[]
  preferencias?: {
    [key: string]: number
  }
  historial_busquedas?: {
    [key: string]: number
  }
  balance?: {
    pendiente?: number
    disponible?: number
    por_llegar?: number
  }
}
