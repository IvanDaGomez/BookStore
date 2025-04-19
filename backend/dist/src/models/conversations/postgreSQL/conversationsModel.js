import { pool } from '../../../assets/config.js';
import { conversationObject } from '../conversationObject.js';
/*

CREATE TABLE conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    users UUID[] NOT NULL,
    created_in TIMESTAMP DEFAULT NOW(),
    last_message JSONB DEFAULT '{}'::JSONB
);

*/
export class ConversationsModel {
    static async getAllConversations(limit = 0) {
        try {
            let query = 'SELECT * FROM conversations';
            if (limit > 0) {
                query += ` LIMIT ${limit}`;
            }
            const { rows } = await pool.query(query);
            return rows;
        }
        catch (err) {
            console.error('Error reading conversations:', err);
            throw new Error('Error loading conversations data');
        }
    }
    static async getConversationsByUser(userId) {
        try {
            const query = `
        SELECT * FROM conversations 
        WHERE $1 = ANY(users)
      `;
            const { rows } = await pool.query(query, [userId]);
            return rows;
        }
        catch (err) {
            console.error('Error fetching conversations for user:', err);
            throw new Error('Error fetching conversations');
        }
    }
    static async getConversationById(id) {
        try {
            const query = 'SELECT * FROM conversations WHERE id = $1';
            const { rows } = await pool.query(query, [id]);
            return rows[0] || null;
        }
        catch (err) {
            console.error('Error reading conversation:', err);
            throw new Error(err);
        }
    }
    static async createConversation(data) {
        try {
            const { users, lastMessage = {} } = data;
            const query = `
        INSERT INTO conversations (users, last_message) 
        VALUES ($1, $2) 
        RETURNING *
      `;
            const { rows } = await pool.query(query, [users, lastMessage]);
            return rows[0];
        }
        catch (err) {
            console.error('Error creating conversation:', err);
            throw new Error(err);
        }
    }
    static async deleteConversation(id) {
        try {
            const query = 'DELETE FROM conversations WHERE id = $1 RETURNING *';
            const { rows } = await pool.query(query, [id]);
            return rows[0] ? { message: 'Conversation deleted successfully' } : null;
        }
        catch (err) {
            console.error('Error deleting conversation:', err);
            throw new Error('Error deleting conversation');
        }
    }
    static async updateConversation(id, data) {
        try {
            const existingConversation = await this.getConversationById(id);
            if (!existingConversation)
                return null;
            const updatedConversation = { ...existingConversation, ...data };
            const query = `
        UPDATE conversations 
        SET users = $1, last_message = $2 
        WHERE id = $3 
        RETURNING *
      `;
            const { rows } = await pool.query(query, [updatedConversation.users, updatedConversation.last_message, id]);
            return rows[0];
        }
        catch (err) {
            console.error('Error updating conversation:', err);
            throw new Error(err);
        }
    }
}
