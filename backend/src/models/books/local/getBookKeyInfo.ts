import { BookObjectType } from "../bookObject";

export function getBookKeyInfo (book: Partial<BookObjectType>): string[] {
  return [
    ...(book.keywords ?? []), // Palabras clave del libro
    book.titulo ?? '',
    book.genero ?? '',
    book.edad ?? '',
    ...Object.values(book.ubicacion ?? {}),
    book.tapa ?? '',
    book.autor ?? '',
    book.vendedor ?? '',
    book.idioma ?? '',
    book.formato ?? '',
    book.edicion ?? '',
    book.estado ?? ''
  ]
}
