import { useEffect } from "react"
import { toast } from "react-toastify"

export default function useFetchPhotoAndNameUsers ({
  user,
  conversaciones,
  setReducedUsers
}) {
    useEffect(() => {
      async function fetchPhotoAndNameUsers () {
        if (!user || !user?._id || !conversaciones.length) return
        console.log(user)
        try {
          const fetchedUsers = await Promise.all(conversaciones.map(async conversacion => {
            const userConversationId = conversacion.users.find(id => id !== user._id)
            if (!userConversationId) return null
  
            const response = await fetch(`http://localhost:3030/api/users/${userConversationId}/photoAndName`)
            if (response.ok) {
              return await response.json()
            } else {
              console.error(`Failed to fetch data for user ${userConversationId}`)
              return null
            }
          }))
  
          setReducedUsers(fetchedUsers.filter(userData => userData))
        } catch (error) {
          console.error('Error fetching user data:', error)
          toast.error('Error fetching user data')
        }
      }
  
      fetchPhotoAndNameUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, conversaciones])
}