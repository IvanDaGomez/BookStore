export async function createNotification(userId, notification) {
    if (!userId) {
        console.error('UserID or notification is required')
        return
    }
    const url = 'http://localhost:3030/api/notifications/' + userId
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: notification
    })
    if (!response.ok) {
        console.log('Error: ' + response)
        return
    }
    const data = await response.json()
    if (data.error) {
        console.log(data.error)
        return
    }
    return data
}
