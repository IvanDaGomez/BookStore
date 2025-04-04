/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"

function useFetchuser() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
      // Fetch del usuario primero que todo
      useEffect(() => {
        async function fetchUser () {
          try {
            const response = await fetch('http://localhost:3030/api/users/userSession', {
              method: 'POST',
              credentials: 'include'
            })
    
            if (response.ok) {
              const data = await response.json()
              setUser(data.user)
            } else {
              // Esto es exclusivo de los que son usuarios
              navigate('popUp/noUser')
            }
          } catch (error) {
            console.error('Error fetching user data:', error)
            navigate('popUp/noUser')
          }
        }
        fetchUser()
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    return [user]
}

function useFetchConversations(user, setConversaciones, setFilteredConversations, newConversationId) {
    useEffect(() => {
        if (!user || !user._id) return;

        const controller = new AbortController(); // ✅ Handle unmounts
        const signal = controller.signal;

        async function fetchConversations() {
            try {
                const url = `http://localhost:3030/api/conversations/getConversationsByUser/${user._id}`;
                const response = await fetch(url, { signal });
                if (!response.ok) throw new Error("Failed to fetch");

                const conversations = await response.json();
                if (conversations.error) return;

                // ✅ Avoid unnecessary re-renders
                setConversaciones(prev => (JSON.stringify(prev) !== JSON.stringify(conversations) ? conversations : prev));
                setFilteredConversations(prev => (JSON.stringify(prev) !== JSON.stringify(conversations) ? conversations : prev));
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching conversations:", error);
                    toast.error("Error fetching conversations");
                }
            }
        }

        fetchConversations();

        return () => controller.abort(); // ✅ Cleanup to prevent memory leaks
    }, [user, newConversationId]);
}
function findUserByConversation (conversation, user, reducedUsers) {
    const otherUserId = conversation.users.find(u => u !== user._id)
    if (!otherUserId) return {}

    // Find the user object for the other user in reducedUsers
    const userMatch = reducedUsers.find(reducedUser => reducedUser._id === otherUserId)

    return userMatch || {}
}
  async function fetchNewConversation (user, newConversationId, conversaciones, setConversaciones) {
    // Ensure user, user._id, and newConversationId are defined
    if (!user || !user._id || !newConversationId || !conversaciones) return

    // Check if the conversation already exists to avoid redundant requests
    if (conversaciones.some((c) => c._id === newConversationId)) return

    const body = JSON.stringify({ users: [user._id, newConversationId] })

    try {
      const url = 'http://localhost:3030/api/conversations'
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        credentials: 'include'
      })

      if (!response.ok) {
        console.error('Error in response while creating a new conversation')
        return
      }

      const data = await response.json()
      if (data.error) {
        return
      }

      // Replace the last conversation with the new one
      setConversaciones((prev) => {
        const updatedConversations = [...prev]
        // Remove the last conversation if it exists
        if (updatedConversations.length > 0) {
          updatedConversations.pop()
        }
        // Add the new conversation
        updatedConversations.push(data.conversation)
        return updatedConversations
      })

      return data.conversation
    } catch (error) {
      console.error('Error creating a new conversation:', error)
      toast.error('Error creating a new conversation')
    }
  }
async function handleSubmitMessage (e, activeConversation, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation, navigate) {
    e.preventDefault()
const messageInput = document.querySelector('#messageInput')
const value = messageInput.value.trim() // Trim whitespace
const url = 'http://localhost:3030/api/messages'

if (!(value && activeConversation && user)) return // Validate inputs
let newConversation = false

// Si hay un ID de conversación Y si el usuario ya está en las conversaciones
if (newConversationId && conversaciones.find(conversacion => Object.keys(conversacion).length > 1 && findUserByConversation(conversacion, user, reducedUsers)?._id === newConversationId) === undefined) {
    newConversation = await fetchNewConversation(user, newConversationId, conversaciones, setConversaciones)
}

try {
    const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json' // Set JSON header
    },
    body: JSON.stringify({
        userId: user._id,
        conversationId: newConversation?._id || activeConversation._id,
        message: value,
        read: false
    }),
    credentials: 'include'
    })

    if (!response.ok) {
    toast.error('Error en la respuesta')
    return
    }

    const responseData = await response.json() // Parse JSON response

    // Add the new message to messages state
    setMensajes((prevMensajes) => [...prevMensajes, responseData.message])

    // Update conversations and activeConversation lastMessage
    setConversaciones((prevConversaciones) => {
    return prevConversaciones.map((conversacion) => {
        if (conversacion._id === activeConversation._id) {
        return {
            ...conversacion,
            lastMessage: responseData.message // Update lastMessage
        }
        }
        return conversacion // Return the conversation without changes
    })
    })
    // Update conversations and activeConversation lastMessage
    setFilteredConversations((prevConversaciones) => {
    return prevConversaciones.map((conversacion) => {
        if (conversacion._id === activeConversation._id) {
        return {
            ...conversacion,
            lastMessage: responseData.message // Update lastMessage
        }
        }
        return conversacion // Return the conversation without changes
    })
    })

    // Set active conversation last message, ensure it's correctly set
    setActiveConversation(prevActiveConversation => ({
    ...prevActiveConversation,
    lastMessage: responseData.message
    }))

    // Clear input field
    messageInput.value = ''
    messageInput.style.height = 'auto'
    if (newConversationId) {
        navigate('/mensajes')
    }
} catch (error) {
    console.error('Error sending message:', error)
    toast.error('Error al enviar el mensaje')
}
}
export {
    useFetchuser,
    useFetchConversations,
    findUserByConversation,
    handleSubmitMessage
}