/* eslint-disable react-hooks/exhaustive-deps */
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import { ToastContainer } from 'react-toastify'
import { useParams } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import { DetailedNotification } from '../../assets/formatNotificationMessage'
import { UserContext } from '../../context/userContext'
import NotificationsHeader from './notificationsHeader.jsx'
import './messages.css'
import './notifications.css'
import useFetchNotifications from '../../components/header/useFetchNotifications.js'
import { filterNotifications } from './notificationsFunctions/filterNotifications.js'
import useMarkNotificationAsRead from './notificationsFunctions/useMarkNotificationAsRead.js'
import useUpdateBreakpoint from '../../assets/useUpdateBreakPoint.js'
import NotificationsResults from './notificationsFunctions/notificationsResults.jsx'
import { useReturnIfNoUser } from '../../assets/useReturnIfNoUser.js'

export default function Notificaciones () {

  const { user, loading } = useContext(UserContext)
  useReturnIfNoUser(user, loading, false)
  const [notifications] = useFetchNotifications(user)
  const [activeNotification, setActiveNotification] = useState({})
  const [filteredNotifications, setFilteredNotifications] = useState(notifications ?? [])
  
  // ----------------------------------------LÓGICA DE NOTIFICACIONES------------------------------------//
  const { notificationId } = useParams()

  useEffect(() => {
    if (notificationId) {
      const notificationFound = notifications.find(notification => notification.id === notificationId)
      if (notificationFound) setActiveNotification(notificationFound)
    }
  }, [notificationId, notifications])

  const isMobile = useUpdateBreakpoint(734)

  // slide when a notification is active or not
  useEffect(() => {
    if (activeNotification && isMobile) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(-100vw)'
    } else if (!activeNotification && isMobile) {
      document.querySelector('.messagesContainer').style.transform = 'translateX(0)'
    }
  }, [activeNotification])

  // Mark every notification as read
  useMarkNotificationAsRead(activeNotification)
  return (
    <>
      <Header />
      {/* ----------------------------------------NOTIFICACIONES----------------------------------------------- */}
      <NotificationsHeader active={'notifications'}/>
      <div className='messagesContainer'>
        <div className='conversationsContainer'>
          {/* Notifications by user, make styles for the notification */}
          <input type='text' className='conversationsFilter' onChange={(e) => filterNotifications({e, notifications, setFilteredNotifications})} placeholder='Buscar' />

          {/* ----------------------------------------CADA CONVERSACIÓN----------------------------------------------- */}
          <NotificationsResults
          filteredNotifications={filteredNotifications}
          setActiveNotification={setActiveNotification}
          activeNotification={activeNotification}
          />
        </div>
        <div className='chat'>
          {/* Specific information for each notification */}
          <div className='headerMessage' style={{ display: isMobile ? 'flex' : 'none' }}>
            <svg
              onClick={() => setActiveNotification(null)}
              style={{ transform: 'rotate(180deg)' }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={25} height={25} color='#000000' fill='none'><path d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
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
