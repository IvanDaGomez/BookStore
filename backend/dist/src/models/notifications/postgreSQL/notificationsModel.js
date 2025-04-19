import { pool } from '../../../assets/config.js';
import { notificationObject } from '../notificationObject.js';
/*

CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    theme TEXT NOT NULL,
    title TEXT NOT NULL,
    priority TEXT NOT NULL,
    type TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input TEXT DEFAULT '',
    created_in TIMESTAMP DEFAULT NOW(),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT DEFAULT '',
    expires_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::JSONB
);

 */
export class NotificationsModel {
    static async getAllNotifications(limit = 0) {
        try {
            let query = 'SELECT * FROM notifications';
            if (limit > 0) {
                query += ` LIMIT ${limit}`;
            }
            const { rows } = await pool.query(query);
            return rows;
        }
        catch (err) {
            console.error('Error reading notifications:', err);
            throw new Error('Error loading notifications data');
        }
    }
    static async getAllNotificationsByUserId(userId) {
        try {
            const query = 'SELECT * FROM notifications WHERE user_id = $1';
            const { rows } = await pool.query(query, [userId]);
            return rows;
        }
        catch (err) {
            console.error('Error fetching notifications for user:', err);
            throw new Error('Error fetching notifications');
        }
    }
    static async getNotificationById(id) {
        try {
            const query = 'SELECT * FROM notifications WHERE id = $1';
            const { rows } = await pool.query(query, [id]);
            return rows[0] || null;
        }
        catch (err) {
            console.error('Error reading notification:', err);
            throw new Error(err);
        }
    }
    static async createNotification(data) {
        try {
            const { theme, title, priority, type, userId, input = '', actionUrl = '', metadata = {} } = data;
            const query = `
        INSERT INTO notifications (theme, title, priority, type, user_id, input, action_url, metadata) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *
      `;
            const { rows } = await pool.query(query, [theme, title, priority, type, userId, input, actionUrl, metadata]);
            return rows[0];
        }
        catch (err) {
            console.error('Error creating notification:', err);
            throw new Error(err);
        }
    }
    static async deleteNotification(id) {
        try {
            const query = 'DELETE FROM notifications WHERE id = $1 RETURNING *';
            const { rows } = await pool.query(query, [id]);
            return rows[0] ? { message: 'Notification deleted successfully' } : null;
        }
        catch (err) {
            console.error('Error deleting notification:', err);
            throw new Error('Error deleting notification');
        }
    }
    static async updateNotification(id, data) {
        try {
            const existingNotification = await this.getNotificationById(id);
            if (!existingNotification)
                return null;
            const updatedNotification = { ...existingNotification, ...data };
            const query = `
        UPDATE notifications 
        SET theme = $1, title = $2, priority = $3, type = $4, user_id = $5, input = $6, 
            action_url = $7, metadata = $8, read = $9 
        WHERE id = $10 
        RETURNING *
      `;
            const { rows } = await pool.query(query, [
                updatedNotification.theme, updatedNotification.title, updatedNotification.priority,
                updatedNotification.type, updatedNotification.user_id, updatedNotification.input,
                updatedNotification.action_url, updatedNotification.metadata, updatedNotification.read, id
            ]);
            return rows[0];
        }
        catch (err) {
            console.error('Error updating notification:', err);
            throw new Error(err);
        }
    }
    static async markNotificationAsRead(id) {
        try {
            const query = `
        UPDATE notifications 
        SET read = TRUE 
        WHERE id = $1 
        RETURNING *
      `;
            const { rows } = await pool.query(query, [id]);
            return rows[0] || null;
        }
        catch (err) {
            console.error('Error marking notification as read:', err);
            throw new Error('Error marking notification as read');
        }
    }
}
