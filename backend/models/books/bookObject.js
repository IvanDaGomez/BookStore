export const bookObject = (data) => {
  return {
    titulo: data.titulo || '',
    autor: data.autor || '',
    precio: data.precio || 0,
    oferta: data.oferta || null,
    isbn: data.isbn || '',
    images: data.images || [],
    keywords: data.keywords || [],
    _id: data._id,
    descripcion: data.descripcion || '',
    estado: data.estado || 'Nuevo sellado',
    genero: data.genero || '',
    formato: data.formato || '',
    vendedor: data.vendedor || '',
    idVendedor: data.idVendedor,
    edicion: data.edicion,
    idioma: data.idioma,
    ubicacion: data.ubicacion || {
      ciudad: '',
      departamento: '',
      pais: ''
    },
    tapa: data.tapa || '',
    edad: data.edad || '',
    fechaPublicacion: data.fechaPublicacion || new Date().toISOString(),
    actualizadoEn: data.actualizadoEn || new Date().toISOString(),
    disponibilidad: data.disponibilidad || 'Disponible',
    mensajes: data.mensajes || [],
    librosVendidos: data.librosVendidos || 0,
    collectionsIds: data.collectionsIds || []
  }
}
