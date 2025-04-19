/* eslint-disable camelcase */
import { validateBook, validatePartialBook } from '../../assets/validate';
import { cambiarGuionesAEspacio } from '../../assets/agregarMas';
import { chromium } from 'playwright';
import { scrapingFunctions } from '../../assets/scrappingConfig';
import { sendEmail } from '../../assets/email/sendEmail.js';
import { createEmail } from '../../assets/email/htmlEmails.js';
import { sendNotification } from '../../assets/notifications/sendNotification.js';
import { createNotification } from '../../assets/notifications/createNotification.js';
import { filterData, prepareCreateBookData, prepareUpdateBookData } from './prepareCreateBookData';
import { updateData } from './updateData.js';
// import { helperImg } from '../../assets/helperImg.js'
export class BooksController {
    constructor({ UsersModel, BooksModel }) {
        this.getAllBooks = async (req, res, next) => {
            /*
              Aquí se obtiene todos los libros de la base de datos y se envían como respuesta.
              Si no se encuentran libros, se envía un error 500.
            */
            try {
                const books = await this.BooksModel.getAllBooks();
                res.json(books);
            }
            catch (err) {
                next(err);
            }
        };
        this.getBookById = async (req, res, next) => {
            /*
              Aquí se obtiene un libro específico por su ID y se envía como respuesta.
              Si no se encuentra el libro, se envía un error 404.
            */
            try {
                const bookId = req.params.bookId;
                const book = await this.BooksModel.getBookById(bookId);
                const update = req.headers.update === book._id;
                const user = req.session.user;
                if (update && user) {
                    const bookCopy = JSON.parse(JSON.stringify(book)); // aseguro que es limpio y plano
                    await updateData(user, bookCopy, 'openedBook');
                }
                res.json(book);
            }
            catch (err) {
                next(err);
            }
        };
        this.getBookByQuery = async (req, res, next) => {
            /*
              Aquí se obtiene libros específicos por su query y se envía como respuesta.
              Si no se encuentra el libro, se envía un error 404.
              Las consultas actualizan las estadísticas de los libros y los usuarios.
            */
            try {
                let { q, l } = req.query;
                // Validación de la query
                if (q) {
                    q = cambiarGuionesAEspacio(q);
                }
                else {
                    return res
                        .status(400)
                        .json({ error: 'El parámetro de consulta "q" es requerido' });
                }
                let lParsed = parseInt(l, 10) ?? 24;
                if (lParsed > 100)
                    lParsed = 100;
                // Consigue los libros del modelo
                const books = await this.BooksModel.getBookByQuery(q, lParsed);
                // Si hay usuario en la sesión, actualiza las estadísticas de los libros
                const user = req.session.user;
                if (user) {
                    for (const book of books.slice(0, 3)) {
                        const bookCopy = JSON.parse(JSON.stringify(book));
                        await updateData(user, bookCopy, 'query');
                    }
                }
                res.json(books);
            }
            catch (err) {
                next(err);
            }
        };
        this.getBooksByQueryWithFilters = async (req, res, next) => {
            /*
              Aquí se obtiene libros específicos por su query y se envía como respuesta.
              Si no se encuentra el libro, se envía un error 404.
              Las consultas actualizan las estadísticas de los libros y los usuarios.
              Se pueden aplicar filtros como categoría, ubicación, edad, tapa, fecha de publicación, idioma y estado.
            */
            try {
                let { categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado, q, l } = req.query;
                if (!q) {
                    return res
                        .status(400)
                        .json({ error: 'El parámetro de consulta "q" es requerido' });
                }
                const filters = {
                    categoria,
                    ubicacion,
                    edad,
                    tapa,
                    fechaPublicacion,
                    idioma,
                    estado
                };
                Object.keys(filters).forEach(key => {
                    const filterKey = key;
                    if (filters[filterKey]) {
                        filters[filterKey] = cambiarGuionesAEspacio(filters[filterKey]);
                    }
                });
                ({ categoria, ubicacion, edad, tapa, fechaPublicacion, idioma, estado } =
                    filters);
                const lParsed = parseInt(l, 10) || 24;
                const filterObj = {
                    categoria,
                    ubicacion,
                    edad,
                    tapa,
                    fechaPublicacion,
                    idioma,
                    estado
                };
                const query = {
                    query: q,
                    where: {},
                    limit: lParsed
                };
                Object.keys(filterObj).forEach(filterKey => {
                    const key = filterKey;
                    const value = filterObj[key];
                    if (value) {
                        if (typeof value === 'string') {
                            query.where[key] = value;
                        }
                        else if (Array.isArray(value) && typeof value[0] === 'string') {
                            query.where[key] = value[0];
                        }
                        else {
                            throw new Error(`Invalid filter value for key "${key}"`);
                        }
                    }
                });
                const books = await this.BooksModel.getBooksByQueryWithFilters(query);
                if (books.length === 0) {
                    return res.status(404).json({ error: 'No se encontraron libros' });
                }
                res.status(200).json(books);
            }
            catch (err) {
                next(err);
            }
        };
        this.createBook = async (req, res, next) => {
            /*
              Aquí se crea un libro nuevo con el modelo.
              Si no se encuentra el libro, se envía un error 500.
              Se valida el libro y se envía una notificación al vendedor.
            */
            let data = req.body;
            try {
                data = prepareCreateBookData(data, req);
                const validated = validateBook(data);
                if (!validated.success) {
                    return res.status(400).json({ error: validated.error });
                }
                // Recibe el usuario para actualizar sus librosIds
                const user = await this.UsersModel.getUserById(data.idVendedor);
                // Turn user to Vendedor if not already
                if (user.rol === 'usuario') {
                    user.rol = 'vendedor';
                }
                const updated = await this.UsersModel.updateUser(user._id, {
                    librosIds: [...(user.librosIds ?? []), data._id],
                    rol: user.rol
                });
                const book = await this.BooksModel.createBook(data);
                const notificationData = {};
                await sendNotification(createNotification(notificationData, 'bookPublished'));
                const correo = await this.UsersModel.getEmailById(data.idVendedor);
                await sendEmail(`${data.vendedor} ${correo.correo}`, 'Libro publicado con éxito', createEmail(data, 'bookPublished'));
                res.send({ book });
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteBook = async (req, res, next) => {
            try {
                const bookId = req.params.bookId;
                const book = await this.BooksModel.getBookById(bookId);
                const user = await this.UsersModel.getUserById(book.idVendedor);
                const updatedLibrosIds = user.librosIds.filter(id => id !== bookId);
                await this.UsersModel.updateUser(user._id, {
                    librosIds: updatedLibrosIds
                });
                const result = await this.BooksModel.deleteBook(bookId);
                res.json({ message: 'Libro eliminado con éxito', result });
            }
            catch (err) {
                next(err);
            }
        };
        this.updateBook = async (req, res, next) => {
            try {
                const bookId = req.params.bookId;
                const rawData = req.body;
                const existingBook = await this.BooksModel.getBookById(bookId);
                const data = prepareUpdateBookData(rawData, req, existingBook);
                const validated = validatePartialBook(data);
                if (!validated.success) {
                    return res.status(400).json({ error: validated.error.errors });
                }
                const filteredData = filterData(data);
                const book = await this.BooksModel.updateBook(bookId, filteredData);
                if (!rawData.mensaje && !rawData.tipo) {
                    const notificationData = {};
                    await sendNotification(createNotification(notificationData, 'bookUpdated'));
                }
                res.status(200).json(book);
            }
            catch (err) {
                next(err);
            }
        };
        this.searchByBookTitle = async (req, res, next) => {
            const browser = await chromium.launch({ headless: true });
            try {
                const bookTitle = req.params.bookTitle;
                const context = await browser.newContext();
                const page = await context.newPage();
                let results = [];
                for (const scrapeFunction of scrapingFunctions) {
                    const result = await scrapeFunction(page, bookTitle);
                    results = [...results, ...result];
                }
                await browser.close();
                res.json(results);
            }
            catch (err) {
                await browser.close();
                next(err);
            }
        };
        this.getAllReviewBooks = async (req, res, next) => {
            try {
                const books = await this.BooksModel.getAllReviewBooks();
                res.json(books);
            }
            catch (err) {
                next(err);
            }
        };
        this.createReviewBook = async (req, res, next) => {
            try {
                let data = req.body;
                const validated = validateBook(data);
                if (!validated.success) {
                    console.error('Error de validación:', validated.error);
                    return res.status(400).json({ error: validated.error });
                }
                data = prepareCreateBookData(data, req);
                const book = await this.BooksModel.createReviewBook(data);
                res.send(book);
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteReviewBook = async (req, res, next) => {
            try {
                const bookId = req.params.bookId;
                const result = await this.BooksModel.deleteReviewBook(bookId);
                res.json({ message: 'Libro revisión eliminado con éxito', result });
            }
            catch (err) {
                next(err);
            }
        };
        this.updateReviewBook = async (req, res, next) => {
            try {
                const bookId = req.params.bookId;
                let rawData = req.body;
                const existingBook = await this.BooksModel.getBookById(bookId);
                const data = prepareUpdateBookData(rawData, req, existingBook);
                const validated = validatePartialBook(data);
                if (!validated.success) {
                    return res.status(400).json({ error: validated.error.errors });
                }
                const filteredData = filterData(data);
                filteredData.actualizadoEn = new Date().toISOString();
                const book = await this.BooksModel.updateReviewBook(bookId, filteredData);
                res.status(200).json(book);
            }
            catch (err) {
                next(err);
            }
        };
        this.forYouPage = async (req, res, next) => {
            /*
              Aquí se obtiene libros específicos por su query y se envía como respuesta.
              Las consultas actualizan las estadísticas de los libros y los usuarios.
            */
            try {
                const l = req.query.l;
                const lParsed = parseInt(l, 10) || 24;
                const user = req.session.user;
                const results = await this.BooksModel.forYouPage(user, lParsed);
                res.json({ books: results, ok: true });
            }
            catch (err) {
                next(err);
            }
        };
        this.getFavoritesByUser = async (req, res, next) => {
            const userId = req.params.userId;
            try {
                if (!userId)
                    return res.status(401).json({ error: 'No se proporcionó userId' });
                const user = await this.UsersModel.getUserById(userId);
                const favorites = await this.BooksModel.getFavoritesByUser(user?.favoritos || []);
                if (!favorites)
                    return res.status(400).json({ error: 'No hay favoritos' });
                res.json({ data: favorites });
            }
            catch (err) {
                next(err);
            }
        };
        this.predictInfo = async (req, res, next) => {
            try {
                const file = req.file;
                if (!file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }
                const info = await this.BooksModel.predictInfo(file);
                res.json({
                    data: {
                        title: info.title,
                        author: info.author
                    },
                    ok: true
                });
            }
            catch (err) {
                next(err);
            }
        };
        this.getBooksByCollection = async (req, res, next) => {
            const collection = req.body.collection;
            try {
                if (!collection) {
                    return res.status(400).json({ error: 'No se proporcionó la colección' });
                }
                const books = await this.BooksModel.getBooksByCollection(collection);
                res.json({ data: books });
            }
            catch (err) {
                next(err);
            }
        };
        /*
          Utilizamos este estilo de importación para hacer inyecciones de dependencias
          en lugar de importar directamente los modelos en este archivo
        */
        this.UsersModel = UsersModel;
        this.BooksModel = BooksModel;
    }
}
