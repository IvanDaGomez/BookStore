import { PropTypes } from 'prop-types';
import { useNavigate } from 'react-router';
import { handleSubmitMessage } from '../helper.js';
export default function MessageInput({ activeConversation, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation }) {
  const navigate = useNavigate()
  return(<>{activeConversation &&
            <div className='messageInputContainer'>
              <textarea
                id='messageInput'
                rows='1'
                onInput={(event) => {
                  const textarea = event.target
                  textarea.style.height = 'auto' // Restablece la altura para recalcular
                  textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px` // Expande hasta 4 líneas (4 * 24px de altura típica por línea)
                }}
                onKeyDown={(event) => {
                  const textarea = event.target

                  // Shift + Enter: Añade un salto de línea
                  if (event.key === 'Enter' && event.shiftKey) {
                    event.preventDefault()
                    const start = textarea.selectionStart
                    const end = textarea.selectionEnd

                    textarea.value = textarea.value.substring(0, start) + '\n' + textarea.value.substring(end)

                    textarea.selectionStart = textarea.selectionEnd = start + 1
                    textarea.style.height = 'auto'
                    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px` // Recalcula la altura
                  }
                  // Enter: Envía el mensaje
                  else if (event.key === 'Enter') {
                    event.preventDefault()
                    handleSubmitMessage(event, activeConversation, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation, navigate)
                  }
                }}
              />

              <div className='send' onClick={(event) => handleSubmitMessage(event, activeConversation, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation, navigate)}>
                <img src='/sendMessage.svg' alt='Send Message' />
              </div>
            </div>}</>)
}
MessageInput.propTypes = {
  activeConversation: PropTypes.object,
  handleSubmitMessage: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  newConversationId: PropTypes.string,
  conversaciones: PropTypes.array.isRequired,
  setConversaciones: PropTypes.func.isRequired,
  setMensajes: PropTypes.func.isRequired,
  setFilteredConversations: PropTypes.func.isRequired,
  reducedUsers: PropTypes.array.isRequired,
  setActiveConversation: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};