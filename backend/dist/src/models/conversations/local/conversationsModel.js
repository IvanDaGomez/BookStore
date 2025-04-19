import fs from 'node:fs/promises';
import { conversationObject } from '../conversationObject.js';
export class ConversationsModel {
    static async getAllConversations(l = 0) {
        const data = await fs.readFile('./models/conversations.json', 'utf-8');
        // Handle empty file case
        let conversations = [];
        if (!data.trim()) { // Only parse if data is not an empty string
            throw new Error('No se encontraron conversaciones');
        }
        conversations = JSON.parse(data);
        if (l !== 0) {
            conversations = conversations.slice(0, l);
        }
        return conversations.map(conversation => conversationObject(conversation));
    }
    static async getConversationsByList(conversationsIds) {
        // Load all conversations from the JSON file
        const allConversations = await this.getAllConversations();
        // For
        // Filter conversations based on the provided conversationsIds
        const userConversations = allConversations.filter(conversation => conversationsIds.includes(conversation._id));
        if (userConversations.length === 0) {
            throw new Error('No se encontraron conversaciones');
        }
        return userConversations;
    }
    static async getConversationById(id) {
        const conversations = await this.getAllConversations();
        const conversation = conversations.find(conversation => conversation._id === id);
        if (!conversation) {
            throw new Error('No se encontró la conversación');
        }
        // Return conversation with limited public information
        return conversationObject(conversation);
    }
    static async createConversation(data) {
        const conversations = await this.getAllConversations();
        // Crear valores por defecto
        const newConversation = conversationObject(data);
        conversations.push(newConversation);
        await fs.writeFile('./models/conversations.json', JSON.stringify(conversations, null, 2));
        return newConversation;
    }
    static async deleteConversation(id) {
        const conversations = await this.getAllConversations();
        const conversationIndex = conversations.findIndex(conversation => conversation._id === id);
        if (conversationIndex === -1) {
            throw new Error('No se encontró la conversación');
        }
        conversations.splice(conversationIndex, 1);
        await fs.writeFile('./models/conversations.json', JSON.stringify(conversations, null, 2));
        return { message: 'Conversación eliminada con éxito' };
    }
    static async updateConversation(id, data) {
        const conversations = await this.getAllConversations();
        const conversationIndex = conversations.findIndex(conversation => conversation._id === id);
        if (conversationIndex === -1) {
            throw new Error('No se encontró la conversación');
        }
        // Actualiza los datos de la conversación
        Object.assign(conversations[conversationIndex], data);
        // Hacer el path hacia aqui
        // const filePath = pat h.join()
        await fs.writeFile('./models/conversations.json', JSON.stringify(conversations, null, 2));
        return conversationObject(conversations[conversationIndex]);
    }
}
