import { RequestHandler, Router } from 'express'
// import { upload } from '../../assets/config.js'
import { MessagesController } from '../../controllers/messages/messagesController.js'
import { IConversationsModel, IMessagesModel } from '../../types/models.js'
export const createMessagesRouter = ({ MessagesModel, ConversationsModel }:
  {
    MessagesModel: IMessagesModel,
    ConversationsModel: IConversationsModel
  }
) => {
  // Crear una instancia del controlador de mensajes
  const messagesController = new MessagesController({ MessagesModel, ConversationsModel })
  const messagesRouter = Router()

  // Rutas de mensajes
  messagesRouter.get('/', messagesController.getAllMessages as RequestHandler) // Obtener todos los mensajes
  messagesRouter.get('/messageByConversation/:conversationId', messagesController.getAllMessagesByConversation as RequestHandler)
  messagesRouter.get('/messageById/:messageId', messagesController.getMessageById as RequestHandler) // Obtener un mensaje específico
  messagesRouter.post('/', messagesController.sendMessage as RequestHandler) // Enviar un nuevo mensaje
  messagesRouter.delete('/:messageId', messagesController.deleteMessage as RequestHandler) // Eliminar un mensaje específico
  messagesRouter.post('/:messageId/read', messagesController.markAsRead as RequestHandler) // Marcar mensaje como leído

  return messagesRouter
}
