import { Router } from 'express';
import { BooksController } from '../../controllers/books/booksController.js';
import { upload } from '../../assets/config.js';
import { generateResponse } from '../../controllers/separated/generateResponse.js';
export const createBooksRouter = ({ BooksModel, UsersModel }) => {
    const booksRouter = Router();
    const booksController = new BooksController({ BooksModel, UsersModel });
    booksRouter.get('/', booksController.getAllBooks); // R
    booksRouter.get('/review', booksController.getAllReviewBooks);
    // booksRouter.get('/safe', booksController.getAllBooksSafe) // R
    booksRouter.post('/', upload.array('images', 5), booksController.createBook);
    booksRouter.post('/review', upload.array('images', 5), booksController.createReviewBook);
    booksRouter.post('/predictInfo', upload.single('image'), booksController.predictInfo);
    booksRouter.post('/generateDescription', generateResponse);
    booksRouter.post('/getBooksByCollection', booksController.getBooksByCollection);
    booksRouter.get('/fyp', booksController.forYouPage);
    booksRouter.get('/query', booksController.getBookByQuery);
    booksRouter.get('/query/filters', booksController.getBooksByQueryWithFilters);
    booksRouter.get('/search/:bookTitle', booksController.searchByBookTitle);
    booksRouter.get('/getFavoritesByUser/:userId', booksController.getFavoritesByUser);
    booksRouter.get('/:bookId', booksController.getBookById); // R
    booksRouter.put('/review/:bookId', upload.array('images', 5), booksController.updateReviewBook); // U
    booksRouter.put('/:bookId', upload.array('images', 5), booksController.updateBook); // U
    booksRouter.delete('/review/:bookId', booksController.deleteReviewBook);
    booksRouter.delete('/:bookId', booksController.deleteBook);
    return booksRouter;
};
