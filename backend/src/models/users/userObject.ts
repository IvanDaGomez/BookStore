import { ISOString } from "../../types/objects";
import { PartialUserInfoType, UserInfoType } from "../../types/user"

function userObject(name: UserInfoType | Partial<UserInfoType>, fullInfo: false): PartialUserInfoType;
function userObject(name: UserInfoType | Partial<UserInfoType>, fullInfo: true): UserInfoType;

function userObject(name: UserInfoType | Partial<UserInfoType>, fullInfo = false): UserInfoType | PartialUserInfoType {
  if (fullInfo) {
    const fullAnswer: UserInfoType = {
      _id: name._id ?? crypto.randomUUID(),
      nombre: name.nombre ?? '',
      correo: name.correo ?? '',
      contraseña: name.contraseña ?? '',
      direccionEnvio: name.direccionEnvio ?? [],
      rol: name.rol ?? 'usuario',
      fotoPerfil: name.fotoPerfil ?? '',
      librosIds: name.librosIds ?? [],
      estadoCuenta: name.estadoCuenta ?? 'Activo',
      fechaRegistro: name.fechaRegistro ?? new Date().toISOString() as ISOString,
      actualizadoEn: name.actualizadoEn ?? new Date().toISOString() as ISOString,
      bio: name.bio ?? '',
      favoritos: name.favoritos ?? [],
      conversationsIds: name.conversationsIds ?? [],
      notificationsIds: name.notificationsIds ?? [],
      validated: name.validated ?? false,
      login: name.login ?? 'Default',
      ubicacion: name.ubicacion ?? {
        calle: '',
        ciudad: '',
        pais: '',
        codigoPostal: ''
      },
      seguidores: name.seguidores ?? [],
      siguiendo: name.siguiendo ?? [],
      coleccionsIds: name.coleccionsIds ?? [],
      preferencias: name.preferencias ?? {},
      historialBusquedas: name.historialBusquedas ?? {},
      balance: name.balance ?? {
        pendiente: 0,
        disponible: 0,
        porLlegar: 0
      },
      librosVendidos: name.librosVendidos ?? [],
    };
    return fullAnswer
  } else {
    const partialAnswer: PartialUserInfoType = {
      _id: name._id ?? crypto.randomUUID(),
      nombre: name.nombre ?? '',
      rol: name.rol ?? 'usuario',
      fotoPerfil: name.fotoPerfil ?? '',
      librosIds: name.librosIds ?? [],
      estadoCuenta: name.estadoCuenta ?? 'Activo',
      fechaRegistro: name.fechaRegistro ?? new Date().toISOString() as ISOString,
      actualizadoEn: name.actualizadoEn ?? new Date().toISOString() as ISOString,
      bio: name.bio ?? '',
      favoritos: name.favoritos ?? [],
      conversationsIds: name.conversationsIds ?? [],
      notificationsIds: name.notificationsIds ?? [],
      validated: name.validated ?? false,
      login: name.login ?? 'Default',
      ubicacion: name.ubicacion ?? {
        calle: '',
        ciudad: '',
        pais: '',
        codigoPostal: ''
      },
      seguidores: name.seguidores ?? [],
      siguiendo: name.siguiendo ?? [],
      coleccionsIds: name.coleccionsIds ?? [],
      preferencias: name.preferencias ?? {},
      historialBusquedas: name.historialBusquedas ?? {},
      balance: name.balance ?? {
        pendiente: 0,
        disponible: 0,
        porLlegar: 0
      }
    };
    return partialAnswer;
  }
}

export { userObject };