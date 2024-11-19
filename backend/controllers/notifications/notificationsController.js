import { NotificationsModel } from '../../models/notifications/notificationsModel.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { validateNotification } from '../../assets/validate.js'

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
        return res.status(404).json({ error: 'No se encontró la notificación' })
      }
      res.json(notification)
    } catch (error) {
      console.error(error)
      res.json({ error })
    }
  }

  static async createNotification (req, res) {
    const data = req.body

    // Validación
    const validated = validateNotification(data)
    if (!validated.success) {
      console.log('Error de validación:', validated.error)
      return res.status(400).json({ error: validated.error })
    }

    // Asignar un ID único al notificacion
    data._id = crypto.randomUUID()

    // Agregar el ID del notificacion al usuario
    const user = await UsersModel.getUserById(data.userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const updated = await UsersModel.updateUser(user._id, {
      notificationsIds: [...(user.notificationsIds || []), data._id]
    })

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no actualizado' })
    }

    const time = new Date()
    data.createdIn = time
    data.expiresAt = time.setDate(time.getDate() + 30)
    data.read = false
    // Crear el notificacion en la base de datos
    const notification = await NotificationsModel.createNotification(data)
    if (typeof notification === 'string' && notification.startsWith('Error')) {
      return res.status(500).json({ error: notification })
    }
    if (!notification) {
      return res.status(500).json({ error: 'Error al crear notificacion' })
    }

    // Si todo es exitoso, devolver el notificacion creado
    res.send(notification)
  }

  static async deleteNotification (req, res) {
    try {
      const { notificationId } = req.params

      // Obtener los detalles del notificacion para encontrar al vendedor (idVendedor)
      const notification = await NotificationsModel.getNotificationById(notificationId)
      if (!notification) {
        return res.status(404).json({ error: 'Notificacion no encontrada' })
      }

      // Obtener el usuario asociado con el notificacion
      const user = await UsersModel.getUserById(notification.userId)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      // Eliminar el notificationId del array notificacionsIds del usuario
      const updatedNotificationsIds = (user.notificationsIds || []).filter(id => id !== notificationId)

      // Actualizar el usuario con los nuevos notificacionsIds
      const updatedUser = await UsersModel.updateUser(user._id, {
        notificationsIds: updatedNotificationsIds
      })

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no actualizado' })
      }

      // Eliminar el notificacion de la base de datos

      const result = await NotificationsModel.deleteNotification(notificationId)
      if (!result) {
        return res.status(404).json({ error: 'Notificacion no encontrada' })
      }

      res.json({ message: 'Notificacion eliminada con éxito', result })
    } catch (err) {
      console.error('Error al eliminar la notificacion:', err)
      res.status(500).json({ error: 'Error al eliminar la notificacion' })
    }
  }
}
