import { Pool } from 'pg'

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  user: 'tu_usuario',
  host: 'tu_host',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432
})
/*

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  message TEXT NOT NULL,
  conversation_id TEXT NOT NULL,
  created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
); */

const messageObject = (data) => ({
  _id: data.id || '',
  userId: data.user_id || '',
  message: data.message || '',
  conversationId: data.conversation_id || '',
  createdIn: data.created_in || new Date().toISOString(),
  read: data.read || false
})

export class MessagesModel {
  static async getAllMessages () {
    try {
      const result = await pool.query('SELECT * FROM messages')
      return result.rows.map(messageObject)
    } catch (err) {
      console.error('Error retrieving messages:', err)
      throw new Error('Error loading messages data')
    }
  }

  static async getAllMessagesByConversation (id) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE conversation_id = $1', [id])
      return result.rows.map(messageObject)
    } catch (err) {
      console.error('Error retrieving messages by conversation:', err)
      throw new Error('Error retrieving messages by conversation')
    }
  }

  static async getMessageById (id) {
    try {
      const result = await pool.query('SELECT * FROM messages WHERE id = $1', [id])
      return result.rows.length ? messageObject(result.rows[0]) : null
    } catch (err) {
      console.error('Error retrieving message by ID:', err)
      throw new Error('Error retrieving message by ID')
    }
  }

  static async sendMessage (data) {
    try {
      const newMessage = messageObject(data)

      const result = await pool.query(
        `INSERT INTO messages (user_id, message, conversation_id, created_in, read)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [newMessage.userId, newMessage.message, newMessage.conversationId, newMessage.createdIn, newMessage.read]
      )

      return messageObject(result.rows[0])
    } catch (err) {
      console.error('Error sending message:', err)
      throw new Error('Error sending message')
    }
  }

  static async deleteMessage (id) {
    try {
      const result = await pool.query('DELETE FROM messages WHERE id = $1 RETURNING *', [id])
      return result.rowCount > 0 ? { message: 'Message deleted successfully' } : null
    } catch (err) {
      console.error('Error deleting message:', err)
      throw new Error('Error deleting message')
    }
  }

  static async updateMessage (id, data) {
    try {
      const result = await pool.query(
        'UPDATE messages SET message = $1, read = $2 WHERE id = $3 RETURNING *',
        [data.message, data.read, id]
      )

      return result.rowCount > 0 ? messageObject(result.rows[0]) : null
    } catch (err) {
      console.error('Error updating message:', err)
      throw new Error('Error updating message')
    }
  }
}
