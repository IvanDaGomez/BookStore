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
import { WithdrawMoneyType } from '../../../types/withdrawMoney.js'
const transactionsPath = path.join(__dirname, 'data', 'transactions.json')
const failureTransactionsPath = path.join(__dirname, 'data', 'failedTransactions.json')
const withdrawTransactionsPath = path.join(__dirname, 'data', 'withdrawTransactions.json')
class TransactionsModel {
  static async getAllTransactions (): Promise<TransactionObjectType[]> {
    const [successData, failureData] = await Promise.all([
      fs.readFile(transactionsPath, 'utf-8'),
      fs.readFile(failureTransactionsPath, 'utf-8')
    ])
    const successTransaction: TransactionObjectType[] = JSON.parse(successData)
    const failureTransaction: TransactionObjectType[] = JSON.parse(failureData)
    return [...successTransaction, ...failureTransaction].map(transaction => transactionObject(transaction))
  }

  static async getAllTransactionsByUser (id: ID): Promise<TransactionObjectType[]> {
    const transactions = await this.getAllTransactions()
    const filteredTransactions = transactions.filter(transaction => transaction.userId === id || transaction.sellerId === id)
    if (!filteredTransactions) {
      throw new Error('No se encontraron transacciones para este usuario')
    }
    // Return transaction with limited public information
    return filteredTransactions.map(transaction => transactionObject(transaction))
  }
  
  static async getTransactionById (id: number): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    // el id de la transacción como lo maneja mercadoPago es un número 
    const transaction = transactions.find(transaction => transaction.id === id)
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
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id)
    if (transactionIndex === -1) {
      throw new Error('No se encontró la transacción')
    }
    transactions.splice(transactionIndex, 1)
    await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2))
    return { message: 'Transacción eliminada con éxito' } // Mensaje de éxito
  }
  static async updateFailureTransaction (id: number, data: Partial<TransactionObjectType>): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id)
    if (transactionIndex === -1) {
      throw new Error('No se encontró la transacción')
    }
    const transaction = transactions[transactionIndex]
    Object.assign(transaction, data)
    if (transaction.status === 'approved') {
      const successTransactions = await this.getAllTransactions()
      const successTransactionIndex = successTransactions.findIndex(transaction => transaction.id === id)
      if (successTransactionIndex !== -1) {
        successTransactions.splice(successTransactionIndex, 1)
        await fs.writeFile(transactionsPath, JSON.stringify(successTransactions, null, 2))
      }
    }
    transactions.splice(transactionIndex, 1)
    await fs.writeFile(failureTransactionsPath, JSON.stringify(transactions, null, 2))
    return transactionObject(transaction)
  }
  static async updateSuccessfullTransaction (id: number, data: Partial<TransactionObjectType>): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id)
    if (transactionIndex === -1) {
      throw new Error('No se encontró la transacción')
    }
    const transaction = transactions[transactionIndex]
    Object.assign(transaction, data)
    if (transaction.status === 'failed') {
      const failureTransactions = await this.getAllTransactions()
      const failureTransactionIndex = failureTransactions.findIndex(transaction => transaction.id === id)
      if (failureTransactionIndex !== -1) {
        failureTransactions.splice(failureTransactionIndex, 1)
        await fs.writeFile(failureTransactionsPath, JSON.stringify(failureTransactions, null, 2))
      }
    }
    transactions.splice(transactionIndex, 1)
    await fs.writeFile(transactionsPath, JSON.stringify(transactions, null, 2))
    return transactionObject(transaction)
  }

  static async getBookByTransactionId (id: string): Promise<TransactionObjectType> {
    const transactions = await this.getAllTransactions()
    const transaction = transactions.find(transaction => transaction.bookId === id)
    if (!transaction) {
      throw new Error('No se encontró la transacción')
    }
    return transactionObject(transaction)
  }

  static async getAllWithdrawTransactions(): Promise<WithdrawMoneyType[]> {
    const withdrawData = await fs.readFile(withdrawTransactionsPath, 'utf-8')
    const withdrawTransaction: WithdrawMoneyType[] = JSON.parse(withdrawData)
    return withdrawTransaction
  }
  static async createWithdrawTransaction (data: WithdrawMoneyType): Promise<{ message: string }> {
    const transactions = await this.getAllWithdrawTransactions()
    data.status = 'pending'
    transactions.push(data)
    await fs.writeFile(withdrawTransactionsPath, JSON.stringify(transactions, null, 2))
    return { message: 'Transacción de retiro creada con éxito' }
  }
  static async markWithdrawTransaction (userId: string) {
    const transactions = await this.getAllWithdrawTransactions()
    const transactionIndex = transactions.findIndex(transaction => transaction.userId === userId)
    if (transactionIndex === -1) {
      throw new Error('No se encontró la transacción')
    }
    const transaction = transactions[transactionIndex]
    Object.assign(transaction, { status: 'approved' })
    await fs.writeFile(withdrawTransactionsPath, JSON.stringify(transactions, null, 2))
  }
}

export { TransactionsModel }
