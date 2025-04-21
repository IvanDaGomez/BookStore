import fs from 'node:fs/promises'
import { conversationObject } from '../conversationObject.js'
import { ConversationObjectType } from '../../../types/conversation.js'
import { ID } from '../../../types/objects.js'
import path from 'node:path'
// __dirname is not available in ES modules, so we need to use import.meta.url

const conversationPath = path.join('.', 'data', 'conversations.json')
export class ConversationsModel {
  static async getAllConversations (l: number = 0): Promise<ConversationObjectType[]> {
    const data = await fs.readFile(conversationPath, 'utf-8')
    // Handle empty file case
    let conversations: ConversationObjectType[] = []
    if (!data.trim()) { // Only parse if data is not an empty string
      throw new Error('No se encontraron conversaciones')
    }
    conversations = JSON.parse(data)
    if (l !== 0) {
      conversations = conversations.slice(0, l)
    }
    return conversations.map(conversation => conversationObject(conversation))
  }

  static async getConversationsByList (conversationsIds: ID[]): Promise<ConversationObjectType[]> {
    // Load all conversations from the JSON file
    const allConversations = await this.getAllConversations()
    // For
    // Filter conversations based on the provided conversationsIds
    const userConversations = allConversations.filter(conversation =>
      conversationsIds.includes(conversation._id)
    )
    if (userConversations.length === 0) {
      throw new Error('No se encontraron conversaciones')
    }
    return userConversations

  }

  static async getConversationById (id: ID): Promise<ConversationObjectType> {
    const conversations = await this.getAllConversations()
    const conversation = conversations.find(conversation => conversation._id === id)
    if (!conversation) {
      throw new Error('No se encontró la conversación')
    }
    // Return conversation with limited public information
    return conversationObject(conversation)

  }

  static async createConversation (data: Partial<ConversationObjectType>): Promise<ConversationObjectType> {
    const conversations = await this.getAllConversations()
    // Crear valores por defecto
    const newConversation = conversationObject(data)
    conversations.push(newConversation)
    await fs.writeFile(conversationPath, JSON.stringify(conversations, null, 2))
    return newConversation

  }

  static async deleteConversation (id: ID): Promise<{ message: string }> {

      const conversations = await this.getAllConversations()
      const conversationIndex = conversations.findIndex(conversation => conversation._id === id)
      if (conversationIndex === -1) {
        throw new Error('No se encontró la conversación')
      }
      conversations.splice(conversationIndex, 1)
      await fs.writeFile(conversationPath, JSON.stringify(conversations, null, 2))
      return { message: 'Conversación eliminada con éxito' }

  }

  static async updateConversation (id: ID, data: Partial<ConversationObjectType>): Promise<ConversationObjectType> {

    const conversations = await this.getAllConversations()
    const conversationIndex = conversations.findIndex(conversation => conversation._id === id)
    if (conversationIndex === -1) {
      throw new Error('No se encontró la conversación')
    }
    // Actualiza los datos de la conversación
    Object.assign(conversations[conversationIndex], data)
    // Hacer el path hacia aqui
    // const filePath = pat h.join()
    await fs.writeFile(conversationPath, JSON.stringify(conversations, null, 2))
    return conversationObject(conversations[conversationIndex])
  }
}
