import { RequestHandler, Router } from 'express'
import { TransactionsController } from '../../controllers/transactions/transactionsController.js'
import { ITransactionsModel } from '../../types/models.js'

export const createTransactionsRouter = ({ TransactionsModel }: { TransactionsModel: ITransactionsModel}) => {
  const transactionsController = new TransactionsController({ TransactionsModel })
  const transactionsRouter = Router()

  transactionsRouter.get('/', transactionsController.getAllTransactions as RequestHandler)
  transactionsRouter.get('/transactionById/:transactionId', transactionsController.getTransactionById as RequestHandler)
  transactionsRouter.get('/transactionByUser', transactionsController.getTransactionsByUser as RequestHandler)
  transactionsRouter.post('/', transactionsController.createTransaction as RequestHandler)
  transactionsRouter.delete('/:transactionId', transactionsController.deleteTransaction as RequestHandler)
  return transactionsRouter
}
