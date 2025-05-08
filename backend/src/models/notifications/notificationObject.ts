import { NotificationType } from '../../types/notification'
import { ISOString } from '../../types/objects'

const notificationObject = (
  data: Partial<NotificationType>
): NotificationType => {
  return {
    id: data.id ?? crypto.randomUUID(),
    title: data.title ?? '',
    priority: data.priority ?? 'low',
    type: data.type ?? 'invalidNotification',
    user_id: data.user_id ?? crypto.randomUUID(),
    input: data.input ?? '',
    created_in: data.created_in ?? (new Date().toISOString() as ISOString),
    read: data.read ?? false,
    action_url: data.action_url,
    expires_at:
      data.expires_at ??
      (new Date(
        new Date().setDate(new Date().getDate() + 30)
      ).toISOString() as ISOString),
    metadata: data.metadata ?? {}
  }
}

export { notificationObject }
