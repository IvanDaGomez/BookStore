export function userObject (name) {
  return {
    _id: name._id,
    nombre: name.nombre,
    rol: name.rol || 'usuario',
    fotoPerfil: name.fotoPerfil, // Example of public info
    librosIds: name.librosIds,
    estadoCuenta: name.estadoCuenta || 'Activo',
    fechaRegistro: name.fechaRegistro,
    bio: name.bio || '',
    favoritos: name.favoritos || [],
    conversationsIds: name.conversationsIds || [],
    notificationsIds: name.notificationsIds || [],
    validated: name.validated || false,
    login: name.login || 'default',
    ubicacion: name.ubicacion || {},
    seguidores: name.seguidores || [],
    siguiendo: name.siguiendo || [],
    coleccionsIds: name.colecciones || [],
    preferencias: name.preferencias || {},
    historialBusquedas: name.historialBusquedas || {},
    balance: name.balance || 0
    // Avoid exposing sensitive fields like password, email, etc.
  }
}
