import { Router } from 'express'
import { BooksController } from '../../controllers/books/booksController.js'
import { upload } from '../../assets/config.js'
const booksRouter = Router()

booksRouter.get('/', BooksController.getAllBooks) // R
// booksRouter.get('/safe', BooksController.getAllBooksSafe) // R
booksRouter.post('/', upload.array('images', 5), BooksController.createBook)
booksRouter.get('/query', BooksController.getBookByQuery)
booksRouter.get('/search/:bookTitle', BooksController.searchByBookTitle)
booksRouter.get('/:bookId', BooksController.getBookById) // R
booksRouter.put('/:bookId', upload.array('images', 5), BooksController.updateBook) // U
booksRouter.delete('/:bookId', BooksController.deleteBook)
booksRouter.post('/process_payment', BooksController.processPayment)
booksRouter.post('/getPreferenceId', BooksController.getPreferenceId)
export { booksRouter }
