// import { crearCollage } from '../../assets/createCollage.js'
import {
  validateCollection,
  validatePartialCollection
} from '../../assets/validate.js'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { IBooksModel, ICollectionsModel } from '../../types/models.js'
import express from 'express'
import { ID, ImageType, ISOString } from '../../types/objects.js'
import { CollectionObjectType } from '../../types/collection.js'
import { BookObjectType } from '../../types/book.js'
import {
  AgeType,
  CoverType,
  GenreType,
  LanguageType,
  StateType
} from '../../types/bookCategories.js'
import { AuthToken } from '../../types/authToken.js'
class CollectionsController {
  private CollectionsModel: ICollectionsModel
  private BooksModel: IBooksModel
  constructor ({
    CollectionsModel,
    BooksModel
  }: {
    CollectionsModel: ICollectionsModel
    BooksModel: IBooksModel
  }) {
    this.CollectionsModel = CollectionsModel
    this.BooksModel = BooksModel
  }

  getAllCollections = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const collections = await this.CollectionsModel.getAllCollections()
      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const collectionId = req.params.collection_id as ID
      const collection = await this.CollectionsModel.getCollectionById(
        collectionId
      )
      res.json(collection)
    } catch (err) {
      next(err)
    }
  }

  getCollectionsByUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.params.user_id as ID

      const collections = await this.CollectionsModel.getCollectionsByUser(
        userId
      )

      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getBooksByCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const collectionId = req.params.collection_id as ID | undefined
      if (!collectionId) {
        return res
          .status(400)
          .json({ error: 'No se proporcionó el collectionId' })
      }
      const collection = await this.CollectionsModel.getCollectionById(
        collectionId
      )
      const books = await this.BooksModel.getBooksByIdList(
        collection.libros_ids,
        24
      )

      res.json(books)
    } catch (err) {
      next(err)
    }
  }

  createCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const rawData = req.body as
        | Partial<CollectionObjectType>
        | { saga: string }
        | undefined
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
      res.json(collection)
    } catch (err) {
      next(err)
    }
  }

  deleteCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const collectionId = req.params.collection_id as ID

      const result = await this.CollectionsModel.deleteCollection(collectionId)

      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  updateCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const collectionId = req.params.collection_id as ID | undefined
      const data = req.body as Partial<CollectionObjectType> | undefined
      if (!collectionId || !data) {
        return res.status(400).json({ error: 'Faltan algunos campos' })
      }
      const valid = validatePartialCollection(data)

      if (!valid) {
        return res.status(404).json({ error: 'No válido' })
      }
      const updated = await this.CollectionsModel.updateCollection(
        collectionId,
        data
      )

      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  addBookToCollection = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { booksIds, collectionId } = req.query as {
        booksIds: string | undefined; // expecting a string of comma-separated IDs
        collectionId: ID | undefined;
      };
  
      // Validate inputs
      if (!booksIds || !collectionId) {
        return res.status(400).json({ error: 'Faltan parámetros: booksIds o collectionId' });
      }
      // Convert booksIds to an array of IDs
      const booksList = booksIds.split(',').map((id) => id.trim()) as ID[];
  
      // Fetch books and the collection
      let books = await this.BooksModel.getBooksByIdList(booksList, 24);
      const collection = await this.CollectionsModel.getCollectionById(collectionId);

      // Filter books to ensure they're not already in the collection
      books = books.filter((b) =>
        !b.collections_ids?.includes(collectionId) && !collection.libros_ids?.includes(b.id as ID)
      );

      

      // Ensure unique collections in the collection and book
      const newCollectionList = [...new Set([...collection.libros_ids, ...books.map((b) => b.id)])];

      // Update collection and books
      await Promise.all([
        this.CollectionsModel.updateCollection(collectionId, {
          libros_ids: newCollectionList as ID[],
        }),
        ...books.map((b) => {

          b.collections_ids = Array.from(new Set([...(b.collections_ids ?? []), collectionId]))
          console.log('b.collections_ids', b.collections_ids)
          this.BooksModel.updateBook(b.id as ID, {
            collections_ids: b.collections_ids as ID[],
          });
        })
      ])
      // Send response
      res.json({ message: 'Colección actualizada correctamente.' });
    } catch (err) {
      next(err);
    }
  };
  

  getCollectionByQuery = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      let { q, l } = req.query as {
        q: string | undefined
        l: string | undefined
      }
      q = cambiarGuionesAEspacio(q)
      const lParsed = parseInt(l ?? '24', 10) // Default to 24 if l is not a valid number
      if (!q) {
        return res
          .status(400)
          .json({ error: 'El parámetro de consulta "q" es requerido' })
      }
      
      const collections = await this.CollectionsModel.getCollectionByQuery(q, lParsed) // Asegurarse de implementar este método en BooksModel

      res.json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionsByQueryWithFilters = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    // Destructure query parameters
    try {
      let data = req.query as {
        q: string | undefined
        l: string | undefined
        genero: GenreType | undefined
        ubicacion:
          | {
              pais: string | undefined
              ciudad: string | undefined
              departamento: string | undefined
            }
          | undefined
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
      Object.keys(data).forEach(key => {
        if (data[key as keyof typeof data]) {
          ;(data as any)[key] = cambiarGuionesAEspacio((data as any)[key])
        }
      })
      // Validate required query parameter "q"
      if (!data.q) {
        return res
          .status(400)
          .json({ error: 'El parámetro de consulta "q" es requerido' })
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
        fecha_publicacion: data.fechaPublicacion,
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
      Object.keys(filterObj).forEach(filterKey => {
        const value = filterObj[filterKey as keyof BookObjectType]
        if (value) {
          // Only add filters with a truthy value
          query.where[filterKey] = value
        }
      })

      const collections =
        await this.CollectionsModel.getCollectionsByQueryWithFilters(query)

      // If no books found
      if (collections.length === 0) {
        return res
          .status(404)
          .json({ message: 'No books found matching your filters.' })
      }

      // Return the books found
      return res.status(200).json(collections)
    } catch (err) {
      next(err)
    }
  }

  getCollectionSaga = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { book_id, user_id } = req.body as {
        book_id: ID | undefined
        user_id: ID | undefined
      }
      if (!book_id || !user_id) {
        return res
          .status(401)
          .json({ error: 'No se proporcionaron todos los datos' })
      }
      console.log('book_id', book_id)
      const collection = await this.CollectionsModel.getCollectionSaga(
        book_id,
        user_id
      )
      console.log('Saga:', collection)
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
      const results = await this.CollectionsModel.forYouPageCollections(
        user,
        lParsed
      )

      return res.json(results)
    } catch (err) {
      next(err)
    }
  }
}

export { CollectionsController }
