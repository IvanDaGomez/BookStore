import fetch from 'node-fetch'
import { NotificationType } from '../../types/notification'

export async function sendNotification (body: NotificationType) {
  // La url es definida en el backend
  try {
    const notificationUrl = `${process.env.BACKEND_URL}:${process.env.PORT}/api/notifications/`
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
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error sending notification:', error)
    }
  }
}
