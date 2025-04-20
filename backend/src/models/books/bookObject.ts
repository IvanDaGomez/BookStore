import { BookObjectType } from "../../types/book";

// Overload signatures
function bookObject(data: BookObjectType | Partial<BookObjectType>, fullInfo: true): BookObjectType;
function bookObject(data: BookObjectType | Partial<BookObjectType>, fullInfo: false): Partial<BookObjectType>;

// Implementation
function bookObject(data: BookObjectType | Partial<BookObjectType>, fullInfo = true): BookObjectType | Partial<BookObjectType> {
  if (fullInfo) {
    return {
      titulo: data.titulo ?? '',
      autor: data.autor ?? '',
      precio: data.precio ?? 0,
      oferta: data.oferta ?? null,
      isbn: data.isbn ?? '',
      images: data.images ?? [],
      keywords: data.keywords ?? [],
      _id: data._id ?? crypto.randomUUID(),
      descripcion: data.descripcion ?? '',
      estado: data.estado ?? 'Nuevo',
      genero: data.genero ?? '',
      formato: data.formato ?? '',
      vendedor: data.vendedor ?? '',
      idVendedor: data.idVendedor ?? '',
      edicion: data.edicion ?? '',
      idioma: data.idioma ?? '',
      ubicacion: data.ubicacion ?? {
        ciudad: '',
        departamento: '',
        pais: ''
      },
      tapa: data.tapa ?? '',
      edad: data.edad ?? '',
      fechaPublicacion: data.fechaPublicacion ?? new Date().toISOString(),
      actualizadoEn: data.actualizadoEn ?? new Date().toISOString(),
      disponibilidad: data.disponibilidad ?? 'Disponible',
      mensajes: data.mensajes ?? [],
      collectionsIds: data.collectionsIds ?? []
    } as BookObjectType;
  }
  return {
    titulo: data.titulo ?? '',
    autor: data.autor ?? '',
    precio: data.precio ?? 0,
    oferta: data.oferta ?? null,
    isbn: data.isbn ?? '',
    keywords: data.keywords ?? [],
    images: data.images ?? [],
    _id: data._id ?? '',
    estado: data.estado ?? 'Nuevo sellado',
    genero: data.genero ?? '',
    disponibilidad: data.disponibilidad ?? 'Disponible',
    collectionsIds: data.collectionsIds ?? []
  } as Partial<BookObjectType>;
}

export { bookObject };