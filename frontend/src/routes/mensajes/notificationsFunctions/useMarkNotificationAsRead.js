import axios from "axios"
import { useEffect } from "react"

export default function useMarkNotificationAsRead(activeNotification) {
  useEffect(() => {
      if (!activeNotification || activeNotification.read) return
      async function fetchReadNotification () {
        try {
          const url = `http://localhost:3030/api/notifications/${activeNotification.id}/read`
          const read = await axios.put(url)
          if (read.data.error) {
            console.error('Error marking notification as read')
          }
        } catch (error) {
          console.error(error)
        }
      }
      fetchReadNotification()
    }, [activeNotification]) // Only trigger when the active notification changes
}