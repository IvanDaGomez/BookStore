import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../../assets/config"

export default function useFetchNotifications(user) {
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
    useEffect(() => {
      async function fetchNotifications () {
        if (!user || Object.keys(user).length === 0) return
        const url = `${BACKEND_URL}/api/notifications/getNotificationsByUser/${user.id}`
        const response = await axios.get(url)
        console.log('Response:', response.data)
        setNotifications(response.data)
        setFilteredNotifications(response.data)
      }
      fetchNotifications()
    }, [user])
  return [notifications, setNotifications, filteredNotifications, setFilteredNotifications]
}