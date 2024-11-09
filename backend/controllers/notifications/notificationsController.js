import { NotificationsModel } from '../../models/notifications/notificationsModel'
export class NotificationsController {
  static async getAllNotifications (req, res) {
    try {
      const notifications = await NotificationsModel.getAllNotifications()
      if (!notifications) {
        return res.status(404).json({ error: 'Error al conseguir las notificaciones' })
      }
      res.json(notifications)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error de servidor' })
    }
  }

  static async getAllNotificationsByUserId (req, res) {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(404).json({ error: 'Es necesario un usuario' })
      }
      const notifications = await NotificationsModel.getAllNotificationsByUserId(userId)
      if (!notifications) {
        return res.status(500).json({ error: 'No se encontraron notificaciones' })
      }
      res.json(notifications)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  static async getNotificationById (req, res) {
    try {
      const { notificationId } = req.params
      if (!notificationId) {
        return res.status(404).json({ error: 'Es necesario un usuario' })
      }
      const notifications = await NotificationsModel.getNotificationById(notificationId)
      if (!notifications) {
        return res.status(500).json({ error: 'No se encontraron notificaciones' })
      }
      res.json(notifications)
    } catch (error) {
      console.log(error)
      res.json({ error })
    }
  }

  static async markNotificationAsRead (req, res) {
    try {
      const { notificationId } = req.params
      if (!notificationId) {
        return res.status(404).json({ error: 'No hay ID de notificación' })
      }
      const notification = await NotificationsModel.markNotificationAsRead(notificationId)
      if (!notification) {
        return res.ststus(404).json({ error: 'No se encontró la notificación' })
      }
      res.json(notification)
    } catch (error) {
      console.log(error)
      res.json({ error })
    }
  }

  static async createNotification (req, res) {
    const { notificationId } = req.params

    // validation
  }

  static async deleteNotification (req, res) {
    const { notificationId } = req.params

    // delete from user
  }
}
