import { useEffect } from "react"
import { findUserByConversation } from "../helper"

export default function useMessageInputForConversation({
  newConversationId,
  libroAPreguntar,
  activeConversation,
  user,
  reducedUsers
}){
  // const convertToLinks = (text) => {
  //   const urlRegex = /(https?:\/\/[^\s]+)/g
  //   return text.split(urlRegex).map((part, index) =>
  //     urlRegex.test(part) ? <a key={index} href={part} target='_blank' rel='noopener noreferrer'>{part}</a> : part
  //   )
  // }
  useEffect(() => {
    // Si hay un nuevo usuario (para hacer activa su conversación), y renderizó el input, y si el libro a preguntar coincida con el vendedor
    const inputMessage = document.querySelector('#messageInput')
    if (
      newConversationId &&
            Object.keys(libroAPreguntar).length !== 0 &&
            inputMessage &&
            activeConversation &&
            libroAPreguntar.idVendedor === findUserByConversation(activeConversation, user, reducedUsers).id
    ) {
      const vendedorNombre = findUserByConversation(activeConversation, user, reducedUsers).nombre
      const libroTitulo = libroAPreguntar.titulo
      const libroUrl = `http://localhost:5173/libros/${libroAPreguntar.id}`

      inputMessage.value = `
            ¡Hola ${vendedorNombre}! 😊
    
            Me interesa mucho el libro que estás ofreciendo: *${libroTitulo}*. ¿Podrías contarme un poco más al respecto? Aquí está el enlace del libro para que lo tengas a mano: 
            ${libroUrl}
    
            ¡Muchas gracias de antemano! Espero tu respuesta. 😊
            `.trim() // Elimina espacios adicionales al inicio o final del mensaje
    } else if (inputMessage) {
      inputMessage.value = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newConversationId, libroAPreguntar, activeConversation])
}