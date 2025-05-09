import { IConversationsModel, IUsersModel } from '../../types/models'
import express from 'express'
import { ID } from '../../types/objects'
import { ConversationObjectType } from '../../types/conversation'
export class ConversationsController {
  private ConversationsModel: IConversationsModel
  private UsersModel: IUsersModel

  constructor ({
    ConversationsModel,
    UsersModel
  }: {
    ConversationsModel: IConversationsModel
    UsersModel: IUsersModel
  }) {
    this.ConversationsModel = ConversationsModel
    this.UsersModel = UsersModel
  }

  getAllConversations = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { l } = req.query
      const lParsed = parseInt(l as string, 10) ?? 0 // If 0 no limit is set
      const conversations = await this.ConversationsModel.getAllConversations(
        lParsed
      )

      res.json(conversations)
    } catch (err) {
      next(err)
    }
  }

  getConversationsByUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const userId = req.params.user_id as ID

      const user = await this.UsersModel.getUserById(userId)
      const conversations =
        await this.ConversationsModel.getConversationsByList(
          user.conversations_ids
        )

      res.json(conversations)
    } catch (err) {
      next(err)
    }
  }

  getConversationById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const conversationId = req.params.conversation_id as ID
      const conversation = await this.ConversationsModel.getConversationById(
        conversationId
      )
      res.json(conversation)
    } catch (err) {
      next(err)
    }
  }

  // Filtrar mensajes
  createConversation = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const data = req.body as ConversationObjectType
      console.log('data', data)
      // Validation: Ensure exactly two users
      if (data.users.length !== 2) {
        return res.json({ error: 'Es necesario dos usuarios' })
      }

      // Check if conversation already exists
      const conversations = await this.ConversationsModel.getAllConversations()
      if (
        conversations.some(
          conversation =>
            JSON.stringify(conversation.users) === JSON.stringify(data.users)
        )
      ) {
        return res.json({ error: 'Conversación ya agregada' })
      }

      // Create conversation in the database first
      const conversation = await this.ConversationsModel.createConversation(
        data
      )

      // Only update users' conversation IDs after successful creation
      for (const userId of data.users) {
        const user = await this.UsersModel.getUserById(userId)

        user.conversations_ids = [...user.conversations_ids, conversation.id]
        await this.UsersModel.updateUser(user.id, user)
      }

      return res.json(conversation)
    } catch (err) {
      next(err)
    }
  }

  deleteConversation = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const conversationId = req.params.conversation_id as ID

      // Obtener los detalles de la conversación para encontrar al vendedor Eliminar conversacionesIds
      const conversation = await this.ConversationsModel.getConversationById(
        conversationId
      )

      // Necesario actualizar el usuario en la que la conversación se elimina
      // Iterate through users with a for...of loop for async handling
      for (const userId of conversation.users) {
        const user = await this.UsersModel.getUserById(userId)
        // Assign conversation ID to user's conversationsIds
        user.conversations_ids = user.conversations_ids.filter(
          id => id !== conversationId
        )
        await this.UsersModel.updateUser(user.id, user)
      }

      // Eliminar el mensaje de la base de datos
      await this.ConversationsModel.deleteConversation(conversationId)

      res.json({ message: 'Conversación eliminada con éxito' })
    } catch (err) {
      next(err)
    }
  }
}
