import { Router } from 'express';
import { TransactionsController } from '../../controllers/transactions/transactionsController.js';
export const createTransactionsRouter = ({ TransactionsModel }) => {
    const transactionsController = new TransactionsController({ TransactionsModel });
    const transactionsRouter = Router();
    transactionsRouter.get('/', transactionsController.getAllTransactions);
    transactionsRouter.get('/transactionById/:transactionId', transactionsController.getTransactionById);
    transactionsRouter.get('/transactionByUser', transactionsController.getTransactionsByUser);
    transactionsRouter.post('/', transactionsController.createTransaction);
    transactionsRouter.delete('/:transactionId', transactionsController.deleteTransaction);
    return transactionsRouter;
};
