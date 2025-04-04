// import { crearCollage } from '../../assets/createCollage.js'
import { validateCollection, validatePartialCollection } from '../../assets/validate.js'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { BooksModel } from '../../models/books/local/booksLocal.js'
import { CollectionsModel } from '../../models/collections/local/collectionsModel.js'

class CollectionsController {
  static async getAllCollections (req, res) {
    try {
      const collections = await CollectionsModel.getAllCollections()
      if (!collections) {
        res.status(500).json({ error: 'Error al leer usuarios' })
      }
      res.json(collections)
    } catch (err) {
      console.error('Error reading collections:', err)
      res.status(500).json({ error: 'Error leyendo usuarios' })
    }
  }

  static async getCollectionById (req, res) {
    try {
      const { collectionId } = req.params
      const collection = await CollectionsModel.getCollectionById(collectionId)
      if (!collection) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json(collection)
    } catch (err) {
      console.error('Error leyendo colección:', err)
      res.status(500).json({ error: 'Error leyendo colección' })
    }
  }

  static async getCollectionsByUser (req, res) {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(400).json({ error: 'No se proporcionó el userId' })
      }
      const collections = await CollectionsModel.getCollectionsByUser(userId)
      if (!collections) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json({ data: collections })
    } catch (err) {
      console.error('Error leyendo colección:', err)
      res.status(500).json({ error: 'Error leyendo colección' })
    }
  }

  static async getBooksByCollection (req, res) {
    try {
      const { collectionId } = req.params
      if (!collectionId) {
        return res.status(400).json({ error: 'No se proporcionó el userId' })
      }
      const collection = await CollectionsModel.getCollectionById(collectionId)
      const books = await BooksModel.getBooksByIdList(collection?.librosIds || [])
      if (!books) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json({ data: books })
    } catch (err) {
      console.error('Error leyendo colección:', err)
      res.status(500).json({ error: 'Error leyendo colección' })
    }
  }

  static async createCollection (req, res) {
    try {
      const data = req.body

      if (req.file) data.foto = `${req.file.filename}`
      if (data.saga) data.saga = data.saga === 'true'

      // Validación
      const validated = validateCollection(data)
      if (!validated.success) {
        console.log('Error de validación:', validated.error)
        return res.status(400).json({ error: validated.error })
      }

      // Crear la colección en la base de datos
      const collection = await CollectionsModel.createCollection(data)
      if (typeof notification === 'string' && collection.startsWith('Error')) {
        return res.status(500).json({ error: collection })
      }
      if (!collection) {
        return res.status(500).json({ error: 'Error al crear colección' })
      }
      console.log(collection)
      // Si todo es exitoso, devolver el colección creado
      res.send({ data: collection })
    } catch (error) {
      res.status(500).json({ error })
      console.error('Error en createCollection:', error)
    }
  }

  static async deleteCollection (req, res) {
    try {
      const { collectionId } = req.params

      // Eliminar el colección de la base de datos

      const result = await CollectionsModel.deleteCollection(collectionId)
      if (!result) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }

      res.json({ message: 'Colección eliminada con éxito', result })
    } catch (err) {
      console.error('Error al eliminar la colección:', err)
      res.status(500).json({ error: 'Error al eliminar la colección' })
    }
  }

  static async updateCollection (req, res) {
    const { collectionId } = req.params
    const data = req.body
    if (!collectionId || !data) {
      return res.status(400).json({ error: 'Faltan algunos campos' })
    }
    const valid = validatePartialCollection(data)

    if (!valid) {
      return res.status(404).json({ error: 'No válido' })
    }
    const updated = await CollectionsModel.updateCollection(collectionId, data)

    if (!updated) {
      return res.status(400).json({ error: 'No se pudo actualizar la colección' })
    }
    res.json({ data: updated })
  }

  static async addBookToCollection (req, res) {
    try {
      const { bookId, collectionId } = req.query

      if (!bookId || !collectionId) {
        return res.status(400).json({ error: 'No se proporcionó bookId' })
      }
      const book = await BooksModel.getBookById(bookId)
      const collection = await CollectionsModel.getCollectionById(collectionId)
      if (!book) {
        return res.status(401).json({ error: 'No se encontró el libro' })
      }
      if (!collection) {
        return res.status(401).json({ error: 'No se encontró la colección' })
      }
      if ((book?.collectionsIds || []).includes(collectionId) || (collection?.librosIds || []).includes(bookId)) {
        return res.status(200).json({ status: 'Ya se agregó el libro' })
      }

      const newCollectionList = [...(collection?.librosIds || []), bookId]
      const newBookList = [...(book?.collectionsIds || []), collectionId]
      const collectionUpdated = await CollectionsModel.updateCollection(collectionId, { librosIds: newCollectionList })
      const bookUpdated = await BooksModel.updateBook(bookId, { collectionsIds: newBookList })

      if (!collectionUpdated || !bookUpdated) {
        return res.status(401).json({ error: 'No se pudo actualizar la colección' })
      }
      res.json({ status: 'Actualizado' })
    } catch (error) {
      console.error('Error en addBookToCollection:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  static async getCollectionByQuery (req, res) {
    try {
      let { q, l } = req.query // Obtener el valor del parámetro de consulta 'q'
      q = cambiarGuionesAEspacio(q)

      if (!q) {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      if (!l) {
        l = 24
      }

      const collections = await CollectionsModel.getCollectionByQuery(q, l) // Asegurarse de implementar este método en BooksModel
      if (collections.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }

      res.json(collections)
    } catch (err) {
      console.error('Error al leer libros por consulta:', err)
      res.status(500).json({ error: 'Error al leer libros' })
    }
  }

  static async getCollectionsByQueryWithFilters (req, res) {
    // Destructure query parameters
    let { categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado, q, l } = req.query
    // Apply the filter transformation (change hyphens to spaces)
    categoria = cambiarGuionesAEspacio(categoria)
    ubicacion = cambiarGuionesAEspacio(ubicacion)
    edad = cambiarGuionesAEspacio(edad)
    tapa = cambiarGuionesAEspacio(tapa)
    fechaPublicacion = cambiarGuionesAEspacio(fechaPublicacion)
    idioma = cambiarGuionesAEspacio(idioma)
    estado = cambiarGuionesAEspacio(estado)

    // Validate required query parameter "q"
    if (!q) {
      return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
    }

    // Set default pagination limit if not provided
    l = parseInt(l) || 24 // Default to 24 if l is not a valid number

    // Prepare filter object for query
    const filterObj = {
      categoria,
      ubicacion,
      edad,
      tapa,
      fechaPublicacion,
      idioma,
      estado
    }

    // Initialize the query object to search for books (adjust according to your database/model)
    try {
      // Build the query dynamically based on provided filters
      const query = {
        query: q,
        where: {},
        limit: l,
        offset: 0 // Add offset if you want pagination support
      }

      // Add filters to the query where clause dynamically
      Object.keys(filterObj).forEach((filterKey) => {
        const value = filterObj[filterKey]
        if (value) { // Only add filters with a truthy value
          query.where[filterKey] = value
        }
      })

      const collections = await CollectionsModel.getCollectionsByQueryWithFilters(query)

      // If no books found
      if (collections.length === 0) {
        return res.status(404).json({ message: 'No books found matching your filters.' })
      }

      // Return the books found
      return res.status(200).json({ collections })
    } catch (error) {
      console.error('Error fetching books:', error)
      return res.status(500).json({ error: 'An error occurred while fetching the books.' })
    }
  }

  static async getCollectionSaga (req, res) {
    try {
      const { bookId, userId } = req.body
      if (!bookId || !userId) {
        return res.status(401).json({ error: 'No se proporcionaron todos los datos' })
      }
      const collection = await CollectionsModel.getCollectionSaga(bookId, userId)

      if (!collection) {
        return res.json({ error: 'No se encontró una colección' })
      }
      res.json({ data: collection })
    } catch (error) {
      console.error('Error en getCollectionSaga:', error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }
}

export { CollectionsController }
