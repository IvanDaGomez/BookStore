import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchNotifications(user) {
  const [notifications, setNotifications] = useState([])
    useEffect(() => {
      async function fetchNotifications () {
        if (!user || Object.keys(user).length === 0) return
        const url = 'http://localhost:3030/api/notifications/getNotificationsByUser/' + user.id
        const response = await axios.get(url)
        setNotifications(response.data)
      }
      fetchNotifications()
    }, [user])
  return [notifications, setNotifications]
}