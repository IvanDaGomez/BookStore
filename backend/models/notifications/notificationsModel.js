import fs from 'node:fs/promises'

// Tu libro ha sido vendido
// Tu libro ha sido publicado con éxito
// Te hicieron una pregunta acerca de este libro
// Tienes un mensaje nuevo
// Tu libro ha llegado con éxito
// Tienes nuevas recomendaciones
// Tu libro ha sido actualizado con éxito
// Algunos de tus seguidores hicieron una nueva publicación
// Puede que te guste este tema
// Hay nuevos libros de x tema
const notificationObject = (data) => {
  return {
    _id: data._id || '',
    theme: data.theme || '',
    title: data.title || '',
    priority: data.priority || '',
    type: data.type || '',
    userId: data.userId || '',
    input: data.input || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false,
    actionUrl: data.actionUrl || '',
    expiresAt: data.expiresAt || new Date().toISOString(),
    metadata: data.metadata || {
      photo: '',
      bookTitle: '',
      bookId: ''
    }
  }
}

export class NotificationsModel {
  static async getAllNotifications (l = 0) {
    try {
      const data = await fs.readFile('./models/notifications.json', 'utf-8')

      // Handle empty file case
      let notifications = []
      if (data.trim()) { // Only parse if data is not an empty string
        notifications = JSON.parse(data)
      }

      if (l !== 0) {
        notifications = notifications.slice(0, l)
      }
      return notifications.map(notification => notificationObject(notification))
    } catch (err) {
      console.error('Error reading notifications:', err)
      throw new Error('Error loading notifications data')
    }
  }

  static async getAllNotificationsByUserId (userId) {
    try {
      // Load all notifications from the JSON file
      const allNotifications = await this.getAllNotifications()
      // For
      // Filter notifications based on the provided notificationsIds
      const userNotifications = allNotifications.filter(notification =>
        notification.userId === userId
      )
      return userNotifications
    } catch (err) {
      console.error('Error fetching notifications for user:', err)
      throw new Error('Error fetching notifications')
    }
  }

  static async getNotificationById (id) {
    try {
      const notifications = await this.getAllNotifications()

      const notification = notifications.find(notification => notification._id === id)

      if (!notification) {
        return null
      }
      return notificationObject(notification)
    } catch (err) {
      console.error('Error reading notification:', err)
      throw new Error(err)
    }
  }

  static async createNotification (data) {
    try {
      const notifications = await this.getAllNotifications()
      // Crear valores por defecto
      const newNotification = notificationObject(data)

      notifications.push(newNotification)
      await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2))
      return newNotification
    } catch (err) {
      return err
    }
  }

  static async deleteNotification (id) {
    try {
      const notifications = await this.getAllNotifications()
      const notificationIndex = notifications.findIndex(notification => notification._id === id)
      if (notificationIndex === -1) {
        return null // Si no se encuentra la conversación, retorna null
      }
      notifications.splice(notificationIndex, 1)
      await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2))
      return { notification: 'Notification deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting notification:', err)
      throw new Error('Error deleting notification')
    }
  }

  static async updateNotification (id, data) {
    try {
      const notifications = await this.getAllNotifications()

      const notificationIndex = notifications.findIndex(notification => notification._id === id)
      if (notificationIndex === -1) {
        return null // Si no se encuentra la conversación, retorna null
      }

      // Actualiza los datos de la conversación
      Object.assign(notifications[notificationIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./models/notifications.json', JSON.stringify(notifications, null, 2))

      return true
    } catch (err) {
      console.error('Error updating notification:', err)
      throw new Error(err)
    }
  }
}
