import fs from 'node:fs/promises';
import { notificationObject } from '../notificationObject.js';
export class NotificationsModel {
    static async getAllNotifications(l = 0) {
        const data = await fs.readFile('./models/notifications.json', 'utf-8');
        if (!data.trim()) {
            throw new Error('No se encontraron notificaciones');
        }
        let notifications = JSON.parse(data);
        if (l !== 0) {
            notifications = notifications.slice(0, l);
        }
        return notifications.map(notification => notificationObject(notification));
    }
    static async getAllNotificationsByUserId(userId) {
        // Load all notifications from the JSON file
        const allNotifications = await this.getAllNotifications();
        // Filter notifications based on the provided notificationsIds
        const userNotifications = allNotifications.filter(notification => notification.userId === userId);
        return userNotifications;
    }
    static async getNotificationById(id) {
        const notifications = await this.getAllNotifications();
        const notification = notifications.find(notification => notification._id === id);
        if (!notification) {
            throw new Error('No se encontró la notificación');
        }
        return notificationObject(notification);
    }
    static async createNotification(data) {
        const notifications = await this.getAllNotifications();
        // Crear valores por defecto
        const newNotification = notificationObject(data);
        notifications.push(newNotification);
        await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2));
        return newNotification;
    }
    static async deleteNotification(id) {
        const notifications = await this.getAllNotifications();
        const notificationIndex = notifications.findIndex(notification => notification._id === id);
        if (notificationIndex === -1) {
            throw new Error('No se encontró la notificación');
        }
        notifications.splice(notificationIndex, 1);
        await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2));
        return { message: 'Notificación eliminada con éxito' }; // Mensaje de éxito
    }
    static async updateNotification(id, data) {
        const notifications = await this.getAllNotifications();
        const notificationIndex = notifications.findIndex(notification => notification._id === id);
        if (notificationIndex === -1) {
            throw new Error('No se encontró la notificación');
        }
        // Actualiza los datos de la conversación
        Object.assign(notifications[notificationIndex], data);
        // Hacer el path hacia aqui
        // const filePath = pat h.join()
        await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2));
        return notifications[notificationIndex];
    }
    static async markNotificationAsRead(id) {
        const notifications = await this.getAllNotifications();
        const notificationIndex = notifications.findIndex(notification => notification._id === id);
        if (notificationIndex === -1) {
            throw new Error('No se encontró la notificación');
        }
        // Actualiza los datos de la conversación
        notifications[notificationIndex].read = true;
        await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2));
        return notifications[notificationIndex];
    }
}
