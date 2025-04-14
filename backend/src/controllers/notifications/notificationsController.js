import { validateNotification } from '../../assets/validate.js'

export class NotificationsController {
  constructor ({ NotificationsModel, UsersModel }) {
    this.NotificationsModel = NotificationsModel
    this.UsersModel = UsersModel
  }

  getAllNotifications = async (req, res) => {
    try {
      const notifications = await this.NotificationsModel.getAllNotifications()
      if (!notifications) {
        return res.status(404).json({ error: 'Error al conseguir las notificaciones' })
      }
      res.json(notifications)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error de servidor' })
    }
  }

  getAllNotificationsByUserId = async (req, res) => {
    try {
      const { userId } = req.params
      if (!userId) {
        return res.status(404).json({ error: 'Es necesario un usuario' })
      }
      const notifications = await this.NotificationsModel.getAllNotificationsByUserId(userId)
      if (!notifications) {
        return res.status(500).json({ error: 'No se encontraron notificaciones' })
      }
      res.json(notifications)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error en el servidor' })
    }
  }

  getNotificationById = async (req, res) => {
    try {
      const { notificationId } = req.params
      if (!notificationId) {
        return res.status(404).json({ error: 'Es necesario un usuario' })
      }
      const notifications = await this.NotificationsModel.getNotificationById(notificationId)
      if (!notifications) {
        return res.status(500).json({ error: 'No se encontraron notificaciones' })
      }
      res.json(notifications)
    } catch (error) {
      console.log(error)
      res.json({ error })
    }
  }

  markNotificationAsRead = async (req, res) => {
    try {
      const { notificationId } = req.params
      console.log(notificationId)
      if (!notificationId) {
        return res.status(404).json({ error: 'No hay ID de notificación' })
      }
      const notification = await this.NotificationsModel.markNotificationAsRead(notificationId)
      if (!notification) {
        return res.status(404).json({ error: 'No se encontró la notificación' })
      }
      res.json(notification)
    } catch (error) {
      console.error(error)
      res.json({ error })
    }
  }

  createNotification = async (req, res) => {
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
    const user = await this.UsersModel.getUserById(data.userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    const updated = await this.UsersModel.updateUser(user._id, {
      notificationsIds: [...(user.notificationsIds || []), data._id]
    })

    if (!updated) {
      return res.status(404).json({ error: 'Usuario no actualizado' })
    }

    const time = new Date()
    data.createdIn = `${time.toISOString()}`
    data.expiresAt = `${new Date(time.setDate(time.getDate() + 30)).toISOString()}`
    data.read = false
    // Crear el notificacion en la base de datos
    const notification = await this.NotificationsModel.createNotification(data)
    if (typeof notification === 'string' && notification.startsWith('Error')) {
      return res.status(500).json({ error: notification })
    }
    if (!notification) {
      return res.status(500).json({ error: 'Error al crear notificacion' })
    }

    // Si todo es exitoso, devolver el notificacion creado
    res.send(notification)
  }

  deleteNotification = async (req, res) => {
    try {
      const { notificationId } = req.params

      // Obtener los detalles del notificacion para encontrar al vendedor (idVendedor)
      const notification = await this.NotificationsModel.getNotificationById(notificationId)
      if (!notification) {
        return res.status(404).json({ error: 'Notificacion no encontrada' })
      }

      // Obtener el usuario asociado con el notificacion
      const user = await this.UsersModel.getUserById(notification.userId)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      // Eliminar el notificationId del array notificacionsIds del usuario
      const updatedNotificationsIds = (user.notificationsIds || []).filter(id => id !== notificationId)

      // Actualizar el usuario con los nuevos notificacionsIds
      const updatedUser = await this.UsersModel.updateUser(user._id, {
        notificationsIds: updatedNotificationsIds
      })

      if (!updatedUser) {
        return res.status(404).json({ error: 'Usuario no actualizado' })
      }

      // Eliminar el notificacion de la base de datos

      const result = await this.NotificationsModel.deleteNotification(notificationId)
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
