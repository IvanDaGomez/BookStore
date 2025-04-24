import { useEffect } from "react"
import { findUserByConversation } from "../helper"

export default function useCreateLocalConversation({
  user,
  newConversationId,
  setConversaciones,
  setFilteredConversations,
  conversaciones,
  reducedUsers
}) {
  useEffect(() => {
    if (!user || !user._id || !newConversationId) return
    // Si el ID no es válido y no existe salir
    if (reducedUsers.length && reducedUsers.find((usuario) => usuario._id === newConversationId) === undefined) return
    // Si hay conversaciones Y si el id de la conversación ya existe volver
    if (conversaciones.length !== 0 && conversaciones.find(conversacion => findUserByConversation(conversacion, user, reducedUsers)._id === newConversationId) !== undefined) return
    setConversaciones((prevConversaciones) => {
      // Prevent duplicate entries
      const alreadyExists = prevConversaciones?.some((c) =>
        c.users.includes(newConversationId)
      )
      if (alreadyExists) return prevConversaciones

      return [...(prevConversaciones || []), {
        users: [user._id, newConversationId]
      }]
    })

    setFilteredConversations((prevFilteredConversations) => {
      const alreadyExists = prevFilteredConversations?.some((c) =>
        c.users.includes(newConversationId)
      )
      if (alreadyExists) return prevFilteredConversations

      return [...(prevFilteredConversations || []), {
        users: [user._id, newConversationId]
      }]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newConversationId, user, conversaciones])
}