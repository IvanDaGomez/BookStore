import { RequestHandler, Router } from 'express'
import { TransactionsController } from '../../controllers/transactions/transactionsController.js'
import {
  IBooksModel,
  ITransactionsModel,
  IUsersModel
} from '../../types/models.js'

export const createTransactionsRouter = ({
  TransactionsModel,
  UsersModel,
  BooksModel
}: {
  TransactionsModel: ITransactionsModel
  UsersModel: IUsersModel
  BooksModel: IBooksModel
}) => {
  const transactionsController = new TransactionsController({
    TransactionsModel,
    UsersModel,
    BooksModel
  })
  const transactionsRouter = Router()

  transactionsRouter.get(
    '/',
    transactionsController.getAllTransactions as RequestHandler
  )
  transactionsRouter.get(
    '/transactionById/:transaction_id',
    transactionsController.getTransactionById as RequestHandler
  )
  transactionsRouter.use(
    '/mercadoPagoWebHooks',
    transactionsController.MercadoPagoWebhooks as RequestHandler
  )
  transactionsRouter.post(
    '/process_payment',
    transactionsController.processPayment as RequestHandler
  )
  transactionsRouter.post(
    '/pay-with-balance',
    transactionsController.payWithBalance as RequestHandler
  )
  transactionsRouter.post(
    '/getBookPreferenceId',
    transactionsController.getPreferenceId as RequestHandler
  )

  transactionsRouter.get(
    '/withdrawMoney',
    transactionsController.getWithdrawMoney as RequestHandler
  )
  transactionsRouter.post(
    '/withdrawMoney',
    transactionsController.withdrawMoney as RequestHandler
  )
  transactionsRouter.put(
    '/withdrawMoney/:user_id',
    transactionsController.updateWithdrawMoney as RequestHandler
  )
  transactionsRouter.get(
    '/getSafeCode/:user_id',
    transactionsController.getSafeCode as RequestHandler
  )
  // transactionsRouter.post('/getAddMoneyPreferenceId', transactionsController.getPreferenceIdByUser as RequestHandler)
  transactionsRouter.get(
    '/transactionByUser/:user_id',
    transactionsController.getTransactionsByUser as RequestHandler
  )

  transactionsRouter.post(
    '/',
    transactionsController.createTransaction as RequestHandler
  )
  transactionsRouter.delete(
    '/:transaction_id',
    transactionsController.deleteTransaction as RequestHandler
  )
  return transactionsRouter
}
