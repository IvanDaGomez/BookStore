import fs from 'node:fs/promises'
import { messageObject } from '../messageObject.js'
import { MessageObjectType } from '../../../types/message.js'
import { ID } from '../../../types/objects.js'
import { executeQuery, DatabaseError, executeSingleResultQuery } from '../../../utils/dbUtils.js';
import { pool } from '../../../assets/config.js';

// __dirname is not available in ES modules, so we need to use import.meta.url


class MessagesModel {
  static async getAllMessages (): Promise<MessageObjectType[]> {
    try {
      const messages = await executeQuery(
        pool,
        () => pool.query('SELECT * FROM messages;'),
        'Failed to fetch books from database'
      );

      return messages;
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError('Error retrieving books', error);
    }
  }

  static async getAllMessagesByConversation (id: ID): Promise<MessageObjectType[]> {
      const data: MessageObjectType[] = await executeQuery(
        pool,
        () => pool.query('SELECT * FROM messages WHERE conversationId = $1;', [id]),
        'Failed to fetch messages from PostgreSQL'
      )
  
      return data
    }

  static async getMessageById (id: ID): Promise<MessageObjectType> {
    const messages = await executeSingleResultQuery(
      pool,
      () => pool.query('SELECT * FROM messages WHERE id = $1;', [id]),
      'Failed to fetch message from PostgreSQL'
    )
    return messages
  }

  static async sendMessage (data: Partial<MessageObjectType>): Promise<MessageObjectType> {

    const message = messageObject(data)
    await executeQuery(
      pool, 
      () => pool.query(
        `INSERT INTO messages (id, conversationId, userId, message, createdIn, read) 
        VALUES ($1, $2, $3, $4, $5, $6);`,
        [
          message.id,
          message.conversationId,
          message.userId,
          message.message,
          message.createdIn,
          message.read
        ]
      ),
      'Error creating message'
    )
    return message
  }

  static async deleteMessage (id: ID): Promise<{ message: string }> {
    // Check if the message exists
    try {
      const result = await executeSingleResultQuery(
        pool,
        () => pool.query('SELECT * FROM messages WHERE id = $1;', [id]),
        'Failed to find message to delete'
      );
      if (!result) throw new Error('Message not found');
      await executeQuery(
        pool,
        () => pool.query('DELETE FROM messages WHERE id = $1;', [id]),
        'Error deleting message'
      )
      return { message: 'Mensaje eliminado con éxito' } // Mensaje de éxito
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(`Error deleting message with ID ${id}`, error);
    }
  }

  static async updateMessage (id: ID, data: Partial<MessageObjectType>): Promise<MessageObjectType> {
    try {
      const [keys, values] = Object.entries(data)
      const updateString = keys.reduce((last, key, index) => {
        const prefix = index === 0 ? '' : ', '
        return `${last}${prefix}${key} = $${index + 1}`
      })
      
      const result = await executeSingleResultQuery(
        pool,
        () => pool.query(
          `UPDATE messages SET ${updateString} WHERE ID = $${keys.length + 1} RETURNING *;`,
          [...values, id]
        ),
        `Failed to update message with ID ${id}`
      );

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error;
      }
      throw new DatabaseError(`Error updating message with ID ${id}`, error);
    }
  }
}

export { MessagesModel }
