import { validateMessage } from '../../assets/validate.js'
import { IConversationsModel, IMessagesModel } from '../../types/models.js'
import express from 'express'
import { ID } from '../../types/objects.js'
import { MessageObjectType } from '../../types/message.js'
export class MessagesController {
  private MessagesModel: IMessagesModel
  private ConversationsModel: IConversationsModel
  constructor ({ MessagesModel, ConversationsModel }:
    { MessagesModel: IMessagesModel, ConversationsModel: IConversationsModel }
  ) {
    this.MessagesModel = MessagesModel
    this.ConversationsModel = ConversationsModel
  }

  getAllMessages = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const messages = await this.MessagesModel.getAllMessages()
      res.json(messages)
    } catch (err) {
      next(err)
    }
  }

  getAllMessagesByConversation = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const conversationId = req.params.conversationId as ID | undefined
      if (!conversationId) {
        return res.status(400).json({ error: 'ID de conversación no proporcionado' })
      }
      const message = await this.MessagesModel.getAllMessagesByConversation(conversationId)
      res.json(message)
    } catch (err) {
      next(err)
    }
  }

  getMessageById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const messageId = req.params.messageId as ID | undefined
      if (!messageId) {
        return res.status(400).json({ error: 'ID de mensaje no proporcionado' })
      }
      const message = await this.MessagesModel.getMessageById(messageId)
      res.json(message)
    } catch (err) {
      next(err)
    }
  }

  // Filtrar mensajes
  sendMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const data = req.body as MessageObjectType
    try {
      const validated = validateMessage(data)
      if (!validated.success) {
        return res.status(400).json({ error: validated.error })
      }

      // Necesario actualizar la conversación en la que el mensaje se envía
      const conversation = await this.ConversationsModel.getConversationById(data.conversationId)
      // Validar el userId
      if (!conversation.users.includes(data.userId)) {
        return res.status(404).json({ error: 'El usuario no se encuentra en la conversación' })
      }          
      conversation.lastMessage = data
      await this.ConversationsModel.updateConversation(conversation.id, conversation)

      const message = await this.MessagesModel.sendMessage(data)

      res.json(message)
    } catch (err) {
      next(err)
    }
  }

  deleteMessage = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const messageId = req.params.messageId as ID | undefined
      if (!messageId) {
        return res.status(400).json({ error: 'ID de mensaje no proporcionado' })
      }      
      // Eliminar el mensaje de la base de datos
      await this.MessagesModel.deleteMessage(messageId)

      res.json({ message: 'Mensaje eliminado con éxito' })
    } catch (err) {
      next(err)
    }
  }

  markAsRead = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const messageId = req.params.messageId as ID | undefined
      if (!messageId) {
        return res.status(400).json({ error: 'ID de mensaje no proporcionado' })
      }
      
      await this.MessagesModel.updateMessage(messageId, { read: true })

      res.json({ message: 'Mensaje actualizado con éxito' })
    } catch (err) {
      next(err)
    }
  }
}
