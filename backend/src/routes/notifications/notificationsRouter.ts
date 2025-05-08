import Router, { RequestHandler } from 'express'
import { NotificationsController } from '../../controllers/notifications/notificationsController.js'
import { INotificationsModel, IUsersModel } from '../../types/models.js'
export const createNotificationsRouter = ({
  NotificationsModel,
  UsersModel
}: {
  NotificationsModel: INotificationsModel
  UsersModel: IUsersModel
}) => {
  const notificationsRouter = Router()
  const notificationsController = new NotificationsController({
    NotificationsModel,
    UsersModel
  })

  notificationsRouter.get(
    '/',
    notificationsController.getAllNotifications as RequestHandler
  ) // Conseguir todas la notificaciones
  notificationsRouter.post(
    '/',
    notificationsController.createNotification as RequestHandler
  )
  notificationsRouter.get(
    '/getNotificationsByUser/:user_id',
    notificationsController.getAllNotificationsByUserId as RequestHandler
  ) // Notificaciones por usuario
  notificationsRouter.put(
    '/:notification_id/read',
    notificationsController.markNotificationAsRead as RequestHandler
  )
  notificationsRouter.get(
    '/:notification_id',
    notificationsController.getNotificationById as RequestHandler
  )

  notificationsRouter.delete(
    '/:notification_id',
    notificationsController.deleteNotification as RequestHandler
  )

  return notificationsRouter
}
