import { useState, useRef, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { cambiarEspacioAGuiones } from '../../assets/agregarMas.js'
import MenuSideBar from '../sidebar/menuSideBar.jsx'
import { UserContext } from '../../context/userContext.jsx'

import useFetchNotifications from './useFetchNotifications.js'
import { mobileBreakpoint } from '../../assets/config.js'
import SearchButton from './searchButton.jsx'
import logout from '../../assets/logout.js'
import HamburgerMenuOptions from './hamburgerMenuOptions.jsx'
import NotificationsRendering from './notificationsRendering.jsx'
import RenderResults from './renderResults.jsx'
import useToggleState from './useToggleState.js'
import RenderIcons from './renderIcons.jsx'
import useUpdateBreakpoint from '../../assets/useUpdateBreakPoint.js'
import './header.css'
// import useFetchUser from "../assets/useFetchUser";
export default function Header () {
  // const user = useFetchUser('http://localhost:3030/api/users/userSession')

  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  // Fetch notificacione
  const [notifications] = useFetchNotifications(user)
  const [notificationOpen, setNotificationOpen] = useState(false)
  // This state manages an array of information

  // Managing input ref for search and handling search input
  const queryInput = useRef(null)
  const [results, setResults] = useState([])


  // Submits the input value when the search button is clicked
  function submitInputValue () {
    if (!queryInput.current.value) return

    navigate(`/buscar?q=${cambiarEspacioAGuiones(queryInput.current.value)}`)
    queryInput.current.value = ''
  }

  // Funcionalidad del perfil
  const [profile, setProfile] = useState(false)

  const profileContainer = useRef(null)

  const openProfile = () => {
    setProfile(prevProfile => {
      const newProfileState = !prevProfile
      return newProfileState
    })
  }

  const [, handleMenuClick] = useToggleState(false)
  const isMobile = useUpdateBreakpoint(mobileBreakpoint)

  return (
    <>
      <header>
        <div className='headerIzq'>
          <Link to='/'>
            <div>
              <img loading='lazy' src='/logo.png' alt='' />
              <h1 style={{ fontFamily: 'Gentium Book Plus' }}>Meridian</h1>
            </div>
          </Link>

        </div>
        <div className='indice headerCen desaparecer'>
            <Link to='/'><p>Inicio</p></Link>
            <Link to='/para-ti'><p>Explorar</p></Link>
            <Link to='/para-ti/colecciones'><p>Colecciones</p></Link>
            {/* <Link to='/autores'><p>Autores</p></Link> */}
          </div>
        <div className='headerDer'>
            <SearchButton submitInputValue={submitInputValue} queryInput={queryInput} setResults={setResults} />
            <RenderIcons
              user={user}
              isMobile={isMobile}
              setNotificationOpen={setNotificationOpen}
              notificationOpen={notificationOpen}
              notifications={notifications}
              openProfile={openProfile}
              handleMenuClick={handleMenuClick}
            />
        </div>

      </header>
      <HamburgerMenuOptions 
      profile={profile}
      setProfile={setProfile}
      user={user}
      color={'#42376E'}
      profileContainer={profileContainer}
      />
      <NotificationsRendering
        notifications={notifications}
        user={user}
        notificationOpen={notificationOpen}
        setNotificationOpen={setNotificationOpen} 
      />
      <RenderResults results={results} />
      <MenuSideBar callback={handleMenuClick} user={ user } logoutFn = { logout } />
      
    </>
  )
}
