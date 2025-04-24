/* eslint-disable react-hooks/exhaustive-deps */
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import { ToastContainer } from 'react-toastify'
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { formatDate } from '../../assets/formatDate'
import { reduceText } from '../../assets/reduceText'
import axios from 'axios'
import { DetailedNotification } from '../../assets/formatNotificationMessage'
import { UserContext } from '../../context/userContext'
import NotificationsHeader from './notificationsHeader.jsx'
import './messages.css'
import './notifications.css'
/*
{
    _id: data._id || '',
    theme: data.theme || '',
    title: data.title || '',
    priority: data.priority || '',
    type: data.type || '',
    userId: data.userId || '',
    input: data.input || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false,
    actionUrl: data.actionUrl || '',
    expiresAt: data.expiresAt || new Date().toISOString(),
    metadata: data.metadata || {
      photo: '',
      bookTitle: '',
      bookId: ''
    }
  }
*/
export default function Notificaciones () {

  const { user } = useContext(UserContext)

  const [notifications, setNotifications] = useState([])
  const [activeNotification, setActiveNotification] = useState(null)
  const [filteredNotifications, setFilteredNotifications] = useState([])
  useEffect(() => {
    async function fetchNotifications () {
      if (!user || !user?._id) return
      const url = 'http://localhost:3030/api/notifications/getNotificationsByUser/' + user._id
      const response = await axios.get(url)
      setNotifications(response.data)
      setFilteredNotifications(response.data)
    }
    fetchNotifications()
  }, [user])
  // ----------------------------------------LÓGICA DE NOTIFICACIONES------------------------------------//
  const { notificationId } = useParams()

  useEffect(() => {
    if (notificationId && notifications.length !== 0) {
      setActiveNotification(notifications.find(notification => notification._id === notificationId))
    }
  }, [notificationId, notifications])

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // slide when a notification is active or not
  useEffect(() => {
    if (activeNotification && isMobile) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
    } else if (!activeNotification && isMobile) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
    }
  }, [activeNotification])
  function filterNotifications (e) {
    const searchTerm = e.target.value.toLowerCase() // Normalize the search term for case-insensitive comparison

    // Filter conversations where the name of the other user contains the search term
    const filtered = notifications.filter((notification) =>
      notification.title.toLowerCase().includes(searchTerm)
    )

    // Update the state with the filtered conversations
    setFilteredNotifications(filtered)
  }

  const typeMessages = {
    newMessage: 'Tienes un nuevo mensaje!',
    newQuestion: 'Tienes una nueva pregunta!',
    bookPublished: 'Tu libro ha sido publicado!',
    bookSold: 'Tu libro ha sido vendido!',
    orderShipped: 'Tu pedido ha sido entregado!',
    reviewReceived: 'Tienes una nueva reseña!'
  }
  // Mark every notification as read

  useEffect(() => {
    if (!activeNotification || activeNotification.read) return
    async function fetchReadNotification () {
      try {
        const url = `http://localhost:3030/api/notifications/${activeNotification._id}/read`
        const read = await fetch(url, { method: 'PUT' })
        if (!read.ok) {
          console.error('Error marking notification as read')
        }
      } catch (error) {
        console.error(error)
      }
    }
    fetchReadNotification()
  }, [activeNotification?._id]) // Only trigger when the active notification changes
  return (
    <>
      <Header />
      {/* ----------------------------------------NOTIFICACIONES----------------------------------------------- */}
      <NotificationsHeader active={'notifications'}/>
      <div className='messagesContainer'>
        <div className='conversationsContainer'>
          {/* Notifications by user, make styles for the notification */}
          <input type='text' className='conversationsFilter' onChange={(event) => filterNotifications(event)} placeholder='Buscar' />

          {/* ----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
          {(filteredNotifications && filteredNotifications.length !== 0) && filteredNotifications
            .slice() // Ensure a new array is created to avoid mutating state
            .reverse()
            .map((notification) => (
              <div
                key={notification._id}
                className={`conversationSpecific 
                                ${activeNotification && activeNotification._id === notification._id ? 'active' : ''}
                                ${!notification.read && activeNotification._id !== notification._id ? 'notRead' : ''}`}
                onClick={() => setActiveNotification(notification)}
              >

                <div className='conversationSpecificTitleAndMessage'>
                  <h2>
                    {notification.type
                      ? (
                        <>
                          {reduceText(typeMessages[notification.type] || notification.title, 40)}
                        </>
                        )
                      : null}

                  </h2>
                </div>
                <span>{formatDate(notification?.createdIn) || ''}</span>

              </div>
            ))}
        </div>
        {console.log(activeNotification)}
        <div className='chat'>
          {/* Specific information for each notification */}
          <div className='headerMessage' style={{ display: isMobile ? 'flex' : 'none' }}>
            <svg
              onClick={() => setActiveNotification(null)}
              style={{ transform: 'rotate(180deg)' }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={25} height={25} color='#000000' fill='none'
            ><path d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </div>
          {(activeNotification && Object.keys(activeNotification).length !== 0) &&
            <div className='messagesViewContainer'>
              <div className='otherMessage' style={{ padding: '5px 10px ', border: 'none' }}>{DetailedNotification(activeNotification)}</div>
            </div>}

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
