export const collectionObject = (data) => {
  return {
    _id: data._id || '',
    foto: data.foto || '',
    librosIds: data.librosIds || [],
    nombre: data.nombre || '',
    descripcion: data.descripcion || '',
    seguidores: data.seguidores || [],
    userId: data.userId || '',
    saga: data.saga || false

  }
}
