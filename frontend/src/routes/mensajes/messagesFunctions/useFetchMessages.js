import axios from "axios"
import { useEffect } from "react"
import { toast } from "react-toastify"
import { BACKEND_URL } from "../../../assets/config"

export default function useFetchMessages({
  activeConversation, setMensajes
}) {
    useEffect(() => {
      async function fetchMessages () {
        if (!activeConversation || Object.keys(activeConversation).length === 0 || !activeConversation.id) return
        try {
          const url = `${BACKEND_URL}/api/messages/messageByConversation/${activeConversation.id}`
          const response = await axios.get(url)
  
          if (response.data.error) {
            toast.error(response.data.error)
            return
          }
          const mensajes = response.data
          .filter(m => m !== null)
          .sort((a, b) => new Date(a.created_in) - new Date(b.created_in))
          setMensajes(mensajes)
        } catch (error) {
          console.error('Error fetching messages:', error)
          toast.error('Error fetching messages')
        }
      }
      fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConversation])
}