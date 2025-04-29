import { RequestHandler, Router } from 'express'
import { TransactionsController } from '../../controllers/transactions/transactionsController.js'
import { IBooksModel, ITransactionsModel, IUsersModel } from '../../types/models.js'

export const createTransactionsRouter = ({ TransactionsModel, UsersModel, BooksModel }: 
  { TransactionsModel: ITransactionsModel
    UsersModel: IUsersModel
    BooksModel: IBooksModel
  }) => {
  const transactionsController = new TransactionsController({ TransactionsModel, UsersModel, BooksModel })
  const transactionsRouter = Router()

  transactionsRouter.get('/', transactionsController.getAllTransactions as RequestHandler)
  transactionsRouter.get('/transactionById/:transactionId', transactionsController.getTransactionById as RequestHandler)
  transactionsRouter.use('/mercadoPagoWebHooks', transactionsController.MercadoPagoWebhooks as RequestHandler)
  transactionsRouter.post('/process_payment', transactionsController.processPayment as RequestHandler)
  transactionsRouter.post('/pay-with-balance', transactionsController.payWithBalance as RequestHandler)
  transactionsRouter.post('/getPreferenceId', transactionsController.getPreferenceId as RequestHandler)
  transactionsRouter.get('/transactionByUser/:userId', transactionsController.getTransactionsByUser as RequestHandler)

  transactionsRouter.post('/', transactionsController.createTransaction as RequestHandler)
  transactionsRouter.delete('/:transactionId', transactionsController.deleteTransaction as RequestHandler)
  return transactionsRouter
}
