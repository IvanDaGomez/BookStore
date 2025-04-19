const collectionObject = (data) => {
    return {
        _id: data._id ?? crypto.randomUUID(),
        foto: data.foto ?? '',
        librosIds: data.librosIds ?? [],
        nombre: data.nombre ?? '',
        descripcion: data.descripcion || '',
        seguidores: data.seguidores || [],
        userId: data.userId ?? crypto.randomUUID(),
        saga: data.saga || false,
        creadoEn: data.creadoEn || new Date().toISOString()
    };
};
export { collectionObject };
