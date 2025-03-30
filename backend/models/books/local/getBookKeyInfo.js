export function getBookKeyInfo (book) {
  return [
    ...book.keywords, // Palabras clave del libro
    book.titulo,
    book.genero,
    book.edad || 'Sin edad especificada',
    book.ubicacion || 'Ubicación desconocida',
    book.autor,
    book.vendedor,
    book.idioma || 'Idioma no especificado',
    book.formato,
    book.edicion,
    book.estado,
    book.fechaPublicacion
  ].filter(Boolean) // Filtra valores nulos o undefined
}
