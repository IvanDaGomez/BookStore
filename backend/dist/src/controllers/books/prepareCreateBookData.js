import { bookObject } from '../../models/books/bookObject';
/**
 * Prepares and formats the book data for creation by parsing and transforming
 * specific fields from the incoming request. This function ensures that numeric
 * fields are properly parsed and string fields are sanitized and structured.
 *
 * @param data - The book data object containing the fields to be processed.
 * @param req - The Express request object, used to access additional data such as uploaded files.
 *
 * @returns The formatted book data object, ready for further processing or storage.
 *
 * @remarks
 * - Numeric fields like `oferta` and `precio` are parsed from strings to integers
 *   because they are received as strings in the request body.
 * - The `keywords` field, if provided as a comma-separated string, is split into
 *   an array of trimmed strings. If not provided or invalid, it defaults to an empty array.
 * - If files are uploaded in the request, their filenames are extracted and assigned
 *   to the `images` field.
 */
function prepareCreateBookData(data, req) {
    if (data.oferta)
        data.oferta = parseInt(data.oferta);
    data.precio = parseInt(data.precio);
    if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords
            .split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword);
    }
    else {
        data.keywords = [];
    }
    data._id = crypto.randomUUID();
    if (req.files)
        data.images = req.files.map(file => `${file.filename}`);
    return data;
}
function prepareUpdateBookData(data, req, existingBook) {
    if (data.oferta)
        data.oferta = parseInt(data.oferta);
    if (data.precio)
        data.precio = parseInt(data.precio);
    if (data.keywords && typeof data.keywords === 'string') {
        data.keywords = data.keywords
            .split(',')
            .map(keyword => keyword.trim())
            .filter(keyword => keyword);
    }
    if (req.files) {
        data.images = req.files.map(file => `${file.filename}`);
    }
    if (data.mensaje && data.tipo) {
        const messagesArray = existingBook.mensajes || [];
        if (data.tipo === 'pregunta') {
            const questionIndex = messagesArray.findIndex(item => item[0] === data.mensaje);
            if (questionIndex === -1) {
                messagesArray.push([data.mensaje, '', data.senderId]);
            }
        }
        else if (data.tipo === 'respuesta' && data.pregunta) {
            const questionIndex = messagesArray.findIndex(item => item[0] === data.pregunta);
            if (questionIndex !== -1) {
                messagesArray[questionIndex][1] = data.mensaje;
            }
        }
        data.mensajes = messagesArray;
    }
    return bookObject(data, true);
}
function filterData(data) {
    const allowedFields = [
        'titulo',
        'autor',
        'precio',
        'oferta',
        'formato',
        'images',
        'keywords',
        'descripcion',
        'estado',
        'genero',
        'vendedor',
        'idVendedor',
        'edicion',
        'idioma',
        'ubicacion',
        'tapa',
        'edad',
        'fechaPublicacion',
        'actualizadoEn',
        'disponibilidad',
        'mensajes',
        'isbn'
    ];
    let filteredData = {};
    Object.keys(data).forEach(key => {
        const keyField = key;
        if (allowedFields.includes(keyField)) {
            filteredData[keyField] = data[keyField];
        }
    });
    filteredData.actualizadoEn =
        new Date().toISOString();
    return filteredData;
}
export { prepareCreateBookData, prepareUpdateBookData, filterData };
