import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { BACKEND_URL } from "../../../assets/config"

export default function useFetchPhotoAndNameUsers ({
  user,
  conversaciones,
  setReducedUsers
}) {
    useEffect(() => {
      async function fetchPhotoAndNameUsers () {
        if (!user || !user?.id || conversaciones.length === 0) return
        try {
          const filterdConversaciones = conversaciones.filter((conversacion) => conversacion !== null)
          const fetchedUsers = await Promise.all(filterdConversaciones.map(async conversacion => {
            const userConversationId = conversacion.users.find(id => id !== user.id)
            if (!userConversationId) return null
            const response = await axios.get(`${BACKEND_URL}/api/users/${userConversationId}/photoAndName`)
            if (response.data.error) {
              console.error(response.data.error)
              return null
            }
            return response.data
          }))
          console.log('Fetched users:', fetchedUsers)
          setReducedUsers(fetchedUsers)
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast.error('Error fetching user data')
        }
      }
  
      fetchPhotoAndNameUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, conversaciones])
}