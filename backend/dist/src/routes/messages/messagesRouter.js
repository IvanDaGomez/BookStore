import { Router } from 'express';
// import { upload } from '../../assets/config.js'
import { MessagesController } from '../../controllers/messages/messagesController.js';
export const createMessagesRouter = ({ MessagesModel, ConversationsModel }) => {
    // Crear una instancia del controlador de mensajes
    const messagesController = new MessagesController({ MessagesModel, ConversationsModel });
    const messagesRouter = Router();
    // Rutas de mensajes
    messagesRouter.get('/', messagesController.getAllMessages); // Obtener todos los mensajes
    messagesRouter.get('/messageByConversation/:conversationId', messagesController.getAllMessagesByConversation);
    messagesRouter.get('/messageById/:messageId', messagesController.getMessageById); // Obtener un mensaje específico
    messagesRouter.post('/', messagesController.sendMessage); // Enviar un nuevo mensaje
    messagesRouter.delete('/:messageId', messagesController.deleteMessage); // Eliminar un mensaje específico
    messagesRouter.post('/:messageId/read', messagesController.markAsRead); // Marcar mensaje como leído
    return messagesRouter;
};
