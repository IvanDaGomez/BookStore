import { RequestHandler, Router } from 'express'
import { ConversationsController } from '../../controllers/conversations/conversationsController.js'
import { IConversationsModel, IUsersModel } from '../../types/models.js'

export const createConversationsRouter = ({ ConversationsModel, UsersModel }:
  {ConversationsModel: IConversationsModel, UsersModel: IUsersModel }
) => {
  // Crear una instancia del controlador de conversaciones
  const conversationsController = new ConversationsController({ ConversationsModel, UsersModel })
  const conversationsRouter = Router()

  // Rutas de conversaciones
  conversationsRouter.get('/', conversationsController.getAllConversations as RequestHandler) // Obtener todas las conversaciones
  conversationsRouter.get('/getConversationsByUser/:userId', conversationsController.getConversationsByUser as RequestHandler)
  conversationsRouter.get('/getConversationById/:conversationId', conversationsController.getConversationById as RequestHandler) // Obtener mensajes en una conversación
  conversationsRouter.post('/', conversationsController.createConversation as RequestHandler) // Crea conversación
  conversationsRouter.delete('/:conversationId', conversationsController.deleteConversation as RequestHandler) // Eliminar una conversación

  return conversationsRouter
}
