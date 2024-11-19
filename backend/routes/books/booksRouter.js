import { Router } from 'express'
import { BooksController } from '../../controllers/books/booksController.js'
import { upload } from '../../assets/config.js'
const booksRouter = Router()

booksRouter.get('/', BooksController.getAllBooks) // R
booksRouter.get('/review', BooksController.getAllReviewBooks)
// booksRouter.get('/safe', BooksController.getAllBooksSafe) // R
booksRouter.post('/', upload.array('images', 5), BooksController.createBook)

booksRouter.get('/query', BooksController.getBookByQuery)
booksRouter.get('/search/:bookTitle', BooksController.searchByBookTitle)
booksRouter.get('/:bookId', BooksController.getBookById) // R
booksRouter.put('/:bookId', upload.array('images', 5), BooksController.updateBook) // U

booksRouter.delete('/review/:bookId', BooksController.deleteReviewBook)
booksRouter.delete('/:bookId', BooksController.deleteBook)
booksRouter.post('/process_payment', BooksController.processPayment)
booksRouter.post('/getPreferenceId', BooksController.getPreferenceId)

booksRouter.post('/review', upload.array('images', 5), BooksController.createReviewBook)

export { booksRouter }
