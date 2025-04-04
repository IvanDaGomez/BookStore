import fs from 'node:fs/promises'

const transactionObject = (data) => {
  return {
    _id: data._id || '', // ID único de la transacción
    userId: data.userId || '', // ID del usuario que realiza la compra
    sellerId: data.sellerId || '',
    bookId: data.bookId || '',
    fee_details: data.fee_details || [],
    description: data?.paymentDetails?.description || '',
    charges_details: data.charges_details || [],
    paymentLink: data?.paymentDetails?.paymentLink || '',
    transactionId: data.transactionId || '', // ID de la transacción en la plataforma de Efecty
    amount: data?.paymentDetails?.amount || 0, // Monto de la transacción
    paymentMethod: data?.paymentDetails?.method,
    installments: data.installments || 1,
    card: data.card || {},
    status: data.status || 'pending', // Estado del pago (pendiente, confirmado, entregado)
    createdIn: data.createdIn || new Date().toISOString(), // Fecha de creación de la transacción
    updatedIn: data.updatedIn || new Date().toISOString() // Fecha de la última actualización (cuando cambie el estado)
  }
}

class TransactionsModel {
  static async getAllTransactions () {
    try {
      const data = await fs.readFile('./models/transactions.json', 'utf-8')
      const transactions = JSON.parse(data)

      return transactions.map(transaction => transactionObject(transaction))
    } catch (err) {
      console.error('Error reading transactions:', err)
      throw new Error(err)
    }
  }

  static async getAllTransactionsByConversation (id) {
    try {
      const transactions = await this.getAllTransactions()
      const filteredTransactions = transactions.filter(transaction => transaction.conversationId === id)
      if (!filteredTransactions) {
        return null
      }

      // Return transaction with limited public information
      return filteredTransactions.map(transaction => transactionObject(transaction))
    } catch (err) {
      console.error('Error reading transaction:', err)
      throw new Error(err)
    }
  }

  static async getTransactionById (id) {
    try {
      const transactions = await this.getAllTransactions()
      const transaction = transactions.find(transaction => transaction._id === id)
      if (!transaction) {
        return null
      }

      // Return transaction with limited public information
      return transactionObject(transaction)
    } catch (err) {
      console.error('Error reading transaction:', err)
      throw new Error(err)
    }
  }

  static async createSuccessfullTransaction (data) {
    try {
      const transactions = await this.getAllTransactions()

      // Crear valores por defecto
      const newTransaction = transactionObject(data)

      transactions.push(newTransaction)
      await fs.writeFile('./models/transactions.json', JSON.stringify(transactions, null, 2))
      return newTransaction
    } catch (err) {
      return err
    }
  }

  static async createFailureTransaction (data) {
    try {
      const transactions = await this.getAllTransactions()

      // Crear valores por defecto
      const newTransaction = transactionObject(data)

      transactions.push(newTransaction)
      console.log('New transaction', newTransaction)
      console.log('Transacciones:', transactions)
      await fs.writeFile('./models/failedTransactions.json', JSON.stringify(transactions, null, 2))
      return newTransaction
    } catch (err) {
      return err
    }
  }

  static async deleteTransaction (id) {
    try {
      const transactions = await this.getAllTransactions()
      const transactionIndex = transactions.findIndex(transaction => transaction._id === id)
      if (transactionIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      transactions.splice(transactionIndex, 1)
      await fs.writeFile('./models/transactions.json', JSON.stringify(transactions, null, 2))
      return { transaction: 'Transaction deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting transaction:', err)
      throw new Error('Error deleting transaction')
    }
  }

  static async updateTransaction (id, data) {
    try {
      const transactions = await this.getAllTransactions()

      const transactionIndex = transactions.findIndex(transaction => transaction._id === id)
      if (transactionIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }

      // Actualiza los datos del usuario
      Object.assign(transactions[transactionIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/transactions.json', JSON.stringify(transactions, null, 2))

      return true
    } catch (err) {
      console.error('Error updating transaction:', err)
      throw new Error(err)
    }
  }

  static async getBookByTransactionId (id) {
    try {
      const transactions = await this.getAllTransactions()
      const transaction = transactions.find(transaction => transaction.bookId === id)
      if (!transaction) {
        return null
      }

      // Return transaction with limited public information
      return transactionObject(transaction)
    } catch (err) {
      console.error('Error reading transaction:', err)
      throw new Error(err)
    }
  }
}

export { TransactionsModel }
