import { validateMessage } from '../../assets/validate.js';
export class MessagesController {
    constructor({ MessagesModel, ConversationsModel }) {
        this.getAllMessages = async (req, res, next) => {
            try {
                const messages = await this.MessagesModel.getAllMessages();
                res.json(messages);
            }
            catch (err) {
                next(err);
            }
        };
        this.getAllMessagesByConversation = async (req, res, next) => {
            try {
                const conversationId = req.params.conversationId;
                if (!conversationId) {
                    return res.status(400).json({ error: 'ID de conversación no proporcionado' });
                }
                const message = await this.MessagesModel.getAllMessagesByConversation(conversationId);
                res.json(message);
            }
            catch (err) {
                next(err);
            }
        };
        this.getMessageById = async (req, res, next) => {
            try {
                const messageId = req.params.messageId;
                if (!messageId) {
                    return res.status(400).json({ error: 'ID de mensaje no proporcionado' });
                }
                const message = await this.MessagesModel.getMessageById(messageId);
                res.json(message);
            }
            catch (err) {
                next(err);
            }
        };
        // Filtrar mensajes
        this.sendMessage = async (req, res, next) => {
            const data = req.body;
            try {
                // Validación
                const validated = validateMessage(data);
                if (!validated.success) {
                    return res.status(400).json({ error: validated.error });
                }
                // Necesario actualizar la conversación en la que el mensaje se envía
                const conversation = await this.ConversationsModel.getConversationById(data.conversationId);
                // Validar el userId
                conversation.lastMessage = data;
                await this.ConversationsModel.updateConversation(conversation._id, conversation);
                if (!conversation.users.includes(data.userId)) {
                    return res.status(404).json({ error: 'El usuario no se encuentra en la conversación' });
                }
                // Crear el mensaje en la base de datos
                const message = await this.MessagesModel.sendMessage(data);
                // Si todo es exitoso, devolver el mensaje creado
                res.json(message);
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteMessage = async (req, res, next) => {
            try {
                const messageId = req.params.messageId;
                if (!messageId) {
                    return res.status(400).json({ error: 'ID de mensaje no proporcionado' });
                }
                // Eliminar el mensaje de la base de datos
                await this.MessagesModel.deleteMessage(messageId);
                res.json({ message: 'Mensaje eliminado con éxito' });
            }
            catch (err) {
                next(err);
            }
        };
        this.markAsRead = async (req, res, next) => {
            try {
                const messageId = req.params.messageId;
                if (!messageId) {
                    return res.status(400).json({ error: 'ID de mensaje no proporcionado' });
                }
                await this.MessagesModel.updateMessage(messageId, { read: true });
                res.json({ message: 'Mensaje actualizado con éxito' });
            }
            catch (err) {
                next(err);
            }
        };
        this.MessagesModel = MessagesModel;
        this.ConversationsModel = ConversationsModel;
    }
}
