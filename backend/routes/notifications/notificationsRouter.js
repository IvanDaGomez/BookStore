import Router from 'express'
import { NotificationsController } from '../../controllers/notifications/notificationsController.js'
const notificationsRouter = Router()

notificationsRouter.get('/', NotificationsController.getAllNotifications) // Conseguir todas la notificaciones
notificationsRouter.post('/', NotificationsController.createNotification)
notificationsRouter.get('/getNotificationsByUser/:userId', NotificationsController.getAllNotificationsByUserId) // Notificaciones por usuario
notificationsRouter.get('/:notificationId', NotificationsController.getNotificationById) // No
notificationsRouter.get('/:notificationId/read', NotificationsController.markNotificationAsRead)

notificationsRouter.delete('/:notificationId', NotificationsController.deleteNotification)

export { notificationsRouter }
