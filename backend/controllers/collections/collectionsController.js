// import { crearCollage } from '../../assets/createCollage.js'
import { validateCollection, validatePartialCollection } from '../../assets/validate.js'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'

class CollectionsController {
  constructor ({ CollectionsModel }) {
    this.CollectionsModel = CollectionsModel
  }

  getAllCollections = async (req, res, next) => {
    try {
      const collections = await this.CollectionsModel.getAllCollections()
      if (!collections) {
        res.status(500).json({ error: 'Error al leer usuarios' })
      }
      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionById = async (req, res, next) => {
    try {
      const { collectionId } = req.params
      const collection = await this.CollectionsModel.getCollectionById(collectionId)
      if (!collection) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json(collection)
    } catch (err) {
      next(err)
    }
  }

  getCollectionsByUser = async (req, res, next) => {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(400).json({ error: 'No se proporcionó el userId' })
      }
      const collections = await this.CollectionsModel.getCollectionsByUser(userId)
      if (!collections) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json({ data: collections })
    } catch (err) {
      next(err)
    }
  }

  getBooksByCollection = async (req, res, next) => {
    try {
      const { collectionId } = req.params
      if (!collectionId) {
        return res.status(400).json({ error: 'No se proporcionó el userId' })
      }
      const collection = await this.CollectionsModel.getCollectionById(collectionId)
      const books = await this.BooksModel.getBooksByIdList(collection?.librosIds || [])
      if (!books) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json({ data: books })
    } catch (err) {
      next(err)
    }
  }

  createCollection = async (req, res, next) => {
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
      const collection = await this.CollectionsModel.createCollection(data)
      if (typeof notification === 'string' && collection.startsWith('Error')) {
        return res.status(500).json({ error: collection })
      }
      if (!collection) {
        return res.status(500).json({ error: 'Error al crear colección' })
      }
      console.log(collection)
      // Si todo es exitoso, devolver el colección creado
      res.send({ data: collection })
    } catch (err) {
      next(err)
    }
  }

  deleteCollection = async (req, res, next) => {
    try {
      const { collectionId } = req.params

      // Eliminar el colección de la base de datos

      const result = await this.CollectionsModel.deleteCollection(collectionId)
      if (!result) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }

      res.json({ message: 'Colección eliminada con éxito', result })
    } catch (err) {
      next(err)
    }
  }

  updateCollection = async (req, res, next) => {
    try {
      const { collectionId } = req.params
      const data = req.body
      if (!collectionId || !data) {
        return res.status(400).json({ error: 'Faltan algunos campos' })
      }
      const valid = validatePartialCollection(data)

      if (!valid) {
        return res.status(404).json({ error: 'No válido' })
      }
      const updated = await this.CollectionsModel.updateCollection(collectionId, data)

      if (!updated) {
        return res.status(400).json({ error: 'No se pudo actualizar la colección' })
      }
      res.json({ data: updated })
    } catch (err) {
      next(err)
    }
  }

  addBookToCollection = async (req, res, next) => {
    try {
      const { bookId, collectionId } = req.query

      if (!bookId || !collectionId) {
        return res.status(400).json({ error: 'No se proporcionó bookId' })
      }
      const book = await this.BooksModel.getBookById(bookId)
      const collection = await this.CollectionsModel.getCollectionById(collectionId)
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
      const collectionUpdated = await this.CollectionsModel.updateCollection(collectionId, { librosIds: newCollectionList })
      const bookUpdated = await this.BooksModel.updateBook(bookId, { collectionsIds: newBookList })

      if (!collectionUpdated || !bookUpdated) {
        return res.status(401).json({ error: 'No se pudo actualizar la colección' })
      }
      res.json({ status: 'Actualizado' })
    } catch (err) {
      next(err)
    }
  }

  getCollectionByQuery = async (req, res, next) => {
    try {
      let { q, l } = req.query // Obtener el valor del parámetro de consulta 'q'
      q = cambiarGuionesAEspacio(q)

      if (!q) {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      if (!l) {
        l = 24
      }

      const collections = await this.CollectionsModel.getCollectionByQuery(q, l) // Asegurarse de implementar este método en BooksModel
      if (collections.length === 0) {
        return res.status(404).json({ error: 'No se encontraron libros' })
      }

      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionsByQueryWithFilters = async (req, res, next) => {
    // Destructure query parameters
    try {
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

      const collections = await this.CollectionsModel.getCollectionsByQueryWithFilters(query)

      // If no books found
      if (collections.length === 0) {
        return res.status(404).json({ message: 'No books found matching your filters.' })
      }

      // Return the books found
      return res.status(200).json({ collections })
    } catch (err) {
      next(err)
    }
  }

  getCollectionSaga = async (req, res, next) => {
    try {
      const { bookId, userId } = req.body
      if (!bookId || !userId) {
        return res.status(401).json({ error: 'No se proporcionaron todos los datos' })
      }
      const collection = await this.CollectionsModel.getCollectionSaga(bookId, userId)

      if (!collection) {
        return res.status(404).json({ error: 'No se encontró la colección' })
      }
      res.json({ data: collection })
    } catch (err) {
      next(err)
    }
  }
}

export { CollectionsController }
