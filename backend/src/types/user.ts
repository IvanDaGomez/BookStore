import { ID, ImageType, ISOString } from "./objects";
import { EstadoCuentaType, RoleType } from "./userCategories";

export type CollectionItem = {
  nombre: string;           // Name of the collection
  librosIds: ID[];     // Array of book IDs
}
// Pendiente
export type PartialUserInfoType = {
  _id: ID
  nombre: string
  rol: RoleType
  fotoPerfil: ImageType
  librosIds: ID[]
  estadoCuenta: EstadoCuentaType
  fechaRegistro: ISOString
  actualizadoEn: ISOString
  bio: string
  favoritos: ID[]
  conversationsIds: ID[]
  notificationsIds: ID[]
  validated: boolean
  login: 'Google' | 'Facebook' | 'Default'
  ubicacion: {
    calle: string
    ciudad: string
    pais: string
    codigoPostal: string
  }
  seguidores: ID[]
  siguiendo: ID[],
  coleccionsIds: CollectionItem[],
  // colecciones: [] Pendiente
  preferencias: {
    [key: string]: number
  }
  historialBusquedas: {
    [key: string]: number
  }
  balance: {
    pendiente: number
    disponible: number
    porLlegar: number
  }
}
type LocationType = {
  calle: string
  ciudad: string
  pais: string
  codigoPostal: string
}
export type UserInfoType = {
  _id: ID
  nombre: string
  rol: RoleType
  fotoPerfil: ImageType 
  correo: string
  contraseña: string
  direccionEnvio?: LocationType[]
  librosIds: ID[]
  librosVendidos: ID[]
  estadoCuenta: EstadoCuentaType
  fechaRegistro: ISOString
  actualizadoEn: ISOString
  bio: string
  favoritos: ID[]
  conversationsIds: ID[]
  notificationsIds: ID[]
  validated: boolean
  login: 'Google' | 'Facebook' | 'Default'
  ubicacion?: LocationType
  seguidores?: ID[]
  siguiendo?: ID[],
  coleccionsIds?: CollectionItem[],
  preferencias?: {
    [key: string]: number
  }
  historialBusquedas?: {
    [key: string]: number
  }
  balance?: {
    pendiente?: number
    disponible?: number
    porLlegar?: number
  }
}