import { TransactionsModel } from '../../models/transactions/local/transactionsModel.js'
import { validateTransaction } from '../../assets/validate.js'

export class TransactionsController {
  static async getAllTransactions (req, res) {
    try {
      const transactions = await TransactionsModel.getAllTransactions()
      if (!transactions) {
        res.status(500).json({ error: 'Error al leer las transacciones' })
      }
      res.json(transactions)
    } catch (err) {
      console.error('Error al leer las transacciones:', err)
      res.status(500).json({ error: 'Error al leer las transacciones' })
    }
  }

  static async getTransactionsByUser (req, res) {
    try {
      const { userId } = req.params
      const transaction = await TransactionsModel.getTransactionsByUser(userId)
      if (!transaction) {
        return res.status(404).json({ error: 'Conversación no encontrada' })
      }
      res.json({ transaction })
    } catch (err) {
      console.error('Error al leer el usuario:', err)
      res.status(500).json({ error: 'Error al leer el usuario' })
    }
  }

  static async getTransactionById (req, res) {
    try {
      const { transactionId } = req.params
      const transaction = await TransactionsModel.getTransactionById(transactionId)
      if (!transaction) {
        return res.status(404).json({ error: 'Transacción no encontrada' })
      }
      res.json({ transaction })
    } catch (err) {
      console.error('Error al leer la transacción:', err)
      res.status(500).json({ error: 'Error al leer la transacción' })
    }
  }

  // Filtrar transaccións
  static async createTransaction (req, res) {
    const data = req.body

    // Validación
    const validated = validateTransaction(data)
    if (!validated.success) {
      console.log('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    // Asignar un ID único al transacción
    data._id = crypto.randomUUID()
    const time = new Date()
    data.createdIn = time
    let transaction
    // Crear el transacción en la base de datos
    if (data.status === 'approved') {
      transaction = await TransactionsModel.createSuccessfullTransaction(data)
    } else {
      transaction = await TransactionsModel.createFailureTransaction(data)
    }

    if (typeof transaction === 'string' && transaction.startsWith('Error')) {
      return res.status(500).json({ error: transaction })
    }
    if (!transaction) {
      return res.status(500).json({ error: 'Error al crear transacción' })
    }

    // Si todo es exitoso, devolver el transacción creado
    res.send({ transaction })
  }

  static async deleteTransaction (req, res) {
    try {
      const { transactionId } = req.params

      // Obtener los detalles del transacción para encontrar al vendedor (idVendedor)
      const transaction = await TransactionsModel.getTransactionById(transactionId)
      if (!transaction) {
        return res.status(404).json({ error: 'Transacción no encontrada' })
      }

      // Eliminar el transacción de la base de datos
      const result = await TransactionsModel.deleteTransaction(transactionId)
      if (!result) {
        return res.status(404).json({ error: 'Transacción no encontrada' })
      }

      res.json({ transaction: 'Transacción eliminada con éxito' })
    } catch (err) {
      console.error('Error al eliminar la transacción:', err)
      res.status(500).json({ error: 'Error al eliminar la transacción' })
    }
  }
}
