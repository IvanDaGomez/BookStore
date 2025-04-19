import { NotificationType } from "../../types/notification"

const notificationObject = (data: NotificationType): NotificationType => {
  return {
    _id: data._id || '',
    title: data.title || '',
    priority: data.priority || '',
    type: data.type || '',
    userId: data.userId || '',
    input: data.input || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false,
    actionUrl: data.actionUrl || '',
    expiresAt: data.expiresAt || new Date().toISOString(),
    metadata: data.metadata || {}
  }
}

export { notificationObject }