import {
  AgeType,
  AvailabilityType,
  CoverType,
  EditionType,
  FormatType,
  GenreType,
  LanguageType,
  StateType
} from './bookCategories'
import { ID, ImageType, ISOString } from './objects'

export type BookObjectType = {
  titulo: string
  autor: string
  precio: number
  oferta: number | null
  isbn: string
  images: ImageType[]
  keywords: string[]
  id: ID
  descripcion: string
  estado: StateType
  genero: GenreType
  formato: FormatType
  vendedor: string
  id_vendedor: ID
  edicion?: EditionType
  idioma?: LanguageType
  ubicacion?: {
    ciudad?: string
    departamento?: string
    pais?: string
  }
  tapa?: CoverType
  edad?: AgeType
  fecha_publicacion: ISOString
  actualizado_en: ISOString
  disponibilidad: AvailabilityType
  mensajes?: {
    pregunta: string
    respuesta?: string,
    sender_id: ID
  }[]
  collections_ids: ID[]
}
