import { ID, ImageType, ISOString } from "../../types/objects"
import { EstadoCuentaType, RoleType } from "../../types/userCategories"

type CollectionItem = {
  nombre: string;           // Name of the collection
  librosIds: ID[];     // Array of book IDs
}
// Pendiente
type partialUserInfoType = {
  _id: ID
  nombre: string
  rol: RoleType
  fotoPerfil: ImageType | ''
  librosIds: ID[]
  estadoCuenta: EstadoCuentaType
  fechaRegistro: ISOString
  actualizadoEn: ISOString
  bio: string
  favoritos: ID[]
  conversationsIds: ID[]
  notificationsIds: ID[]
  validated: boolean
  login: string
  ubicacion: {
    calle: string
    ciudad: string
    pais: string
    codigoPostal: string
  }
  seguidores: ID[]
  siguiendo: ID[]
  colecciones?: CollectionItem[]
  // coleccionsIds: [] Pendiente
  // colecciones: [] Pendiente
  coleccionsIds?: ID[]
  preferencias: {
    [key: string]: number
  }
  historialBusquedas: {
    [key: string]: number
  }
  balance?: {
    pendiente?: number
    disponible?: number
    porLlegar?: number
  }
}

export function userObject(name: partialUserInfoType, fullInfo = false): partialUserInfoType {
  return {
    _id: name._id,
    nombre: name.nombre,
    rol: name.rol || 'usuario',
    fotoPerfil: name.fotoPerfil, // Example of public info
    librosIds: name.librosIds,
    estadoCuenta: name.estadoCuenta || 'Activo',
    fechaRegistro: name.fechaRegistro,
    actualizadoEn: name.actualizadoEn,
    bio: name.bio || '',
    favoritos: name.favoritos || [],
    conversationsIds: name.conversationsIds || [],
    notificationsIds: name.notificationsIds || [],
    validated: name.validated || false,
    login: name.login || 'default',
    ubicacion: name.ubicacion || {},
    seguidores: name.seguidores || [],
    siguiendo: name.siguiendo || [],
    // Esto esta mal
    // coleccionsIds: name.colecciones || [],
    preferencias: name.preferencias || {},
    historialBusquedas: name.historialBusquedas || {},
    balance: name.balance || {
      pendiente: 0,
      disponible: 0,
      porLlegar: 0
    }
    // Avoid exposing sensitive fields like password, email, etc.
  }
}
