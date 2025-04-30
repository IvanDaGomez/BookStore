import fs from 'node:fs/promises'
import { transactionObject } from '../transactionObject.js'
import { TransactionObjectType } from '../../../types/transaction.js'
import { ID } from '../../../types/objects.js'
import path from 'node:path'
import { ShippingDetailsType } from '../../../types/shippingDetails.js'
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes.js'
import { TransactionInputType } from '../../../types/transactionInput.js'
// __dirname is not available in ES modules, so we need to use import.meta.url
import { __dirname } from '../../../assets/config.js'
const transactionsPath = path.join(__dirname, 'data', 'transactions.json')
const failureTransactionsPath = path.join(__dirname, 'data', 'failedTransactions.json')
class TransactionsModel {
  static async getAllTransactions (): Promise<TransactionObjectType[]> {
    const data = await fs.readFile(transactionsPath, 'utf-8')
    const transactions: TransactionObjectType[] = JSON.parse(data)
    return transactions.map(transaction => transactionObject(transaction))
  }

  static async getAllTransactionsByUser (id: ID): Promise<TransactionObjectType[]> {
    const transactions = await this.getAllTransactions()
    const filteredTransactions = transactions.filter(transaction => transaction.userId === id)
    if (!filteredTransactions) {
      throw new Error('No se encontraron transacciones para este usuario')
    }
    // Return transaction with limited public information
    return filteredTransactions.map(transaction => transactionObject(transaction))

  }
  
  static async getTransactionById (id: number): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    // el _id de la transacción como lo maneja mercadoPago es un número 
    const transaction = transactions.find(transaction => transaction._id === id)
    if (!transaction) {
      throw new Error('No se encontró la transacción')
    }
    return transactionObject(transaction)
  }

  static async createSuccessfullTransaction (data: Partial<TransactionInputType>): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    // Crear valores por defecto
    const newTransaction = transactionObject(data)
    transactions.push(newTransaction)
    await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2))
    return newTransaction
  }

  static async createFailureTransaction (data: Partial<TransactionInputType>): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    // Crear valores por defecto
    const newTransaction = transactionObject(data)
    transactions.push(newTransaction)
    await fs.writeFile(failureTransactionsPath, JSON.stringify(transactions, null, 2))
    return newTransaction
  }

  static async deleteTransaction (id: number): Promise<{ message: string }> {
    const transactions = await this.getAllTransactions()
    const transactionIndex = transactions.findIndex(transaction => transaction._id === id)
    if (transactionIndex === -1) {
      throw new Error('No se encontró la transacción')
    }
    transactions.splice(transactionIndex, 1)
    await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2))
    return { message: 'Transacción eliminada con éxito' } // Mensaje de éxito
  }

  static async updateTransaction (id: number, data: Partial<TransactionObjectType>): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    const transactionIndex = transactions.findIndex(transaction => transaction._id === id)
    if (transactionIndex === -1) {
      throw new Error('No se encontró la transacción')
    }
    Object.assign(transactions[transactionIndex], data)
    await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2))
    return transactions[transactionIndex]

  }

  static async getBookByTransactionId (id: string): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    const transaction = transactions.find(transaction => transaction.bookId === id)
    if (!transaction) {
      throw new Error('No se encontró la transacción')
    }
    return transactionObject(transaction)
  }
}

export { TransactionsModel }
