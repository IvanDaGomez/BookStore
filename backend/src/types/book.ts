import { AgeType, AvailabilityType, CoverType, EditionType, FormatType, GenreType, LanguageType, StateType } from "./bookCategories";
import { ID, ImageType, ISOString } from "./objects";

export type BookObjectType = {
  titulo: string;
  autor: string;
  precio: number;
  oferta: number | null;
  isbn: string;
  images: ImageType[];
  keywords: string[];
  id: ID;
  descripcion: string;
  estado: StateType;
  genero: GenreType; 
  formato: FormatType;
  vendedor: string;
  idVendedor: ID;
  edicion?: EditionType;
  idioma?: LanguageType;
  ubicacion?: {
    ciudad?: string;
    departamento?: string;
    pais?: string;
  };
  tapa?: CoverType;
  edad?: AgeType;
  fechaPublicacion: ISOString;
  actualizadoEn: ISOString;
  disponibilidad: AvailabilityType;
  mensajes?: string[][];
  collectionsIds: ID[];
}
