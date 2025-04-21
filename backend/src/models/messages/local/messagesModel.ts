import fs from 'node:fs/promises'
import { messageObject } from '../messageObject.js'
import { MessageObjectType } from '../../../types/message.js'
import { ID } from '../../../types/objects.js'
import path from 'node:path'
// __dirname is not available in ES modules, so we need to use import.meta.url

const messagesPath = path.join('.', 'data', 'messages.json')
class MessagesModel {
  static async getAllMessages (): Promise<MessageObjectType[]> {
      const data = await fs.readFile(messagesPath, 'utf-8')
      const messages: MessageObjectType[] = JSON.parse(data)
      if (!messages) {
        throw new Error('No se pudieron encontrar los mensajes')
      }
      return messages.map(message => messageObject(message))
  }

  static async getAllMessagesByConversation (id: ID): Promise<MessageObjectType[]> {
    const messages = await this.getAllMessages()
    const filteredMessages = messages.filter(message => message.conversationId === id)
    if (!filteredMessages) {
      throw new Error('No se pudieron encontrar los mensajes')
    }
    // Return message with limited public information
    return filteredMessages.map(message => messageObject(message))

  }

  static async getMessageById (id: ID): Promise<MessageObjectType> {
    const messages = await this.getAllMessages()
    const message = messages.find(message => message._id === id)
    if (!message) {
      throw new Error('No se pudo encontrar el mensaje')
    }
    // Return message with limited public information
    return messageObject(message)
  }

  static async sendMessage (data: Partial<MessageObjectType>): Promise<MessageObjectType> {
    const messages = await this.getAllMessages()
    // Crear valores por defecto
    const newMessage = messageObject(data)
    messages.push(newMessage)
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2))
    return newMessage

  }

  static async deleteMessage (id: ID): Promise<{ message: string }> {
    const messages = await this.getAllMessages()
    const messageIndex = messages.findIndex(message => message._id === id)
    if (messageIndex === -1) {
      throw new Error('No se pudo encontrar el mensaje')
    }
    messages.splice(messageIndex, 1)
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2))
    return { message: 'Mensaje eliminado con éxito' } // Mensaje de éxito
  }

  static async updateMessage (id: ID, data: Partial<MessageObjectType>): Promise<MessageObjectType> {
    const messages = await this.getAllMessages()
    const messageIndex = messages.findIndex(message => message._id === id)
    if (messageIndex === -1) {
      throw new Error('No se pudo encontrar el mensaje')
    }
    // Actualiza los datos del usuario
    Object.assign(messages[messageIndex], data)
    // Hacer el path hacia aqui
    // const filePath = pat h.join()
    await fs.writeFile(messagesPath, JSON.stringify(messages, null, 2))
    return messages[messageIndex]
  }
}

export { MessagesModel }
