export function userObject(name, fullInfo = false) {
    if (fullInfo) {
        const fullAnswer = {
            _id: name._id ?? crypto.randomUUID(),
            nombre: name.nombre ?? '',
            correo: name.correo ?? '',
            contraseña: name.contraseña ?? '',
            direccionEnvio: name.direccionEnvio ?? [],
            rol: name.rol ?? 'usuario',
            fotoPerfil: name.fotoPerfil ?? '',
            librosIds: name.librosIds ?? [],
            estadoCuenta: name.estadoCuenta ?? 'Activo',
            fechaRegistro: name.fechaRegistro ?? '',
            actualizadoEn: name.actualizadoEn ?? '',
            bio: name.bio ?? '',
            favoritos: name.favoritos ?? [],
            conversationsIds: name.conversationsIds ?? [],
            notificationsIds: name.notificationsIds ?? [],
            validated: name.validated ?? false,
            login: name.login ?? 'default',
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
        return fullAnswer;
    }
    else {
        const partialAnswer = {
            _id: name._id ?? crypto.randomUUID(),
            nombre: name.nombre ?? '',
            rol: name.rol ?? 'usuario',
            fotoPerfil: name.fotoPerfil ?? '',
            librosIds: name.librosIds ?? [],
            estadoCuenta: name.estadoCuenta ?? 'Activo',
            fechaRegistro: name.fechaRegistro ?? '',
            actualizadoEn: name.actualizadoEn ?? '',
            bio: name.bio ?? '',
            favoritos: name.favoritos ?? [],
            conversationsIds: name.conversationsIds ?? [],
            notificationsIds: name.notificationsIds ?? [],
            validated: name.validated ?? false,
            login: name.login ?? 'default',
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
