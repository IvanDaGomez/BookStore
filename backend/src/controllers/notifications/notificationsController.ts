import { validateNotification } from '../../assets/validate.js'
import { INotificationsModel, IUsersModel } from '../../types/models.js'
import express from 'express'
import { ID, ISOString } from '../../types/objects.js'
import { NotificationType } from '../../types/notification.js'
export class NotificationsController {
  private NotificationsModel: INotificationsModel
  private UsersModel: IUsersModel
  constructor ({ NotificationsModel, UsersModel }: 
    { NotificationsModel: INotificationsModel, UsersModel: IUsersModel }) {
    this.NotificationsModel = NotificationsModel
    this.UsersModel = UsersModel
  }

  getAllNotifications = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const notifications = await this.NotificationsModel.getAllNotifications()
      res.json(notifications)
    } catch (err) {
      next(err)
    }
  }

  getAllNotificationsByUserId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const userId = req.params.userId as ID | undefined
      if (!userId) {
        return res.status(404).json({ error: 'Es necesario un usuario' })
      }
      const notifications = await this.NotificationsModel.getAllNotificationsByUserId(userId)
      res.json(notifications)
    } catch (err) {
      next(err)
    }
  }

  getNotificationById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const notificationId = req.params.notificationId as ID | undefined
      if (!notificationId) {
        return res.status(404).json({ error: 'Es necesario un ID' })
      }
      const notifications = await this.NotificationsModel.getNotificationById(notificationId)

      res.json(notifications)
    } catch (err) {
      next(err)
    }
  }

  markNotificationAsRead = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const notificationId = req.params.notificationId as ID | undefined
      if (!notificationId) {
        return res.status(404).json({ error: 'No hay ID de notificación' })
      }
      const notification = await this.NotificationsModel.markNotificationAsRead(notificationId)

      res.json(notification)
    } catch (err) {
      next(err)
    }
  }

  createNotification = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const data = req.body as NotificationType;
  
      // Validación
      const validated = validateNotification(data);
      if (!validated.success) {
        return res.status(400).json({ error: validated.error });
      }
  
      data._id = crypto.randomUUID();
  
      // Obtener el usuario y crear la notificación en paralelo
      const [user, notification] = await Promise.all([
        this.UsersModel.getUserById(data.userId), 
        this.NotificationsModel.createNotification(data)
      ]);
  
      // Actualizar las notificaciones del usuario
      await this.UsersModel.updateUser(user._id, {
        notificationsIds: [...user.notificationsIds, data._id]
      });
  
      res.json(notification);
    } catch (err) {
      next(err);
    }
  }

  deleteNotification = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const notificationId = req.params.notificationId as ID | undefined
      if (!notificationId) {
        return res.status(404).json({ error: 'Es necesario un ID' })
      }

      // Obtener los detalles del notificacion para encontrar al vendedor (idVendedor)
      const notification = await this.NotificationsModel.getNotificationById(notificationId)

      // Obtener el usuario asociado con el notificacion
      const user = await this.UsersModel.getUserById(notification.userId)

      // Eliminar el notificationId del array notificacionsIds del usuario
      const updatedNotificationsIds = user.notificationsIds.filter(id => id !== notificationId)

      // Actualizar el usuario con los nuevos notificacionsIds
      await Promise.all([
        this.UsersModel.updateUser(user._id, {
          notificationsIds: updatedNotificationsIds
        }),
        this.NotificationsModel.deleteNotification(notificationId)
      ])

      res.json({ message: 'Notificacion eliminada con éxito' })
    } catch (err) {
      next(err)
    }
  }
}
