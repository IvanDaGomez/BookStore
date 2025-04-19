// import { crearCollage } from '../../assets/createCollage.js'
import { validateCollection, validatePartialCollection } from '../../assets/validate.js';
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js';
class CollectionsController {
    constructor({ CollectionsModel, BooksModel }) {
        this.getAllCollections = async (req, res, next) => {
            try {
                const collections = await this.CollectionsModel.getAllCollections();
                res.json(collections);
            }
            catch (err) {
                next(err);
            }
        };
        this.getCollectionById = async (req, res, next) => {
            try {
                const collectionId = req.params.collectionId;
                const collection = await this.CollectionsModel.getCollectionById(collectionId);
                res.json(collection);
            }
            catch (err) {
                next(err);
            }
        };
        this.getCollectionsByUser = async (req, res, next) => {
            try {
                const userId = req.params.userId;
                const collections = await this.CollectionsModel.getCollectionsByUser(userId);
                res.json({ data: collections });
            }
            catch (err) {
                next(err);
            }
        };
        this.getBooksByCollection = async (req, res, next) => {
            try {
                const collectionId = req.params.collectionId;
                if (!collectionId) {
                    return res.status(400).json({ error: 'No se proporcionó el collectionId' });
                }
                const collection = await this.CollectionsModel.getCollectionById(collectionId);
                const books = await this.BooksModel.getBooksByIdList(collection?.librosIds || [], 24);
                res.json(books);
            }
            catch (err) {
                next(err);
            }
        };
        this.createCollection = async (req, res, next) => {
            try {
                const rawData = req.body;
                if (!rawData) {
                    return res.status(400).json({ error: 'No se proporcionó la colección' });
                }
                const data = rawData;
                if (req.file)
                    data.foto = `${req.file.filename}`;
                if (rawData.saga)
                    data.saga = rawData.saga === 'true';
                // Validación
                const validated = validateCollection(data);
                if (!validated.success) {
                    return res.status(400).json({ error: validated.error });
                }
                // Crear la colección en la base de datos
                const collection = await this.CollectionsModel.createCollection(data);
                // Si todo es exitoso, devolver el colección creado
                res.send(collection);
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteCollection = async (req, res, next) => {
            try {
                const collectionId = req.params.collectionId;
                const result = await this.CollectionsModel.deleteCollection(collectionId);
                res.json({ message: 'Colección eliminada con éxito', result });
            }
            catch (err) {
                next(err);
            }
        };
        this.updateCollection = async (req, res, next) => {
            try {
                const collectionId = req.params.collectionId;
                const data = req.body;
                if (!collectionId || !data) {
                    return res.status(400).json({ error: 'Faltan algunos campos' });
                }
                const valid = validatePartialCollection(data);
                if (!valid) {
                    return res.status(404).json({ error: 'No válido' });
                }
                const updated = await this.CollectionsModel.updateCollection(collectionId, data);
                res.json(updated);
            }
            catch (err) {
                next(err);
            }
        };
        this.addBookToCollection = async (req, res, next) => {
            try {
                const { bookId, collectionId } = req.query;
                if (!bookId || !collectionId) {
                    return res.status(400).json({ error: 'No se proporcionó bookId' });
                }
                const book = await this.BooksModel.getBookById(bookId);
                const collection = await this.CollectionsModel.getCollectionById(collectionId);
                if (book.collectionsIds.includes(collectionId) && collection.librosIds.includes(bookId)) {
                    return res.status(200).json({ status: 'Ya se agregó el libro' });
                }
                const newCollectionList = [...collection.librosIds, bookId];
                const newBookList = [...book.collectionsIds, collectionId];
                await Promise.all([
                    this.CollectionsModel.updateCollection(collectionId, { librosIds: newCollectionList }),
                    this.BooksModel.updateBook(bookId, { collectionsIds: newBookList })
                ]);
                res.json({ status: 'Actualizado' });
            }
            catch (err) {
                next(err);
            }
        };
        this.getCollectionByQuery = async (req, res, next) => {
            try {
                let { q, l } = req.query;
                q = cambiarGuionesAEspacio(q);
                if (!q) {
                    return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' });
                }
                if (!l) {
                    l = 24;
                }
                const collections = await this.CollectionsModel.getCollectionByQuery(q, l); // Asegurarse de implementar este método en BooksModel
                res.json(collections);
            }
            catch (err) {
                next(err);
            }
        };
        this.getCollectionsByQueryWithFilters = async (req, res, next) => {
            // Destructure query parameters
            try {
                let data = req.query;
                // Apply the filter transformation (change hyphens to spaces)
                Object.keys(data).forEach((key) => {
                    if (data[key]) {
                        data[key] = cambiarGuionesAEspacio(data[key]);
                    }
                });
                // Validate required query parameter "q"
                if (!data.q) {
                    return res.status(400).json({ error: 'El parámetro de consulta "q" es requerido' });
                }
                // Set default pagination limit if not provided
                const lParsed = parseInt(data.l ?? '', 10) ?? 24; // Default to 24 if l is not a valid number
                // Prepare filter object for query
                const filterObj = {
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
                };
                // Initialize the query object to search for books (adjust according to your database/model)
                // Build the query dynamically based on provided filters
                const query = {
                    query: data.q,
                    where: {},
                    l: lParsed
                };
                // Add filters to the query where clause dynamically
                Object.keys(filterObj).forEach((filterKey) => {
                    const value = filterObj[filterKey];
                    if (value) { // Only add filters with a truthy value
                        query.where[filterKey] = value;
                    }
                });
                const collections = await this.CollectionsModel.getCollectionsByQueryWithFilters(query);
                // If no books found
                if (collections.length === 0) {
                    return res.status(404).json({ message: 'No books found matching your filters.' });
                }
                // Return the books found
                return res.status(200).json({ collections });
            }
            catch (err) {
                next(err);
            }
        };
        this.getCollectionSaga = async (req, res, next) => {
            try {
                const { bookId, userId } = req.body;
                if (!bookId || !userId) {
                    return res.status(401).json({ error: 'No se proporcionaron todos los datos' });
                }
                const collection = await this.CollectionsModel.getCollectionSaga(bookId, userId);
                res.json({ data: collection });
            }
            catch (err) {
                next(err);
            }
        };
        this.CollectionsModel = CollectionsModel;
        this.BooksModel = BooksModel;
    }
}
export { CollectionsController };
