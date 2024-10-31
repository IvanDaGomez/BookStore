import { Router } from 'express'
import { ConversationsController } from '../../controllers/conversations/conversationsController.js'
const conversationsRouter = Router()

// Rutas de conversaciones
conversationsRouter.get('/', ConversationsController.getAllConversations) // Obtener todas las conversaciones
conversationsRouter.get('/:conversationId', ConversationsController.getConversationById) // Obtener mensajes en una conversación
conversationsRouter.post('/', ConversationsController.createConversation) // Crea conversación
conversationsRouter.delete('/:conversationId', ConversationsController.deleteConversation) // Eliminar una conversación

export { conversationsRouter }
