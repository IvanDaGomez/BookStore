import { ID, ImageType, ISOString } from './objects'

export type CollectionObjectType = {
  id: ID
  foto: ImageType
  librosIds: ID[]
  nombre: string
  descripcion?: string
  seguidores: ID[]
  userId: ID
  saga: boolean
  creadoEn: ISOString
}
