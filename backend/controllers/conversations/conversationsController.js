import { ConversationsModel } from '../../models/conversations/conversationsModel.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
export class ConversationsController {
  static async getAllConversations (req, res) {
    const { l } = req.query
    try {
      const conversations = await ConversationsModel.getAllConversations(l)
      if (!conversations) {
        res.status(500).json({ error: 'Error al leer conversaciones' })
      }
      res.json(conversations)
    } catch (err) {
      console.error('Error al leer conversaciones:', err)
      res.status(500).json({ error: 'Error al leer conversaciones' })
    }
  }

  static async getConversationsByUser (req, res) {
    try {
      // Step 1: Extract userId from request params
      const { userId } = req.params

      // Step 2: Fetch user by ID to get conversationsIds
      const user = await UsersModel.getUserById(userId)
      if (!user || !user.conversationsIds) {
        return res.status(404).json({ error: 'Usuario o conversaciones no encontradas' })
      }

      // Step 3: Retrieve conversations based on the conversationsIds array
      const conversations = await ConversationsModel.getConversationsByUser(user.conversationsIds)

      // Step 4: Check if conversations were found
      if (!conversations || conversations.length === 0) {
        return res.status(404).json({ error: 'No se encontraron conversaciones' })
      }

      // Step 5: Send conversations back as JSON
      res.json(conversations)
    } catch (err) {
      console.error('Error al leer la conversación:', err)
      res.status(500).json({ error: 'Error al leer la conversación' })
    }
  }

  static async getConversationById (req, res) {
    try {
      const { conversationId } = req.params
      const conversation = await ConversationsModel.getConversationById(conversationId)
      if (!conversation) {
        return res.status(404).json({ error: 'Conversación no encontrada' })
      }
      res.json(conversation)
    } catch (err) {
      console.error('Error al leer la conversación:', err)
      res.status(500).json({ error: 'Error al leer la conversación' })
    }
  }

  // Filtrar mensajes
  static async createConversation (req, res) {
    const data = req.body

    // Validation
    if (data.users.length !== 2) {
      return res.json({ error: 'Es necesario dos usuarios' })
    }
    console.log(data)

    // Assign a unique ID and timestamp
    data._id = crypto.randomUUID()
    const time = new Date()
    data.createdIn = time

    const conversations = await ConversationsModel.getAllConversations()
    if (conversations.some(conversation => JSON.stringify(conversation.users) === JSON.stringify(data.users))) return res.json({ error: 'Conversación ya agregada' })
    // Iterate through users with a for...of loop for async handling
    for (const userId of data.users) {
      const user = await UsersModel.getUserById(userId)
      if (!user) {
        return res.json({ error: 'No se encontró el usuario' })
      }

      try {
        // Assign conversation ID to user's conversationsIds
        user.conversationsIds = [...(user.conversationsIds ?? []), data._id]

        const changed = await UsersModel.updateUser(user._id, user)
        if (!changed) {
          return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
        }
      } catch (err) {
        console.error("Error updating user's conversation IDs:", err)
        return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
      }
    }

    try {
    // Create conversation in the database
      const conversation = await ConversationsModel.createConversation(data)
      if (typeof conversation === 'string' && conversation.startsWith('Error')) {
        return res.status(500).json({ error: conversation })
      }
      if (conversation.error) {
        return res.json({ error: conversation.error })
      }

      // Send the created conversation if successful
      res.send({ conversation })
    } catch (error) {
      res.status(500).json({ error })
    }
  }

  static async deleteConversation (req, res) {
    try {
      const { conversationId } = req.params

      // Obtener los detalles de la conversación para encontrar al vendedor Eliminar conversacionesIds
      const conversation = await ConversationsModel.getConversationById(conversationId)
      if (!conversation) {
        return res.status(404).json({ error: 'Conversación no encontrada' })
      }

      // Necesario actualizar el usuario en la que la conversación se elimina
      // Iterate through users with a for...of loop for async handling
      for (const userId of conversation.users) {
        const user = await UsersModel.getUserById(userId)
        if (!user) {
          return res.json({ error: 'No se encontró el usuario' })
        }

        try {
        // Assign conversation ID to user's conversationsIds
          user.conversationsIds = user.conversationsIds.filter(id => id !== conversationId)

          const changed = await UsersModel.updateUser(user._id, user)
          if (!changed) {
            return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
          }
        } catch (err) {
          console.error("Error updating user's conversation IDs:", err)
          return res.status(500).json({ error: 'Error al actualizar las conversaciones del usuario' })
        }
      }

      // Eliminar el mensaje de la base de datos
      const result = await ConversationsModel.deleteConversation(conversationId)
      if (!result) {
        return res.status(404).json({ error: 'Conversación no encontrada' })
      }

      res.json({ message: 'Conversación eliminada con éxito' })
    } catch (err) {
      console.error('Error al eliminar la conversación:', err)
      res.status(500).json({ error: 'Error al eliminar la conversación' })
    }
  }
}
