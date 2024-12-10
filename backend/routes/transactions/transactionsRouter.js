import { Router } from 'express'
import { TransactionsController } from '../../controllers/transactions/transactionsController.js'

const transactionsRouter = Router()

transactionsRouter.get('/', TransactionsController.getAllTransactions)
transactionsRouter.get('/transactionById/:transactionId', TransactionsController.getTransactionById)
transactionsRouter.get('/transactionByUser', TransactionsController.getTransactionsByUser)
transactionsRouter.post('/', TransactionsController.createTransaction)
transactionsRouter.delete('/:transactionId', TransactionsController.deleteTransaction)

export { transactionsRouter }
