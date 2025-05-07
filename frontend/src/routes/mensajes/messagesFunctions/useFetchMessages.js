import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"

export default function useFetchMessages({
  activeConversation, setMensajes
}) {
    useEffect(() => {
      async function fetchMessages () {
        if (!activeConversation || Object.keys(activeConversation).length === 0 || !activeConversation.id) return
        try {
          const url = `http://localhost:3030/api/messages/messageByConversation/${activeConversation.id}`
          const response = await axios.get(url)
  
          if (response.data.error) {
            toast.error(response.data.error)
            return
          }
          setMensajes(response.data)
        } catch (error) {
          console.error('Error fetching messages:', error)
          toast.error('Error fetching messages')
        }
      }
      fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversation])
}