import Router from 'express';
import { NotificationsController } from '../../controllers/notifications/notificationsController.js';
export const createNotificationsRouter = ({ NotificationsModel, UsersModel }) => {
    const notificationsRouter = Router();
    const notificationsController = new NotificationsController({ NotificationsModel, UsersModel });
    notificationsRouter.get('/', notificationsController.getAllNotifications); // Conseguir todas la notificaciones
    notificationsRouter.post('/', notificationsController.createNotification);
    notificationsRouter.get('/getNotificationsByUser/:userId', notificationsController.getAllNotificationsByUserId); // Notificaciones por usuario
    notificationsRouter.put('/:notificationId/read', notificationsController.markNotificationAsRead);
    notificationsRouter.get('/:notificationId', notificationsController.getNotificationById);
    notificationsRouter.delete('/:notificationId', notificationsController.deleteNotification);
    return notificationsRouter;
};
