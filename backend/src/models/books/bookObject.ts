import { AgeType, AvailabilityType, CoverType, EditionType, FormatType, StateType } from '../../types/bookCategories';
import { ID, ImageType, ISOString } from '../../types/objects';

type BookObjectType = {
  titulo: string;
  autor: string;
  precio: number;
  oferta: number | null;
  isbn: string;
  images: ImageType[];
  keywords: string[];
  _id: ID;
  descripcion: string;
  estado: StateType;
  genero: string;
  formato: FormatType;
  vendedor: string;
  idVendedor: ID;
  edicion?: EditionType;
  idioma?: string;
  ubicacion?: {
    ciudad?: string;
    departamento?: string;
    pais?: string;
  };
  tapa?: '' | CoverType;
  edad?: '' | AgeType;
  fechaPublicacion: ISOString; // Date().toISOString()
  actualizadoEn: ISOString;
  disponibilidad?: AvailabilityType;
  mensajes?: string[][];
  collectionsIds?: ID[];
}



const bookObject = (data: BookObjectType, fullInfo = true): Partial<BookObjectType> => {
  if (fullInfo) {
    return {
      titulo: data.titulo,
      autor: data.autor,
      precio: data.precio,
      oferta: data.oferta || null,
      isbn: data.isbn,
      images: data.images || [],
      keywords: data.keywords || [],
      _id: data._id,
      descripcion: data.descripcion,
      estado: data.estado,
      genero: data.genero,
      formato: data.formato,
      vendedor: data.vendedor,
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
      collectionsIds: data.collectionsIds || []
    };
  }
  return {
      titulo: data.titulo,
      autor: data.autor,
      precio: data.precio,
      oferta: data.oferta || null,
      isbn: data.isbn,
      images: data.images || [],
      _id: data._id,
      descripcion: data.descripcion,
      estado: data.estado || 'Nuevo sellado',
      genero: data.genero,
      disponibilidad: data.disponibilidad || 'Disponible',
      collectionsIds: data.collectionsIds || []
  };
};

export { bookObject, BookObjectType };