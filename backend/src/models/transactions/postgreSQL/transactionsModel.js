import { pool } from '../../../assets/config.js'
import { transactionObject } from '../transactionObject.js'


export class TransactionsModel {
  static async getAllTransactions () {
    try {
      const { rows } = await pool.query('SELECT * FROM transactions')
      return rows
    } catch (err) {
      console.error('Error reading transactions:', err)
      throw new Error('Error fetching transactions')
    }
  }

  static async getTransactionById (id) {
    try {
      const { rows } = await pool.query('SELECT * FROM transactions WHERE id = $1', [id])
      return rows[0] || null
    } catch (err) {
      console.error('Error reading transaction:', err)
      throw new Error('Error fetching transaction')
    }
  }

  static async createTransaction (data) {
    try {
      const query = `INSERT INTO transactions (user_id, seller_id, book_id, amount, status, created_in, updated_in)
                     VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *`
      const values = [data.userId, data.sellerId, data.bookId, data.amount, data.status || 'pending']
      const { rows } = await pool.query(query, values)
      return rows[0]
    } catch (err) {
      console.error('Error creating transaction:', err)
      throw new Error('Error creating transaction')
    }
  }

  static async updateTransaction (id, data) {
    try {
      const query = 'UPDATE transactions SET status = $1, updated_in = NOW() WHERE id = $2 RETURNING *'
      const values = [data.status, id]
      const { rows } = await pool.query(query, values)
      return rows[0] || null
    } catch (err) {
      console.error('Error updating transaction:', err)
      throw new Error('Error updating transaction')
    }
  }

  static async deleteTransaction (id) {
    try {
      await pool.query('DELETE FROM transactions WHERE id = $1', [id])
      return { message: 'Transaction deleted successfully' }
    } catch (err) {
      console.error('Error deleting transaction:', err)
      throw new Error('Error deleting transaction')
    }
  }
}
