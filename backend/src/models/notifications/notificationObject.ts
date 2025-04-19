import { NotificationType } from "../../types/notification"
import { ISOString } from "../../types/objects"

const notificationObject = (data: Partial<NotificationType>): NotificationType => {
  
  return {
    _id: data._id ?? crypto.randomUUID(),
    title: data.title ?? '',
    priority: data.priority ?? 'low',
    type: data.type ?? 'notRegistered',
    userId: data.userId ?? crypto.randomUUID(),
    input: data.input ?? '',
    createdIn: data.createdIn ?? new Date().toISOString() as ISOString,
    read: data.read ?? false,
    actionUrl: data.actionUrl,
    expiresAt: data.expiresAt ?? new Date(new Date().setDate(new Date().getDate() + 30)).toISOString() as ISOString,
    metadata: data.metadata ?? {}
  }
}

export { notificationObject }