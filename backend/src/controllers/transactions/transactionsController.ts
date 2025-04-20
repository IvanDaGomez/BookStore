import { validateTransaction } from '../../assets/validate.js'
import { ITransactionsModel } from '../../types/models.js'
import express from 'express'
import { ID } from '../../types/objects.js'
import { TransactionObjectType } from '../../types/transaction.js'
// TODO
export class TransactionsController {
  private TransactionsModel: ITransactionsModel
  constructor ({ TransactionsModel }: { TransactionsModel: ITransactionsModel }) {
    this.TransactionsModel = TransactionsModel
  }

  // Obtener todas las transacciones
  getAllTransactions = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const transactions = await this.TransactionsModel.getAllTransactions()
      res.json(transactions)
    } catch (err) {
      next(err)
    }
  }

  getTransactionsByUser = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const userId = req.params.userId as ID | undefined
      if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' })
      }
      const transaction = await this.TransactionsModel.getAllTransactionsByUser(userId)
      res.json(transaction)
    } catch (err) {
      next(err)
    }
  }

  getTransactionById = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const transactionId = req.params.transactionId ? parseInt(req.params.transactionId, 10) : undefined
      if (!transactionId) {
        return res.status(400).json({ error: 'ID de transacción no proporcionado' })
      }
      const transaction = await this.TransactionsModel.getTransactionById(transactionId)

      res.json(transaction)
    } catch (err) {
      next(err)
    }
  }

  // Filtrar transaccións
  createTransaction = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    const data = req.body as TransactionObjectType

    // Validación
    const validated = validateTransaction(data)
    if (!validated.success) {
      return res.status(400).json({ error: validated.error })
    }
    // TODO: No se si el id es necesario, ya que se genera en mercadoPago
    data._id = crypto.randomUUID()
    let transaction

    if (data.status === 'approved') {
      transaction = await this.TransactionsModel.createSuccessfullTransaction(data)
    } else {
      transaction = await this.TransactionsModel.createFailureTransaction(data)
    }

    res.json(transaction)
  }

  deleteTransaction = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const transactionId = req.params.transactionId ? parseInt(req.params.transactionId, 10) : undefined
      if (!transactionId) {
        return res.status(400).json({ error: 'ID de transacción no proporcionado' })
      }

      // Obtener los detalles del transacción para encontrar al vendedor (idVendedor)
      const transaction = await this.TransactionsModel.getTransactionById(transactionId)
      if (!transaction) {
        return res.status(404).json({ error: 'Transacción no encontrada' })
      }
      // Verificar si el usuario es el vendedor
      const userId = transaction.userId

      // Eliminar el transacción de la base de datos
      const result = await this.TransactionsModel.deleteTransaction(transactionId)

      res.json(result)
    } catch (err) {
      next(err)
    }
  }
}
