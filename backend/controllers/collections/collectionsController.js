import { validateCollection, validatePartialCollection } from '../../assets/validate.js'
import { BooksModel } from '../../models/books/local/booksLocal.js'
import { CollectionsModel } from '../../models/collections/collectionsModel.js'

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
      res.json(collections)
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
      const collections = await CollectionsModel.getBooksByCollection(collectionId)
      if (!collections) {
        return res.status(404).json({ error: 'Colección no encontrada' })
      }
      res.json({ data: collections })
    } catch (err) {
      console.error('Error leyendo colección:', err)
      res.status(500).json({ error: 'Error leyendo colección' })
    }
  }

  static async createCollection (req, res) {
    const data = req.body
    if (req.file) data.foto = `${req.file.filename}`
    // Validación
    const validated = validateCollection(data)
    if (!validated.success) {
      console.log('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    // Asignar un ID único al colección
    data._id = crypto.randomUUID()
    const time = new Date()
    data.createdIn = `${time.toISOString()}`
    data.read = false
    // Crear la colección en la base de datos
    const notification = await CollectionsModel.createCollection(data)
    if (typeof notification === 'string' && notification.startsWith('Error')) {
      return res.status(500).json({ error: notification })
    }
    if (!notification) {
      return res.status(500).json({ error: 'Error al crear colección' })
    }

    // Si todo es exitoso, devolver el colección creado
    res.send(notification)
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
    if (book.collectionsIds.includes(collectionId) || collection.librosIds.includes(bookId)) {
      return res.status(200).json({ status: 'Ya se agregó el libro' })
    }

    const newCollectionList = [...(collection.librosIds || []), bookId]
    const newBookList = [...(book.collectionsIds || []), collectionId]

    const collectionUpdated = await CollectionsModel.updateCollection(collectionId, { librosIds: newCollectionList })
    const bookUpdated = await BooksModel.updateBook(bookId, { collectionsIds: newBookList })

    if (!collectionUpdated || !bookUpdated) {
      return res.status(401).json({ error: 'No se pudo actualizar la colección' })
    }
    res.json({ status: 'Actualizado' })
  }
}

export { CollectionsController }
