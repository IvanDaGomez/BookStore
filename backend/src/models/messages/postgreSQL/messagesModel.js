import { pool } from '../../../assets/config.js'
import { messageObject } from '../messageObject.js'
import crypto from 'node:crypto'
/*

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
); */

export class MessagesModel {
  static async getAllMessages () {
    try {
      const result = await pool.query('SELECT * FROM messages')
      return result.rows.map(message => messageObject(message))
    } catch (err) {
      console.error('Error retrieving messages:', err)
      throw new Error('Error loading messages data')
    }
  }

  static async getAllMessagesByConversation (id) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE conversation_id = $1', [id])
      if (result.rows.length === 0) {
        return null
      }
      return result.rows.map(message => messageObject(message))
    } catch (err) {
      console.error('Error retrieving messages by conversation:', err)
      throw new Error('Error retrieving messages by conversation')
    }
  }

  static async getMessageById (id) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id])
      if (result.rows.length === 0) {
        return null
      }
      return messageObject(result.rows[0]) // The database returns an array of rows, so we take the first one
    } catch (err) {
      console.error('Error retrieving message by ID:', err)
      throw new Error('Error retrieving message by ID')
    }
  }

  static async sendMessage (data) {
    try {
      data._id = crypto.randomUUID()
      const time = new Date()
      data.createdIn = time.toISOString()
      const newMessage = messageObject(data)

      await pool.query(
        `INSERT INTO messages (id, user_id, message, conversation_id, created_in, read)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newMessage._id, newMessage.userId, newMessage.message, newMessage.conversationId, newMessage.createdIn, newMessage.read]
      )

      return true
    } catch (err) {
      console.error('Error sending message:', err)
      return false
    }
  }

  static async deleteMessage (id) {
    try {
      await pool.query('DELETE FROM messages WHERE id = $1', [id])
      return true
    } catch (err) {
      console.error('Error deleting message:', err)
      return false
    }
  }

  static async updateMessage (id, data) {
    try {
      await pool.query(
        'UPDATE messages SET message = $1, read = $2 WHERE id = $3 RETURNING *',
        [data.message, data.read, id]
      )

      return true
    } catch (err) {
      console.error('Error updating message:', err)
      return false
    }
  }
}
