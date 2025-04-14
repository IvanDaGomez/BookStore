import fs from 'node:fs/promises'
import { messageObject } from '../messageObject.js'

class MessagesModel {
  static async getAllMessages () {
    try {
      const data = await fs.readFile('./models/messages.json', 'utf-8')
      const messages = JSON.parse(data)

      return messages.map(message => messageObject(message))
    } catch (err) {
      console.error('Error reading messages:', err)
      throw new Error(err)
    }
  }

  static async getAllMessagesByConversation (id) {
    try {
      const messages = await this.getAllMessages()
      const filteredMessages = messages.filter(message => message.conversationId === id)
      if (!filteredMessages) {
        return null
      }

      // Return message with limited public information
      return filteredMessages.map(message => messageObject(message))
    } catch (err) {
      console.error('Error reading message:', err)
      throw new Error(err)
    }
  }

  static async getMessageById (id) {
    try {
      const messages = await this.getAllMessages()
      const message = messages.find(message => message._id === id)
      if (!message) {
        return null
      }

      // Return message with limited public information
      return messageObject(message)
    } catch (err) {
      console.error('Error reading message:', err)
      throw new Error(err)
    }
  }

  static async sendMessage (data) {
    try {
      const messages = await this.getAllMessages()

      // Crear valores por defecto
      const newMessage = messageObject(data)

      messages.push(newMessage)
      await fs.writeFile('./models/messages.json', JSON.stringify(messages, null, 2))
      return newMessage
    } catch (err) {
      return err
    }
  }

  static async deleteMessage (id) {
    try {
      const messages = await this.getAllMessages()
      const messageIndex = messages.findIndex(message => message._id === id)
      if (messageIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      messages.splice(messageIndex, 1)
      await fs.writeFile('./models/messages.json', JSON.stringify(messages, null, 2))
      return { message: 'Message deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting message:', err)
      throw new Error('Error deleting message')
    }
  }

  static async updateMessage (id, data) {
    try {
      const messages = await this.getAllMessages()

      const messageIndex = messages.findIndex(message => message._id === id)
      if (messageIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }

      // Actualiza los datos del usuario
      Object.assign(messages[messageIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/messages.json', JSON.stringify(messages, null, 2))

      return true
    } catch (err) {
      console.error('Error updating message:', err)
      throw new Error(err)
    }
  }
}

export { MessagesModel }
