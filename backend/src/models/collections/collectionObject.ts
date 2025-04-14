import { ID, ImageType } from "../../types/objects"

type CollectionObjectType = {
  _id: ID
  foto?: ImageType | ''
  librosIds: ID[]
  nombre: string
  descripcion?: string
  seguidores: ID[]
  userId: ID
  saga: boolean
}

const collectionObject = (data: CollectionObjectType): CollectionObjectType => {
  return {
    _id: data._id,
    foto: data.foto || '',
    librosIds: data.librosIds,
    nombre: data.nombre,
    descripcion: data.descripcion || '',
    seguidores: data.seguidores || [],
    userId: data.userId,
    saga: data.saga || false
  }
}

export { collectionObject, CollectionObjectType}