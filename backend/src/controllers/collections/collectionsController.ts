// import { crearCollage } from '../../assets/createCollage.js'
import { validateCollection, validatePartialCollection } from '../../assets/validate.js'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { IBooksModel, ICollectionsModel } from '../../types/models.js'
import express from 'express'
import { ID, ImageType, ISOString } from '../../types/objects.js'
import { CollectionObjectType } from '../../types/collection.js'
import { BookObjectType } from '../../types/book.js'
import { AgeType, CoverType, GenreType, LanguageType, StateType } from '../../types/bookCategories.js'
import { AuthToken } from '../../types/authToken.js'
class CollectionsController {
  private CollectionsModel: ICollectionsModel
  private BooksModel: IBooksModel
  constructor ({ CollectionsModel, BooksModel }: { CollectionsModel: ICollectionsModel, BooksModel: IBooksModel }) {
    this.CollectionsModel = CollectionsModel
    this.BooksModel = BooksModel
  }

  getAllCollections = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const collections = await this.CollectionsModel.getAllCollections()
      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const collectionId = req.params.collectionId as ID
      const collection = await this.CollectionsModel.getCollectionById(collectionId)
      res.json(collection)
    } catch (err) {
      next(err)
    }
  }

  getCollectionsByUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.params.userId as ID

      const collections = await this.CollectionsModel.getCollectionsByUser(userId)

      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getBooksByCollection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const collectionId = req.params.collectionId as ID | undefined
      if (!collectionId) {
        return res.status(400).json({ error: 'No se proporcionó el collectionId' })
      }
      const collection = await this.CollectionsModel.getCollectionById(collectionId)
      const books = await this.BooksModel.getBooksByIdList(collection.librosIds, 24)

      res.json(books)
    } catch (err) {
      next(err)
    }
  }

  createCollection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const rawData = req.body as CollectionObjectType | { saga: string } | undefined

      if (!rawData) {
        return res.status(400).json({ error: 'No se proporcionó la colección' })
      }
      const data = rawData as Partial<CollectionObjectType>
      if (req.file) data.foto = `${req.file.filename}` as ImageType
      if (rawData.saga) data.saga = rawData.saga === 'true'

      // Validación
      const validated = validateCollection(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error })
      }

      // Crear la colección en la base de datos
      const collection = await this.CollectionsModel.createCollection(data)

      // Si todo es exitoso, devolver el colección creado
      res.send(collection)
    } catch (err) {
      next(err)
    }
  }

  deleteCollection = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const collectionId = req.params.collectionId as ID

      const result = await this.CollectionsModel.deleteCollection(collectionId)

      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  updateCollection = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response | void> => {
    try {
      const collectionId = req.params.collectionId as ID | undefined
      const data = req.body as Partial<CollectionObjectType> | undefined
      if (!collectionId || !data) {
        return res.status(400).json({ error: 'Faltan algunos campos' })
      }
      const valid = validatePartialCollection(data)

      if (!valid) {
        return res.status(404).json({ error: 'No válido' })
      }
      const updated = await this.CollectionsModel.updateCollection(collectionId, data)

      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  addBookToCollection = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response | void> => {
    try {
      const { bookId, collectionId } = req.query as { bookId: ID | undefined, collectionId: ID | undefined }

      if (!bookId || !collectionId) {
        return res.status(400).json({ error: 'No se proporcionó bookId' })
      }
      const book = await this.BooksModel.getBookById(bookId)
      const collection = await this.CollectionsModel.getCollectionById(collectionId)

      if (book.collectionsIds.includes(collectionId) && collection.librosIds.includes(bookId)) {
        return res.status(200).json({ message: 'Ya se agregó el libro' })
      }

      const newCollectionList = [...collection.librosIds, bookId]
      const newBookList = [...book.collectionsIds, collectionId]
      await Promise.all([
       this.CollectionsModel.updateCollection(collectionId, { librosIds: newCollectionList }),
       this.BooksModel.updateBook(bookId, { collectionsIds: newBookList })
      ])
      res.json({ message: 'Actualizado' })
    } catch (err) {
      next(err)
    }
  }

  getCollectionByQuery = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response | void> => {
    try {
      let { q, l } = req.query as { q: string | undefined, l: number | undefined }
      q = cambiarGuionesAEspacio(q)

      if (!q) {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      if (!l) {
        l = 24
      }

      const collections = await this.CollectionsModel.getCollectionByQuery(q, l) // Asegurarse de implementar este método en BooksModel

      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionsByQueryWithFilters = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response | void> => {
    // Destructure query parameters
    try {
      let data = req.query as {
        q: string | undefined
        l: string | undefined
        genero: GenreType | undefined
        ubicacion: {
          pais: string | undefined
          ciudad: string | undefined
          departamento: string | undefined
        } | undefined
        pais: string | undefined
        ciudad: string | undefined
        departamento: string | undefined
        edad: AgeType | undefined
        tapa: CoverType | undefined
        fechaPublicacion: ISOString | undefined
        idioma: LanguageType | undefined
        estado: StateType | undefined
      }
      // Apply the filter transformation (change hyphens to spaces)
      Object.keys(data).forEach((key) => {
        if (data[key as keyof typeof data]) {
          (data as any)[key] = cambiarGuionesAEspacio((data as any)[key])
        }
      })
      // Validate required query parameter "q"
      if (!data.q) {
        return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' })
      }

      // Set default pagination limit if not provided
      const lParsed = parseInt(data.l ?? '', 10) ?? 24 // Default to 24 if l is not a valid number

      // Prepare filter object for query
      const filterObj: Partial<BookObjectType> = {
        genero: data.genero,
        ...(data.ubicacion ?? {
          pais: '',
          ciudad: '',
          departamento: ''
        }),
        edad: data.edad ?? '',
        tapa: data.tapa ?? '',
        fechaPublicacion: data.fechaPublicacion,
        idioma: data.idioma,
        estado: data.estado
      }

      // Initialize the query object to search for books (adjust according to your database/model)

      // Build the query dynamically based on provided filters
      const query = {
        query: data.q,
        where: {} as Record<string, unknown>,
        l: lParsed
      }

      // Add filters to the query where clause dynamically
      Object.keys(filterObj).forEach((filterKey) => {
        const value = filterObj[filterKey as keyof BookObjectType]
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
      return res.status(200).json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionSaga = async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<express.Response | void> => {
    try {
      const { bookId, userId } = req.body as { bookId: ID | undefined, userId: ID | undefined }
      if (!bookId || !userId) {
        return res.status(401).json({ error: 'No se proporcionaron todos los datos' })
      }
      const collection = await this.CollectionsModel.getCollectionSaga(bookId, userId)

      res.json(collection)
    } catch (err) {
      next(err)
    }
  }
  forYouPageCollections = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
      Aquí se obtiene libros específicos por su query y se envía como respuesta.
      Las consultas actualizan las estadísticas de los libros y los usuarios.
    */
    try {
      const l = req.query.l as string
      const lParsed = parseInt(l, 10) || 24
      const user = req.session.user as AuthToken | undefined

      const results = await this.CollectionsModel.forYouPageCollections(user, lParsed)

      return res.json(results)
    } catch (err) {
      next(err)
    }
  }
}

export { CollectionsController }
