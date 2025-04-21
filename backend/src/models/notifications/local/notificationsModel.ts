import fs from 'node:fs/promises'
import { notificationObject } from '../notificationObject.js'
import { NotificationType } from '../../../types/notification.js'
import { ID } from '../../../types/objects.js'
import path from 'node:path'
// __dirname is not available in ES modules, so we need to use import.meta.url

const notificationsPath = path.join('.', 'data', 'notifications.json')
export class NotificationsModel {
  static async getAllNotifications (l: number = 0): Promise<NotificationType[]> {
    const data = await fs.readFile(notificationsPath, 'utf-8')

    if (!data.trim()) {
      throw new Error('No se encontraron notificaciones')
    } 
    let notifications: NotificationType[] = JSON.parse(data)
    if (l !== 0) {
      notifications = notifications.slice(0, l)
    }
    return notifications.map(notification => notificationObject(notification))
  }

  static async getAllNotificationsByUserId (userId: ID): Promise<NotificationType[]> {
    // Load all notifications from the JSON file
    const allNotifications = await this.getAllNotifications()
    // Filter notifications based on the provided notificationsIds
    const userNotifications = allNotifications.filter(notification =>
      notification.userId === userId
    )
    return userNotifications
  }

  static async getNotificationById (id: ID): Promise<NotificationType> {
    const notifications = await this.getAllNotifications()
    const notification = notifications.find(notification => notification._id === id)
    if (!notification) {
      throw new Error('No se encontró la notificación')
    }
    return notificationObject(notification)
  }

  static async createNotification (data: Partial<NotificationType>): Promise<NotificationType> {

    let notifications = await this.getAllNotifications()
    // Crear valores por defecto
    const newNotification = notificationObject(data)
    notifications.push(newNotification)
    // Elimina las notificaciones que ya han expirado
    notifications = notifications.filter(notification => {
      if (new Date(notification.expiresAt) < new Date()) {
        return false
      }
      return true
    })
    await fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2))
    return newNotification

  }

  static async deleteNotification (id: ID): Promise<{ message: string }>{
    const notifications = await this.getAllNotifications()
    const notificationIndex = notifications.findIndex(notification => notification._id === id)
    if (notificationIndex === -1) {
      throw new Error('No se encontró la notificación')
    }
    notifications.splice(notificationIndex, 1)
    await fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2))
    return { message: 'Notificación eliminada con éxito' } // Mensaje de éxito

  }

  static async updateNotification (id: ID, data: Partial<NotificationType>): Promise<NotificationType> {
    const notifications = await this.getAllNotifications()
    const notificationIndex = notifications.findIndex(notification => notification._id === id)
    if (notificationIndex === -1) {
      throw new Error('No se encontró la notificación')
    }
    // Actualiza los datos de la conversación
    Object.assign(notifications[notificationIndex], data)
    // Hacer el path hacia aqui
    // const filePath = pat h.join()
    await fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2))
    return notifications[notificationIndex]
  }

  static async markNotificationAsRead (id: ID): Promise<NotificationType> {
    const notifications = await this.getAllNotifications()

    const notificationIndex = notifications.findIndex(notification => notification._id === id)
    if (notificationIndex === -1) {
      throw new Error('No se encontró la notificación')
    }

    // Actualiza los datos de la conversación
    notifications[notificationIndex].read = true

    await fs.writeFile(notificationsPath, JSON.stringify(notifications, null, 2))
    return notifications[notificationIndex]
  }
}
