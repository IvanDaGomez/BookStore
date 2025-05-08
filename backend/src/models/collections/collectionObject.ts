import { CollectionObjectType } from '../../types/collection'
import { ISOString } from '../../types/objects'

const collectionObject = (
  data: Partial<CollectionObjectType>
): CollectionObjectType => {
  return {
    id: data.id ?? crypto.randomUUID(),
    foto: data.foto ?? '',
    libros_ids: data.libros_ids ?? [],
    nombre: data.nombre ?? '',
    descripcion: data.descripcion || '',
    seguidores: data.seguidores || [],
    user_id: data.user_id ?? crypto.randomUUID(),
    saga: data.saga || false,
    creado_en: data.creado_en || (new Date().toISOString() as ISOString)
  }
}

export { collectionObject }
