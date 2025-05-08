import fs from 'node:fs/promises'
import { conversationObject } from '../conversationObject.js'
import { ConversationObjectType } from '../../../types/conversation.js'
import { ID } from '../../../types/objects.js'
import {
  executeQuery,
  executeSingleResultQuery,
  DatabaseError
} from '../../../utils/dbUtils.js'
import { pool } from '../../../assets/config.js'

// __dirname is not available in ES modules, so we need to use import.meta.url

export class ConversationsModel {
  static async getAllConversations (): Promise<ConversationObjectType[]> {
    const data = await executeQuery(
      pool,
      () => pool.query('SELECT * FROM conversations;'),
      'Error getting conversations'
    )
    return data
  }

  static async getConversationById (id: ID): Promise<ConversationObjectType> {
    const conversation = await executeSingleResultQuery(
      pool,
      () => pool.query('SELECT * FROM conversations WHERE id = $1;', [id]),
      'Error getting conversation'
    )
    // Return conversation with limited public information
    return conversation
  }

  static async getConversationsByList (
    conversationsIds: ID[]
  ): Promise<ConversationObjectType[]> {
    // Load all conversations from the JSON file
    const conversations = await Promise.all(
      conversationsIds.map(id => {
        const conversation = this.getConversationById(id)
        return conversation
      })
    )
    return conversations
  }

  static async createConversation (
    data: Partial<ConversationObjectType>
  ): Promise<ConversationObjectType> {
    const fullConversation = conversationObject(data)
    const newConversation = await executeSingleResultQuery(
      pool,
      () =>
        pool.query(
          'INSERT INTO conversations (id, users, created_in, last_message) VALUES ($1, $2, $3, $4) RETURNING *;',
          [
            fullConversation.id,
            fullConversation.users,
            fullConversation.created_in,
            fullConversation.last_message
          ]
        ),
      'Error creating conversation'
    )

    return newConversation
  }

  static async deleteConversation (id: ID): Promise<{ message: string }> {
    const conversation = await this.getConversationById(id)
    if (!conversation) {
      throw new Error('No se encontró la conversación')
    }
    await executeQuery(
      pool,
      () => pool.query('DELETE FROM conversations WHERE id = $1;', [id]),
      'Error deleting conversation'
    )
    return { message: 'Conversación eliminada con éxito' }
  }

  static async updateConversation (
    id: ID,
    data: Partial<ConversationObjectType>
  ): Promise<ConversationObjectType> {
    try {
      const entries = Object.entries(data)
      const keys = entries.map(([key]) => key)
      const values = entries.map(([, value]) => value)

      const updateString = keys
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ')
      const query = `UPDATE conversations SET ${updateString} WHERE id = $${
        keys.length + 1
      } RETURNING *;`
      console.log('Query:', query)
      const result = await executeSingleResultQuery(
        pool,
        () => pool.query(query, [...values, id]),
        `Failed to update conversation with ID ${id}`
      )

      return result
    } catch (error) {
      if (error instanceof DatabaseError) {
        throw error
      }
      throw new DatabaseError(
        `Error updating conversation with ID ${id}`,
        error
      )
    }
  }
}
