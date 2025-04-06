import fs from 'node:fs/promises'
import { conversationObject } from '../conversationObject.js'

export class ConversationsModel {
  static async getAllConversations (l = 0) {
    try {
      const data = await fs.readFile('./models/conversations.json', 'utf-8')

      // Handle empty file case
      let conversations = []
      if (data.trim()) { // Only parse if data is not an empty string
        conversations = JSON.parse(data)
      }

      if (l !== 0) {
        conversations = conversations.slice(0, l)
      }
      return conversations.map(conversation => conversationObject(conversation))
    } catch (err) {
      console.error('Error reading conversations:', err)
      throw new Error('Error loading conversations data')
    }
  }

  static async getConversationsByUser (conversationsIds) {
    try {
      // Load all conversations from the JSON file
      const allConversations = await this.getAllConversations()
      // For
      // Filter conversations based on the provided conversationsIds
      const userConversations = allConversations.filter(conversation =>
        conversationsIds.includes(conversation._id)
      )
      return userConversations
    } catch (err) {
      console.error('Error fetching conversations for user:', err)
      throw new Error('Error fetching conversations')
    }
  }

  static async getConversationById (id) {
    try {
      const conversations = await this.getAllConversations()
      const conversation = conversations.find(conversation => conversation._id === id)
      if (!conversation) {
        return null
      }

      // Return conversation with limited public information
      return conversationObject(conversation)
    } catch (err) {
      console.error('Error reading conversation:', err)
      throw new Error(err)
    }
  }

  static async createConversation (data) {
    try {
      const conversations = await this.getAllConversations()
      // Crear valores por defecto
      const newConversation = conversationObject(data)

      conversations.push(newConversation)
      await fs.writeFile('./models/conversations.json', JSON.stringify(conversations, null, 2))
      return newConversation
    } catch (err) {
      return err
    }
  }

  static async deleteConversation (id) {
    try {
      const conversations = await this.getAllConversations()
      const conversationIndex = conversations.findIndex(conversation => conversation._id === id)
      if (conversationIndex === -1) {
        return null // Si no se encuentra la conversación, retorna null
      }
      conversations.splice(conversationIndex, 1)
      await fs.writeFile('./models/conversations.json', JSON.stringify(conversations, null, 2))
      return { conversation: 'Conversation deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting conversation:', err)
      throw new Error('Error deleting conversation')
    }
  }

  static async updateConversation (id, data) {
    try {
      const conversations = await this.getAllConversations()

      const conversationIndex = conversations.findIndex(conversation => conversation._id === id)
      if (conversationIndex === -1) {
        return null // Si no se encuentra la conversación, retorna null
      }

      // Actualiza los datos de la conversación
      Object.assign(conversations[conversationIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/conversations.json', JSON.stringify(conversations, null, 2))

      return true
    } catch (err) {
      console.error('Error updating conversation:', err)
      throw new Error(err)
    }
  }
}
