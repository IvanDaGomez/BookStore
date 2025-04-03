import { Link } from "react-router-dom"
import { formatDate } from "../../assets/formatDate"
import { reduceText, reduceTextByFirstWord } from "../../assets/reduceText"
import { renderProfilePhoto } from "../../assets/renderProfilePhoto"
import { findUserByConversation } from "./helper"

function renderFilteredConversations(filteredConversations, activeConversation, setActiveConversation, setActiveUser, user, reducedUsers) {
    return <>
        {
        
            filteredConversations
                .sort((a, b) => {
                    const dateA = a?.lastMessage?.createdIn ? new Date(a?.lastMessage?.createdIn) : 0
                    const dateB = b?.lastMessage?.createdIn ? new Date(b?.lastMessage?.createdIn) : 0
                    return dateB - dateA // Sort in descending order by last message date
                })
                .map((conversation, index) => (
                    <div
                        key={index}
                        className={`conversationSpecific ${activeConversation?._id === conversation._id ? 'active' : ''}`}
                        onClick={() => {
                            setActiveConversation(conversation)
                            setActiveUser(findUserByConversation(conversation, user, reducedUsers))
                        }}
                    >
                        <img
                            src={renderProfilePhoto(findUserByConversation(conversation, user, reducedUsers)?.fotoPerfil || '')}
                            alt={`${findUserByConversation(conversation, user, reducedUsers).nombre || 'User'}'s avatar`}
                        />
                        <div className='conversationSpecificTitleAndMessage'>
                            <h2>{findUserByConversation(conversation, user, reducedUsers).nombre || ''}</h2>
                            <span>
                                {(user && reducedUsers && conversation && conversation?.lastMessage && conversation?.lastMessage?.message) && (
                                    <>
                                        {conversation.lastMessage.userId === user._id
                                            ? 'Tu: '
                                            : `${reduceTextByFirstWord(findUserByConversation(conversation, user, reducedUsers).nombre || '')}: `}
                                        {reduceText(conversation?.lastMessage?.message, 20)}
                                    </>
                                )}

                            </span>
                        </div>
                        {/* 2024-12-21T17:01:32.197Z */}
                        <span>{formatDate(conversation?.lastMessage?.createdIn) || ''}</span>
                    </div>
                ))}</>
}

function renderMessageInput(activeConversation, handleSubmitMessage, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation, navigate) {
    {activeConversation &&
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
              </div>}
}

function renderNotificationSelector() {
    return <>
    <div className='sectionMessagesContainer'>
        <Link to='/notificaciones'><div style={{ borderTopLeftRadius: '5px' }} className='sectionMessage'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#000000' fill='none'><path d='M2.52992 14.7696C2.31727 16.1636 3.268 17.1312 4.43205 17.6134C8.89481 19.4622 15.1052 19.4622 19.5679 17.6134C20.732 17.1312 21.6827 16.1636 21.4701 14.7696C21.3394 13.9129 20.6932 13.1995 20.2144 12.5029C19.5873 11.5793 19.525 10.5718 19.5249 9.5C19.5249 5.35786 16.1559 2 12 2C7.84413 2 4.47513 5.35786 4.47513 9.5C4.47503 10.5718 4.41272 11.5793 3.78561 12.5029C3.30684 13.1995 2.66061 13.9129 2.52992 14.7696Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M8 19C8.45849 20.7252 10.0755 22 12 22C13.9245 22 15.5415 20.7252 16 19' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
          <span>Notificaciones</span>
        </div>
        </Link>
        <Link to='/mensajes'><div style={{ borderTopRightRadius: '5px' }} className='sectionMessage sectionMessageActive'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#000000' fill='none'><path d='M8.5 14.5H15.5M8.5 9.5H12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' /></svg>
          <span>Mensajes</span>
        </div>
        </Link>
      </div></>
}
export {
    renderFilteredConversations,
    renderMessageInput,
    renderNotificationSelector
}