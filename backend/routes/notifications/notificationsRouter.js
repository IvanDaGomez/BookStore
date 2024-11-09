import Router from 'express'
import { NotificationsController } from '../../controllers/notifications/notificationsController'
const notificationsRouter = Router()

notificationsRouter.get('/', NotificationsController.getAllNotifications) // Conseguir todas la notificaciones
notificationsRouter.post('/', NotificationsController.createNotification)
notificationsRouter.get('/getNotificationsByUser/:userId', NotificationsController.getAllNotificationsByUserId) // Notificaciones por usuario
notificationsRouter.get(':userId', NotificationsController.getNotificationById) // No
notificationsRouter.get('/:userId/read', NotificationsController.markNotificationAsRead)

notificationsRouter.delete('/:userId', NotificationsController.deleteNotification)

export { notificationsRouter }
