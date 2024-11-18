import axios from "axios"
export async function createNotification(userId, notification) {
    if (!userId) {
        console.error('UserID or notification is required')
        return
    }
    const url = 'http://localhost:3030/api/notifications/' + userId
    const response = await axios.post(url, notification, { withCredentials: true})
    return response.data
}
