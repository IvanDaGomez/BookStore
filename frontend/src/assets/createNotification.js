async function createNotification (notification) {
  const url = 'http://localhost:3030/api/notifications/'
  console.log(JSON.stringify(notification))
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
