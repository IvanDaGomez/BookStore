import { RequestHandler, Router } from 'express'
import { BooksController } from '../../controllers/books/booksController.js'
import { upload } from '../../assets/config.js'
import { generateResponse } from '../../controllers/separated/generateResponse.js'
import { IBooksModel, IUsersModel } from '../../types/models.js'
import { AIMode } from '../../controllers/books/aiMode.js'

export const createBooksRouter = ({
  BooksModel,
  UsersModel
}: {
  BooksModel: IBooksModel
  UsersModel: IUsersModel
}) => {
  const booksRouter = Router()
  const booksController = new BooksController({ BooksModel, UsersModel })
  booksRouter.get('/', booksController.getAllBooks as RequestHandler) // R
  booksRouter.get(
    '/review',
    booksController.getAllReviewBooks as RequestHandler
  )
  // booksRouter.get('/safe', booksController.getAllBooksSafe) // R
  booksRouter.post(
    '/',
    upload.array('images', 5),
    booksController.createBook as RequestHandler
  )
  booksRouter.post(
    '/review',
    upload.array('images', 5),
    booksController.createReviewBook as RequestHandler
  )
  booksRouter.post(
    '/ai/aiMode',
    upload.single('image'),
    AIMode as RequestHandler
  )
  booksRouter.post('/generateDescription', generateResponse as RequestHandler)
  booksRouter.post(
    '/getBooksByCollection',
    booksController.getBooksByCollection as RequestHandler
  )

  booksRouter.get('/fyp', booksController.forYouPage as RequestHandler)
  booksRouter.get('/query', booksController.getBookByQuery as RequestHandler)
  booksRouter.get(
    '/query/filters',
    booksController.getBooksByQueryWithFilters as RequestHandler
  )
  booksRouter.get(
    '/search/:book_title',
    booksController.searchByBookTitle as RequestHandler
  )
  booksRouter.get(
    '/getFavoritesByUser/:user_id',
    booksController.getFavoritesByUser as RequestHandler
  )

  booksRouter.get('/:book_id', booksController.getBookById as RequestHandler) // R
  booksRouter.get(
    '/idList/:ids',
    booksController.getBooksByIdList as RequestHandler
  ) // R
  booksRouter.put(
    '/review/:book_id',
    upload.array('images', 5),
    booksController.updateReviewBook as RequestHandler
  ) // U
  booksRouter.put(
    '/:bookId',
    upload.array('images', 5),
    booksController.updateBook as RequestHandler
  ) // U

  booksRouter.delete(
    '/review/:book_id',
    booksController.deleteReviewBook as RequestHandler
  )
  booksRouter.delete('/:book_id', booksController.deleteBook as RequestHandler)
  return booksRouter
}
