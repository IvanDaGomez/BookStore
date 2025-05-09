import { transactionObject } from '../transactionObject.js'
import { TransactionObjectType } from '../../../types/transaction.js'
import { ID } from '../../../types/objects.js'
import { ShippingDetailsType } from '../../../types/shippingDetails.js'
import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes.js'
import { TransactionInputType } from '../../../types/transactionInput.js'
import { WithdrawMoneyType } from '../../../types/withdrawMoney.js'
import {
  executeQuery,
  executeSingleResultQuery
} from '../../../utils/dbUtils.js'
import { pool } from '../../../assets/config.js'

class TransactionsModel {
  static async getAllTransactions (): Promise<TransactionObjectType[]> {
    const transactions: TransactionObjectType[] = await executeQuery(
      pool,
      () => pool.query('SELECT * FROM transactions LIMIT 1000;'),
      'Error getting transactions'
    )
    return transactions
  }

  static async getAllTransactionsByUser (
    id: ID
  ): Promise<TransactionObjectType[]> {
    const transactions: TransactionObjectType[] = await executeQuery(
      pool,
      () =>
        pool.query(
          'SELECT * FROM transactions WHERE user_id = $1 OR seller_id = $1;',
          [id]
        ),
      'Error getting transactions'
    )
    return transactions
  }

  static async getTransactionById (id: number): Promise<TransactionObjectType> {
    const transaction = await executeSingleResultQuery(
      pool,
      () => pool.query(`SELECT * FROM transactions WHERE id = $1;`, [id]),
      'Transaction not found'
    )
    return transaction
  }

  static async createSuccessfullTransaction (
    data: Partial<TransactionInputType>
  ): Promise<TransactionObjectType> {
    const newTransaction = transactionObject(data)

    await executeQuery(
      pool,
      () =>
        pool.query(
          `
        INSERT INTO transactions (id, user_id, seller_id, book_id, status, response, shipping_details, orden)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [
            newTransaction.id,
            newTransaction.user_id,
            newTransaction.seller_id,
            newTransaction.book_id,
            newTransaction.status,
            JSON.stringify(newTransaction.response as PaymentResponse),
            JSON.stringify(
              newTransaction.shipping_details as ShippingDetailsType
            )
          ]
        ),
      'Error creating transaction'
    )
    return newTransaction
  }

  static async deleteTransaction (id: number): Promise<{ message: string }> {
    const transaction = await this.getTransactionById(id)
    if (!transaction) {
      throw new Error()
    }
    await executeQuery(
      pool,
      () => pool.query('DELETE FROM transactions WHERE id = $1;', [id]),
      'Error deleting transaction'
    )
    return { message: 'Transacción eliminada con éxito' } // Mensaje de éxito
  }
  static async updateSuccessfullTransaction (
    id: number,
    data: Partial<TransactionObjectType>
  ): Promise<TransactionObjectType> {
    const transaction = await this.getTransactionById(id)
    if (!transaction) {
      throw new Error()
    }
    const [keys, values] = Object.entries(data)
    const updateString = keys.reduce((last, key, index) => {
      const prefix = index === 0 ? '' : ', '
      return `${last}${prefix}${key} = $${index + 1}`
    })

    const result = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          `UPDATE transactions SET ${updateString} WHERE id = $${
            keys.length + 1
          } RETURNING *`,
          [...values, id]
        ),
      `Failed to update transaction with ID ${id}`
    )

    return result
  }

  static async getBookByTransactionId (
    id: string
  ): Promise<TransactionObjectType> {
    const transaction = await executeSingleResultQuery(
      pool,
      () => pool.query('SELECT * FROM transactions WHERE book_id = $1;', [id]),
      'Transaction not found'
    )
    return transaction
  }

  static async getAllWithdrawTransactions (): Promise<WithdrawMoneyType[]> {
    const withdrawData = await executeQuery(
      pool,
      () => pool.query('SELECT * FROM withdrawals;'),
      'Error getting withdraw transactions'
    )
    return withdrawData
  }
  static async createWithdrawTransaction (
    data: WithdrawMoneyType
  ): Promise<{ message: string }> {
    data.status = 'pending'
    await executeQuery(
      pool,
      () =>
        pool.query(
          `
        INSERT INTO withdrawals (id, user_id, numero_cuenta, bank, phone_number, monto, fecha, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
          [
            data.id,
            data.user_id,
            data.numero_cuenta,
            data.bank,
            data.phone_number,
            data.monto,
            data.fecha,
            data.status
          ]
        ),
      'Error creating withdraw transaction'
    )
    return { message: 'Transacción de retiro creada con éxito' }
  }
  static async markWithdrawTransaction (id: ID): Promise<WithdrawMoneyType> {
    const transaction: WithdrawMoneyType = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          `UPDATE transactions SET status = 'approved' WHERE id = $1 RETURNING *;`,
          [id]
        ),
      'Error marking withdraw transaction'
    )
    return transaction
  }
}

export { TransactionsModel }
