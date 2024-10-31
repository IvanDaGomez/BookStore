import { MessagesModel } from '../../models/messages/messagesModel.js'
import { validateMessage } from '../../assets/validate.js'
import { ConversationsModel } from '../../models/conversations/conversationsModel.js'

export class MessagesController {
  static async getAllMessages (req, res) {
    try {
      const messages = await MessagesModel.getAllMessages()
      if (!messages) {
        res.status(500).json({ error: 'Error al leer mensajes' })
      }
      res.json(messages)
    } catch (err) {
      console.error('Error al leer mensajes:', err)
      res.status(500).json({ error: 'Error al leer mensajes' })
    }
  }

  static async getAllMessagesByConversation (req, res) {
    try {
      const { conversationId } = req.params
      const message = await MessagesModel.getAllMessagesByConversation(conversationId)
      if (!message) {
        return res.status(404).json({ error: 'Conversación no encontrada' })
      }
      res.json(message)
    } catch (err) {
      console.error('Error al leer la conversación:', err)
      res.status(500).json({ error: 'Error al leer la conversación' })
    }
  }

  static async getMessageById (req, res) {
    try {
      const { messageId } = req.params
      const message = await MessagesModel.getMessageById(messageId)
      if (!message) {
        return res.status(404).json({ error: 'Mensaje no encontrado' })
      }
      res.json(message)
    } catch (err) {
      console.error('Error al leer el mensaje:', err)
      res.status(500).json({ error: 'Error al leer el mensaje' })
    }
  }

  // Filtrar mensajes
  static async sendMessage (req, res) {
    const data = req.body

    // Validación
    const validated = validateMessage(data)
    if (!validated.success) {
      console.log('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    // Asignar un ID único al mensaje
    data._id = crypto.randomUUID()
    const time = new Date()
    data.createdIn = time

    // Necesario actualizar la conversación en la que el mensaje se envía
    const conversation = await ConversationsModel.getConversationById(data.conversationId)
    console.log(conversation)
    if (!conversation) {
      return res.status(404).json({ error: 'No se encontró la conversación' })
    }

    if (!conversation.users.includes(data.userId)) {
      return res.status(404).json({ error: 'El usuario no se encuentra en la conversación' })
    }

    // Validar el userId
    try {
      conversation.messages = [...(conversation.messages ?? []), [data._id, data.userId, data.message]]
      const changed = await ConversationsModel.updateConversation(conversation._id, conversation)
      if (!changed) {
        return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
      }
    } catch (err) {
      console.error("Error updating user's message:", err)
      return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
    }

    // Crear el mensaje en la base de datos
    const message = await MessagesModel.sendMessage(data)
    if (typeof message === 'string' && message.startsWith('Error')) {
      return res.status(500).json({ error: message })
    }
    if (!message) {
      return res.status(500).json({ error: 'Error al crear mensaje' })
    }

    // Si todo es exitoso, devolver el mensaje creado
    res.send({ message })
  }

  static async deleteMessage (req, res) {
    try {
      const { messageId } = req.params

      // Obtener los detalles del mensaje para encontrar al vendedor (idVendedor)
      const message = await MessagesModel.getMessageById(messageId)
      if (!message) {
        return res.status(404).json({ error: 'Mensaje no encontrado' })
      }

      // Necesario actualizar la conversación en la que el mensaje se elimine
      const conversation = await ConversationsModel.getConversationById(message.conversationId)
      if (!conversation) {
        return res.json({ error: 'No se encontró la conversación' })
      }

      try {
        // Assign conversation ID to user's conversationsIds
        conversation.messages = conversation.messages.filter(messageArray => messageArray[0] !== message._id)
        const changed = await ConversationsModel.updateConversation(conversation._id, conversation)
        if (!changed) {
          return res.status(500).json({ error: 'Error al actualizar los mensajes de la conversación' })
        }
      } catch (err) {
        console.error("Error updating user's conversation IDs:", err)
        return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
      }
      // Eliminar el mensaje de la base de datos
      const result = await MessagesModel.deleteMessage(messageId)
      if (!result) {
        return res.status(404).json({ error: 'Mensaje no encontrado' })
      }

      res.json({ message: 'Mensaje eliminado con éxito' })
    } catch (err) {
      console.error('Error al eliminar el mensaje:', err)
      res.status(500).json({ error: 'Error al eliminar el mensaje' })
    }
  }

  static async markAsRead (req, res) {
    try {
      const { messageId } = req.params
      const message = await MessagesModel.getMessageById(messageId)
      if (!message) {
        return res.status(404).json({ error: 'Mensaje no encontrado' })
      }
      const updated = await MessagesModel.updateMessage(messageId, { read: true })
      if (!updated) {
        res.status(400).json('El mensaje no pudo ser actualizado')
      }
      res.json({ message: 'Mensaje actualizado con éxito' })
    } catch (err) {
      console.error('Error al leer el mensaje:', err)
      res.status(500).json({ error: 'Error al leer el mensaje' })
    }
  }
}
