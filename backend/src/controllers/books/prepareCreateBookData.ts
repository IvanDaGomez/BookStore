import { BookObjectType } from '../../types/book'
import express from 'express'
import { ImageType } from '../../types/objects'
import { bookObject } from '../../models/books/bookObject.js'
import saveOptimizedImages from '../../assets/saveOptimizedImages.js'
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
async function prepareCreateBookData (
  data: any,
  req: express.Request
): Promise<BookObjectType> {
  if (data.oferta)
    data.oferta = parseInt(data.oferta) as BookObjectType['oferta']
  data.precio = parseInt(data.precio) as BookObjectType['precio']
  if (data.keywords && typeof data.keywords === 'string') {
    data.keywords = (data.keywords as string)
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword) as BookObjectType['keywords']
  } else {
    data.keywords = []
  }
  data.id = crypto.randomUUID()
    if (req.file) {
  
      data.foto_perfil = req.file.filename as ImageType
      
      
    }
  if (req.files)
    data.images = (req.files as Express.Multer.File[]).map(
      file => `${file.filename}`
    ) as ImageType[]
    await saveOptimizedImages(data.images)
  return data as BookObjectType
}

async function prepareUpdateBookData (
  data: any,
  req: express.Request,
  existingBook: BookObjectType
): Promise<BookObjectType> {
  if (data.oferta)
    data.oferta = parseInt(data.oferta) as BookObjectType['oferta']
  if (data.precio)
    data.precio = parseInt(data.precio) as BookObjectType['precio']

  if (data.keywords && typeof data.keywords === 'string') {
    data.keywords = (data.keywords as string)
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword) as BookObjectType['keywords']
  }

  if (req.files) {
    data.images = (req.files as Express.Multer.File[]).map(
      file => `${file.filename}`
    ) as BookObjectType['images']
    await saveOptimizedImages(data.images)
  }
  if (data.mensaje && data.tipo) {
    const messagesArray = existingBook.mensajes || []
    if (data.tipo === 'pregunta') {
      const questionIndex = messagesArray.findIndex(
        item => item[0] === data.mensaje
      )

      if (questionIndex === -1) {
        messagesArray.push([data.mensaje, '', data.senderId])
      }
    } else if (data.tipo === 'respuesta' && data.pregunta) {
      const questionIndex = messagesArray.findIndex(
        item => item[0] === data.pregunta
      )
      if (questionIndex !== -1) {
        messagesArray[questionIndex][1] = data.mensaje
      }
    }

    data.mensajes = messagesArray
  }
  return bookObject(data, true) as BookObjectType
}

function filterData (data: BookObjectType): BookObjectType {
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
  ]

  let filteredData: Partial<
    Record<keyof BookObjectType, BookObjectType[keyof BookObjectType]>
  > = {}
  Object.keys(data).forEach(key => {
    const keyField = key as keyof BookObjectType
    if (allowedFields.includes(keyField)) {
      filteredData[keyField] = data[
        keyField
      ] as BookObjectType[keyof BookObjectType]
    }
  })
  filteredData.actualizado_en =
    new Date().toISOString() as BookObjectType['actualizado_en']
  return filteredData as BookObjectType
}
export { prepareCreateBookData, prepareUpdateBookData, filterData }
