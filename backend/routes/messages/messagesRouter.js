import { Router } from 'express'
// import { upload } from '../../assets/config.js'
import { MessagesController } from '../../controllers/messages/messagesController.js'
const messagesRouter = Router()

// Rutas de mensajes
messagesRouter.get('/', MessagesController.getAllMessages) // Obtener todos los mensajes
messagesRouter.get('/messageByConversation/:conversationId', MessagesController.getAllMessagesByConversation)
messagesRouter.get('/messageById/:messageId', MessagesController.getMessageById) // Obtener un mensaje específico
messagesRouter.post('/', MessagesController.sendMessage) // Enviar un nuevo mensaje
messagesRouter.delete('/:messageId', MessagesController.deleteMessage) // Eliminar un mensaje específico
// Marcar un mensaje como leído
messagesRouter.post('/:messageId/read', MessagesController.markAsRead) // Marcar mensaje como leído

// Rutas de notificaciones
// messagesRouter.get('/notifications', MessagesController.getNotifications) // Obtener todas las notificaciones
// messagesRouter.delete('/notifications/:id', MessagesController.deleteNotification) // Eliminar una notificación específica

export { messagesRouter }
