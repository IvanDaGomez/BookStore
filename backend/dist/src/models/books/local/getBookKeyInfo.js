export function getBookKeyInfo(book) {
    return [
        ...(book?.keywords || []), // Palabras clave del libro
        book.titulo,
        book.genero,
        book.edad,
        ...(typeof book.ubicacion === 'object' ? Object.values(book.ubicacion) : [book.ubicacion]),
        book.autor,
        book.vendedor,
        book.idioma,
        book.formato,
        book.edicion,
        book.estado,
        ...Object.values(book.preferencias || {}),
        ...Object.values(book?.historialBusquedas || {})
    ].filter(Boolean); // Filtra valores nulos o undefined
}
