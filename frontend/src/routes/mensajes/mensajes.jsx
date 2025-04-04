/* eslint-disable no-unused-vars */

/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import Header from '../../components/header'
import SideInfo from '../../components/sideInfo'
import Footer from '../../components/footer'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { reduceText, reduceTextByFirstWord } from '../../assets/reduceText'
import { formatDate } from '../../assets/formatDate'

import axios from 'axios'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto'
import { findUserByConversation, handleSubmitMessage, useFetchConversations, useFetchuser } from './helper'
import { renderFilteredConversations, renderMessageInput, renderNotificationSelector } from './helperComponents'

export default function Mensajes () {
  // Estado para navegar con react router
  const navigate = useNavigate()
  const [activeConversation, setActiveConversation] = useState(null)

  // --------------------------------------LOGICA DE MENSAJES-------------------------------------------
  const [user] = useFetchuser()
  const [mensajes, setMensajes] = useState([])
  const [conversaciones, setConversaciones] = useState([])
  const [urlSearchParams] = useSearchParams()
  const newConversationId = urlSearchParams.get('n')
  const [filteredConversations, setFilteredConversations] = useState([])
  const [activeUser, setActiveUser] = useState({})
  const [reducedUsers, setReducedUsers] = useState([])

  useFetchConversations(user, setConversaciones, setFilteredConversations, newConversationId)

  // -------------------------------------------------------------------------

  useEffect(() => {
    if (newConversationId && conversaciones && reducedUsers) {
      setActiveConversation(conversaciones.find(conversacion => findUserByConversation(conversacion, user, reducedUsers)._id === newConversationId))
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

  useEffect(() => {
    if (conversaciones && user && newConversationId &&
            activeConversation &&
            findUserByConversation(activeConversation, user, reducedUsers)._id === newConversationId) {
      setActiveConversation(conversaciones.find(conversacion => conversacion.users.find(u => u !== user._id) === newConversationId))
      setActiveUser(findUserByConversation(activeConversation, user, reducedUsers))
    }
  }, [newConversationId, conversaciones, user, activeConversation, reducedUsers])

  useEffect(() => {
    async function fetchPhotoAndNameUsers () {
      if (!user._id || !conversaciones.length) return

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
  }, [user._id, conversaciones])

  useEffect(() => {
    async function fetchMessages () {
      if (!activeConversation || Object.keys(activeConversation).length === 0 || !activeConversation._id) return
      try {
        const url = `http://localhost:3030/api/messages/messageByConversation/${activeConversation._id}`
        const response = await fetch(url)
        const messages = await response.json()

        if (messages.error) {
          toast.error(messages.error)
          return
        }
        setMensajes(messages)
      } catch (error) {
        console.error('Error fetching messages:', error)
        toast.error('Error fetching messages')
      }
    }
    fetchMessages()
  }, [activeConversation])


  // Scroll to the bottom after adding the message
  useEffect(() => {
    if (chatContainerRef.current && mensajes.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [mensajes])

  // -----------------------------------------------------------------FILTRO DEL CHAT----------------------------------------

  function filterConversations (e) {
    const searchTerm = e.target.value.toLowerCase() // Normalize the search term for case-insensitive comparison

    // Filter conversations where the name of the other user contains the search term
    const filtered = conversaciones.filter(conversation => {
      // Find the other user's ID
      const otherUserId = conversation.users.find(u => u !== user._id)
      if (!otherUserId) return null

      // Find the user object for the other user in reducedUsers
      const userMatch = reducedUsers.find(reducedUser => reducedUser._id === otherUserId)

      return userMatch.nombre.toLowerCase().includes(searchTerm)
    })

    // Update the state with the filtered conversations
    setFilteredConversations(filtered)
  }

  // -------------------------------------------------------------Lógica para preguntar sobre un libro en específico
  const [libroAPreguntar, setLibroAPreguntar] = useState({})
  const idLibro = urlSearchParams.get('q')
  useEffect(() => {
    async function fetchLibro (id) {
      if (!idLibro) return
      const url = `http://localhost:3030/api/books/${id}`
      try {
        const response = await axios.get(url, { withCredentials: true })
        const book = response.data

        setLibroAPreguntar(book || {}) // Asegurar que el libro existe o dejar vacío
      } catch (error) {
        setLibroAPreguntar({})
        console.error('Error fetching book data:', error)
      }
    }

    fetchLibro(idLibro)
  }, [idLibro])
  const convertToLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text.split(urlRegex).map((part, index) =>
      urlRegex.test(part) ? <a key={index} href={part} target='_blank' rel='noopener noreferrer'>{part}</a> : part
    )
  }
  const inputMessage = document.querySelector('#messageInput')
  useEffect(() => {
    // Si hay un nuevo usuario (para hacer activa su conversación), y renderizó el input, y si el libro a preguntar coincida con el vendedor
    if (
      newConversationId &&
            Object.keys(libroAPreguntar).length !== 0 &&
            inputMessage &&
            activeConversation &&
            libroAPreguntar.idVendedor === findUserByConversation(activeConversation, user, reducedUsers)._id
    ) {
      const vendedorNombre = findUserByConversation(activeConversation, user, reducedUsers).nombre
      const libroTitulo = libroAPreguntar.titulo
      const libroUrl = `http://localhost:5173/libros/${libroAPreguntar._id}`

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
  }, [newConversationId, libroAPreguntar, inputMessage, activeConversation])

  // -----------------------------------------------------------Teléfono---------------------------------------
  // slide when a conversation is active or not
  useEffect(() => {
    if (activeConversation && window.innerWidth <= 600) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
    } else if (!activeConversation && window.innerWidth <= 600) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
    }
  }, [activeConversation])

  return (
    <>
      <Header />
      {/* ----------------------------------------SELECCION DE NOTIFICACION----------------------------------------------- */}
      {renderNotificationSelector()}

      {/* ----------------------------------------MENSAJES EN PC----------------------------------------------- */}

      {window.innerWidth >= 600 &&
        <div className='messagesContainer'>
          <div className='conversationsContainer'>
            <input type='text' className='conversationsFilter' onChange={(event) => filterConversations(event)} placeholder='Buscar' />

            {/* ----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
            {renderFilteredConversations(filteredConversations, activeConversation, setActiveConversation, setActiveUser, user, reducedUsers)}
          </div>
          <div className='chat'>
            {/* ----------------------------------------ENCABEZADO DEL CHAT----------------------------------------------- */}
            {(user && reducedUsers && activeConversation) &&
              <Link style={{ width: '100%' }} to={`/usuarios/${activeUser._id}`}>
                <div className='headerMessage'>
                  <svg
                    onClick={() => setActiveConversation(null)}
                    style={{
                      display: window.innerWidth <= 600 ? 'block' : 'none',
                      transform: 'rotate(180deg)'
                    }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={25} height={25} color='#000000' fill='none'
                  ><path d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                  <img src={activeUser.fotoPerfil ? `http://localhost:3030/uploads/${activeUser.fotoPerfil}` : 'http://localhost:3030/uploads/default.jpg'} alt={activeUser.nombre} />
                  <h2>{activeUser.nombre}</h2>
                </div>
              </Link>}
            {/* ----------------------------------------MENSAJES----------------------------------------------- */}
            <div className='messagesViewContainer' ref={chatContainerRef}>
              {mensajes.map((mensaje, index) => (
                <div key={index} className={`mensaje ${mensaje.userId === user._id ? 'myMessage' : 'otherMessage'}`}>
                  {mensaje.message}
                </div>
              ))}
            </div>
            {/* ----------------------------------------CONTENEDOR DE ENVIAR MENSAJE----------------------------------------------- */}
            {renderMessageInput(activeConversation, handleSubmitMessage, user, newConversationId, conversaciones, setConversaciones, setMensajes, setFilteredConversations, reducedUsers, setActiveConversation, navigate)}
          </div>
        </div>}

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
