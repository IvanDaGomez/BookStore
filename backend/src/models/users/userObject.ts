import { ISOString } from '../../types/objects'
import { PartialUserInfoType, UserInfoType } from '../../types/user'

function userObject(
  name: UserInfoType | Partial<UserInfoType>,
  fullInfo: false
): PartialUserInfoType
function userObject(
  name: UserInfoType | Partial<UserInfoType>,
  fullInfo: true
): UserInfoType

function userObject (
  name: UserInfoType | Partial<UserInfoType>,
  fullInfo = false
): UserInfoType | PartialUserInfoType {
  if (fullInfo) {
    const fullAnswer: UserInfoType = {
      id: name.id ?? crypto.randomUUID(),
      nombre: name.nombre ?? '',
      correo: name.correo ?? '',
      contraseña: name.contraseña ?? '',
      rol: name.rol ?? 'usuario',
      foto_perfil: name.foto_perfil ?? '',
      libros_ids: name.libros_ids ?? [],
      estado_cuenta: name.estado_cuenta ?? 'Activo',
      fecha_registro:
        name.fecha_registro ?? (new Date().toISOString() as ISOString),
      actualizado_en:
        name.actualizado_en ?? (new Date().toISOString() as ISOString),
      bio: name.bio ?? '',
      favoritos: name.favoritos ?? [],
      conversations_ids: name.conversations_ids ?? [],
      notifications_ids: name.notifications_ids ?? [],
      validated: name.validated ?? false,
      login: name.login ?? 'Default',
      ubicacion: name.ubicacion ?? {
        calle: '',
        ciudad: '',
        pais: '',
        codigo_postal: ''
      },
      seguidores: name.seguidores ?? [],
      siguiendo: name.siguiendo ?? [],
      collections_ids: name.collections_ids ?? [],
      preferencias: name.preferencias ?? {},
      historial_busquedas: name.historial_busquedas ?? {},
      balance: {
        pendiente: name.balance?.pendiente ?? 0,
        disponible: name.balance?.disponible ?? 0,
        por_llegar: name.balance?.por_llegar ?? 0
      },
      compras_ids: name.compras_ids ?? []
    }
    return fullAnswer
  } else {
    const partialAnswer: PartialUserInfoType = {
      id: name.id ?? crypto.randomUUID(),
      nombre: name.nombre ?? '',
      rol: name.rol ?? 'usuario',
      foto_perfil: name.foto_perfil ?? '',
      libros_ids: name.libros_ids ?? [],
      estado_cuenta: name.estado_cuenta ?? 'Activo',
      fecha_registro:
        name.fecha_registro ?? (new Date().toISOString() as ISOString),
      actualizado_en:
        name.actualizado_en ?? (new Date().toISOString() as ISOString),
      bio: name.bio ?? '',
      favoritos: name.favoritos ?? [],
      conversations_ids: name.conversations_ids ?? [],
      notifications_ids: name.notifications_ids ?? [],
      validated: name.validated ?? false,
      login: name.login ?? 'Default',
      ubicacion: name.ubicacion ?? {
        calle: '',
        ciudad: '',
        pais: '',
        codigo_postal: ''
      },
      seguidores: name.seguidores ?? [],
      siguiendo: name.siguiendo ?? [],
      collections_ids: name.collections_ids ?? [],
      preferencias: name.preferencias ?? {},
      historial_busquedas: name.historial_busquedas ?? {},
      balance: {
        pendiente: name.balance?.pendiente ?? 0,
        disponible: name.balance?.disponible ?? 0,
        por_llegar: name.balance?.por_llegar ?? 0
      },
      compras_ids: name.compras_ids ?? []
    }
    return partialAnswer
  }
}

export { userObject }
