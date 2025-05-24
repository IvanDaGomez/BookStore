import fetch from 'node-fetch'
import { NotificationType } from '../../types/notification'

export async function sendNotification (body: NotificationType) {
  // La url es definida en el backend
  const notificationUrl = `${process.env.BACKEND_URL}/api/notifications/`
  const response = await fetch(notificationUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error('Error creando notificación')
  }
}
