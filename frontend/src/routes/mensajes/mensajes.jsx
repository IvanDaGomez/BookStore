import { useState, useEffect, useRef, useContext } from 'react'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import Footer from '../../components/footer/footer.jsx'
import { ToastContainer } from 'react-toastify'
import { useSearchParams } from 'react-router-dom'
import { findUserByConversation, useFetchConversations } from './helper'
import { renderFilteredConversations } from './helperComponents'
import { UserContext } from '../../context/userContext.jsx'
import NotificationsHeader from './notificationsHeader.jsx'
import useUpdateBreakpoint from '../../assets/useUpdateBreakPoint.js'
import ChatHeader from './chatHeader.jsx'
import useMessageInputForConversation from './messagesFunctions/useMessageInputForConversation.js'
import useFetchActualBook from '../../assets/useFetchActualBook.js'
import { filterConversations } from './messagesFunctions/filterConversations.js'
import useFetchMessages from './messagesFunctions/useFetchMessages.js'
import useFetchPhotoAndNameUsers from './messagesFunctions/useFetchPhotoAndName.js'
import useCreateLocalConversation from './messagesFunctions/useCreateLocalConversation.js'
import MessageInput from './messagesFunctions/messageInput.jsx'
import './messages.css'
import './notifications.css'
import { useReturnIfNoUser } from '../../assets/useReturnIfNoUser.js'
export default function Mensajes () {

  const [activeConversation, setActiveConversation] = useState(null)

  // --------------------------------------LOGICA DE MENSAJES-------------------------------------------
  const { user, loading } = useContext(UserContext)
  useReturnIfNoUser(user, loading, false)
  
  const [mensajes, setMensajes] = useState([])
  const [conversaciones, setConversaciones] = useState([])
  const [urlSearchParams] = useSearchParams() 
  const newConversationId = urlSearchParams.get('n')
  const [filteredConversations, setFilteredConversations] = useState([])
  const [activeUser, setActiveUser] = useState({})
  const [reducedUsers, setReducedUsers] = useState([])
  const isMobile = useUpdateBreakpoint(734)
  useFetchConversations(user, setConversaciones, setFilteredConversations, newConversationId)

  // -------------------------------------------------------------------------

  useEffect(() => {
    if (newConversationId && conversaciones && reducedUsers) {
      setActiveConversation(conversaciones.find(conversacion => findUserByConversation(conversacion, user, reducedUsers).id === newConversationId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newConversationId, conversaciones, reducedUsers])


  // Create a reference for scrolling
  const chatContainerRef = useRef(null)

  useEffect(() => {
    const storedActiveConversation = localStorage.getItem('activeConversation')

    if (storedActiveConversation) {
      const parsedConversation = JSON.parse(storedActiveConversation)
      setActiveConversation(parsedConversation)
    }
  }, [])


  // -------------------------------------LOGICA DE CONVERSACIONES-----------------------------------------//EDITAR
  // Crear una conversación local

  useCreateLocalConversation({
    user,
    newConversationId,
    setConversaciones,
    setFilteredConversations,
    conversaciones,
    reducedUsers
  })

  useEffect(() => {
    if (conversaciones && user && newConversationId &&
            activeConversation &&
            findUserByConversation(activeConversation, user, reducedUsers).id === newConversationId) {
      setActiveConversation(conversaciones
        .filter(c => c !== null)
        .find(conversacion => conversacion.users.find(u => u !== user.id) === newConversationId))
      setActiveUser(findUserByConversation(activeConversation, user, reducedUsers))
    }
  }, [newConversationId, conversaciones, user, activeConversation, reducedUsers])

  useFetchPhotoAndNameUsers({
    user,
    conversaciones,
    setReducedUsers
  })
  
  useFetchMessages({
    activeConversation, setMensajes
  })


  // Scroll to the bottom after adding the message
  useEffect(() => {
    if (chatContainerRef.current && mensajes.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [mensajes])

  // -----------------------------------------------------------------FILTRO DEL CHAT----------------------------------------


  // -------------------------------------------------------------Lógica para preguntar sobre un libro en específico
  const [libroAPreguntar, setLibroAPreguntar] = useState({})
  const idLibro = urlSearchParams.get('q')
  useFetchActualBook(idLibro, setLibroAPreguntar)
  useMessageInputForConversation({
    newConversationId,
    libroAPreguntar,
    activeConversation,
    user,
    reducedUsers
  })

  // -----------------------------------------------------------Teléfono---------------------------------------
  // slide when a conversation is active or not

  useEffect(() => {
    const messagesContainer = document.querySelector('.messagesContainer')
    if (activeConversation && isMobile && messagesContainer) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
    } else if (!activeConversation && isMobile && messagesContainer) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
    }
  }, [activeConversation, isMobile])

  return (
    <>
      <Header />
      {/* ----------------------------------------SELECCION DE NOTIFICACION----------------------------------------------- */}
      <NotificationsHeader active={'messages'} />
      {/* ----------------------------------------MENSAJES EN PC----------------------------------------------- */}
        <div className='messagesContainer'>
          <div className='conversationsContainer'>
            <input type='text' className='conversationsFilter' 
            onChange={(e) => filterConversations({e,
    conversaciones,
    setFilteredConversations,
    user,
    reducedUsers})} placeholder='Buscar' />

            {/* ----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
            {renderFilteredConversations(filteredConversations, activeConversation, setActiveConversation, setActiveUser, user, reducedUsers)}
          </div>

          <div className='chat'>
            {/* ----------------------------------------ENCABEZADO DEL CHAT----------------------------------------------- */}
            <ChatHeader
            user={user}
            reducedUsers={reducedUsers}
            activeUser={activeUser}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            isMobile={isMobile}
            />
            {/* ----------------------------------------MENSAJES----------------------------------------------- */}
            {/* {console.log('Mensajes:', mensajes)} */}
            <div className='messagesViewContainer' ref={chatContainerRef}>
              {mensajes.map((mensaje, index) => (
                <div key={index} className={`mensaje ${mensaje?.user_id === user?.id ? 'myMessage' : 'otherMessage'}`}>
                  {mensaje.message}
                </div>
              ))}
            </div>
            {/* ----------------------------------------CONTENEDOR DE ENVIAR MENSAJE----------------------------------------------- */}
            <MessageInput 
            activeConversation={activeConversation}
            user={user} 
            newConversationId={newConversationId} 
            conversaciones={conversaciones} 
            setConversaciones={setConversaciones}
            setMensajes={setMensajes}
            setFilteredConversations={setFilteredConversations}
            reducedUsers={reducedUsers}
            setActiveConversation={setActiveConversation}/>
          </div>
        </div>

      <Footer />
      <SideInfo />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
    </>
  )
}
