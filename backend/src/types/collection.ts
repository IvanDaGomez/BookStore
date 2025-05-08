import { ID, ImageType, ISOString } from './objects'

export type CollectionObjectType = {
  id: ID
  foto: ImageType
  libros_ids: ID[]
  nombre: string
  descripcion?: string
  seguidores: ID[]
  user_id: ID
  saga: boolean
  creado_en: ISOString
}
