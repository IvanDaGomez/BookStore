import { Router } from 'express';
import { ConversationsController } from '../../controllers/conversations/conversationsController.js';
export const createConversationsRouter = ({ ConversationsModel, UsersModel }) => {
    // Crear una instancia del controlador de conversaciones
    const conversationsController = new ConversationsController({ ConversationsModel, UsersModel });
    const conversationsRouter = Router();
    // Rutas de conversaciones
    conversationsRouter.get('/', conversationsController.getAllConversations); // Obtener todas las conversaciones
    conversationsRouter.get('/getConversationsByUser/:userId', conversationsController.getConversationsByUser);
    conversationsRouter.get('/getConversationById/:conversationId', conversationsController.getConversationById); // Obtener mensajes en una conversación
    conversationsRouter.post('/', conversationsController.createConversation); // Crea conversación
    conversationsRouter.delete('/:conversationId', conversationsController.deleteConversation); // Eliminar una conversación
    return conversationsRouter;
};
