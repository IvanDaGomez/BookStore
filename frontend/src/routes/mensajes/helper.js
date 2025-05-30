/* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
import { useEffect } from "react"

import { toast } from "react-toastify"
import { BACKEND_URL } from "../../assets/config";


function useFetchConversations(user, setConversaciones, setFilteredConversations, newConversationId) {
    useEffect(() => {
        if (!user || !user.id) return;

        const controller = new AbortController(); // ✅ Handle unmounts
        const signal = controller.signal;

        async function fetchConversations() {
            try {
                const url = `${BACKEND_URL}/api/conversations/getConversationsByUser/${user.id}`;
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
  const otherUserId = conversation?.users.filter(u => u !== null)
  .find(u => u !== user?.id)
  if (!otherUserId) return {}
  // Find the user object for the other user in reducedUsers
  const userMatch = reducedUsers
  .filter(reducedUser => reducedUser !== null)
  .find(reducedUser => reducedUser?.id === otherUserId)
  return userMatch || {}
}
  async function fetchNewConversation (user, newConversationId, conversaciones, setConversaciones) {
    // Ensure user, user.id, and newConversationId are defined
    if (!user || !user.id || !newConversationId || !conversaciones) return

    // Check if the conversation already exists to avoid redundant requests
    if (conversaciones
      .filter(c => c !== null)
      .some((c) => c.id === newConversationId)) return

    const body = { users: [user.id, newConversationId] }

    try {
      const url = `${BACKEND_URL}/api/conversations`
      const response = await axios.post(url, body, { withCredentials: true })

      console.log('Response:', response.data)
      if (response.data.error) {
        console.error(response.data.error)
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
        updatedConversations.push(response.data)
        return updatedConversations
      })
      console.log('New conversation created:', response.data)
      return response.data
    } catch (error) {
      console.error('Error creating a new conversation:', error)
      toast.error('Error creating a new conversation')
    }
  }
async function handleSubmitMessage (e, activeConversation, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation, navigate) {
  e.preventDefault()
  const messageInput = document.querySelector('#messageInput')
  const value = messageInput.value.trim() // Trim whitespace
  const url = `${BACKEND_URL}/api/messages`
  if (!(value && activeConversation && user)) return // Validate inputs
  let newConversation = {}
  // Si hay un ID de conversación Y si el usuario ya está en las conversaciones
  if (newConversationId && conversaciones
    .filter(c => c !== null)
    .find(conversacion => Object.keys(conversacion).length > 1 && findUserByConversation(conversacion, user, reducedUsers)?.id === newConversationId) === undefined) {
      newConversation = await fetchNewConversation(user, newConversationId, conversaciones, setConversaciones)
  }

  try {
    const body = {
          user_id: user.id,
          conversation_id: newConversation?.id ?? activeConversation.id,
          message: value,
          created_in: new Date().toISOString(),
          read: false
      }
      const response = await axios.post(url, body, { withCredentials: true })

      if (response.data.error) {
        toast.error('Error en la respuesta')
        return
      }
      // Add the new message to messages state
      setMensajes((prevMensajes) => {
        let updatedMensajes = [...prevMensajes, response.data]; // Create a new array with the new message at the end
        updatedMensajes = updatedMensajes.sort((a, b) => new Date(a.created_in) - new Date(b.created_in)); // Sort the messages by created_in
        console.log('Updated messages:', updatedMensajes)
        return updatedMensajes; // Return the updated array
      });

      // Update conversations and activeConversation lastMessage
      setConversaciones((prevConversaciones) => {
      return prevConversaciones
      .filter((conversacion) => conversacion !== null) 
      .map((conversacion) => {
          if (conversacion.id === activeConversation.id) {
          return {
              ...conversacion,
              last_message: response.data // Update lastMessage
          }
          }
          return conversacion // Return the conversation without changes
      })
      })
      // Update conversations and activeConversation lastMessage
      setFilteredConversations((prevConversaciones) => {
      return prevConversaciones
      .filter((conversacion) => conversacion !== null)
      .map((conversacion) => {
          if (conversacion.id === activeConversation.id) {
          return {
              ...conversacion,
              last_message: response.data // Update lastMessage
          }
          }
          return conversacion // Return the conversation without changes
      })
      })
      // Set active conversation last message, ensure it's correctly set
      setActiveConversation(prevActiveConversation => ({
      ...prevActiveConversation,
      last_message: response.data
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
    useFetchConversations,
    findUserByConversation,
    handleSubmitMessage
}