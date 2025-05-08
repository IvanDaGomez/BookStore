import { BookObjectType } from '../../types/book'

// Overload signatures
function bookObject(
  data: BookObjectType | Partial<BookObjectType>,
  fullInfo: true
): BookObjectType
function bookObject(
  data: BookObjectType | Partial<BookObjectType>,
  fullInfo: false
): Partial<BookObjectType>

// Implementation
function bookObject (
  data: BookObjectType | Partial<BookObjectType>,
  fullInfo = true
): BookObjectType | Partial<BookObjectType> {
  if (fullInfo) {
    return {
      titulo: data.titulo ?? '',
      autor: data.autor ?? '',
      precio: data.precio ?? 0,
      oferta: data.oferta ?? null,
      isbn: data.isbn ?? '',
      images: data.images ?? [],
      keywords: data.keywords ?? [],
      id: data.id ?? crypto.randomUUID(),
      descripcion: data.descripcion ?? '',
      estado: data.estado ?? 'Nuevo',
      genero: data.genero ?? '',
      formato: data.formato ?? '',
      vendedor: data.vendedor ?? '',
      id_vendedor: data.id_vendedor ?? '',
      edicion: data.edicion ?? '',
      idioma: data.idioma ?? '',
      ubicacion: data.ubicacion ?? {
        ciudad: '',
        departamento: '',
        pais: ''
      },
      tapa: data.tapa ?? '',
      edad: data.edad ?? '',
      fecha_publicacion: data.fecha_publicacion ?? new Date().toISOString(),
      actualizado_en: data.actualizado_en ?? new Date().toISOString(),
      disponibilidad: data.disponibilidad ?? 'Disponible',
      mensajes: data.mensajes ?? [],
      collections_ids: data.collections_ids ?? []
    } as BookObjectType
  }
  return {
    titulo: data.titulo ?? '',
    autor: data.autor ?? '',
    precio: data.precio ?? 0,
    oferta: data.oferta ?? null,
    isbn: data.isbn ?? '',
    keywords: data.keywords ?? [],
    images: data.images ?? [],
    id: data.id ?? '',
    id_vendedor: data.id_vendedor ?? '',
    estado: data.estado ?? 'Nuevo sellado',
    genero: data.genero ?? '',
    disponibilidad: data.disponibilidad ?? 'Disponible',
    collections_ids: data.collections_ids ?? [],
    fecha_publicacion: data.fecha_publicacion ?? new Date().toISOString()
  } as Partial<BookObjectType>
}

export { bookObject }
