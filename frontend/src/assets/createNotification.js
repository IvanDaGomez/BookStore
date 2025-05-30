import { BACKEND_URL } from './config'

async function createNotification (notification) {
  const url = `${BACKEND_URL}/api/notifications/`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(notification),
    credentials: 'include'
  })
  if (!response.ok) {
    console.log('Error creando notificación')
    return
  }
  const data = await response.json()
  if (data.error) {
    console.log(data.error)
    return
  }
  return data
}

export { createNotification }
