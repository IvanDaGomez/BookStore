/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { FaHome, FaList } from "react-icons/fa";
import './sideBar.css'
import { Link, useNavigate } from "react-router-dom";
import { renderProfilePhoto } from "../../assets/renderProfilePhoto";
import { cambiarEspacioAGuiones } from "../../assets/agregarMas";
export default function MenuSideBar({ callback, user, logoutFn }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false);
  const queryInput = useRef(null)
  const mainInfo = [
    {
      title: "Inicio",
      icon: <FaHome />,
      link: "/",
    },
    {
      title: "Para ti",
      icon: <FaList />,
      link: "/para-ti",
    },
    {
      title: "Libros",
      icon: <FaList />,
      link: "/libros",
    },
    {
      title: "Customers",
      icon: <FaList />,
      link: "/customers",
    }
  ]
  function handleDropwdown() {
    const dropdown = document.querySelector('.nav-dropdown')
    if (showDropdown) {
      dropdown.style.filter = 'opacity(0)'
      setTimeout(() => {
      dropdown.style.display = 'none'
    },100)
      setShowDropdown(false)
    }
    else {
      dropdown.style.filter = 'opacity(100%)'
      setTimeout(() => {
      dropdown.style.display = 'flex'
    },100)
      setShowDropdown(true)
    }
    
  }

  function submitInputValue () {
    if (!queryInput.current.value) return

    window.location.href =`/buscar?q=${cambiarEspacioAGuiones(queryInput.current.value)}`
    queryInput.current.value = ''
  }
  return (
    <div className='menuSideBar' onMouseLeave={callback} >{/* */}
      {/* Profile Section */}
      {user &&
        <div className="nav-profile" onClick={()=> navigate(`/usuarios/${user._id}`)}>
          <img src={renderProfilePhoto(user?.fotoPerfil || '')} alt="User" className="avatar" />
          <h2>{user.nombre}</h2>
        </div>
      }
      {/* Navigation */}
      <div className="nav">
        {mainInfo.map((item, index) => (
          <Link key={index} to={item.link}>
          <div className={`nav-item ${window.location.pathname === item.link ? 'nav-active' : ''}`} >
            <div className="nav-icon">{item.icon}</div>
            {item.title}
            </div>
          </Link>))}
      </div>
      {/* Buscar */}

      <div className='input'>
              <input
                type='text'
          name='query'
          ref={queryInput}
                autoComplete='off'
                className='search'
                placeholder='Buscar'
                onKeyDown={(event) => (event.key === 'Enter') ? submitInputValue() : <></>}
              />
              <button type='submit' className='icon' onClick={submitInputValue}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} fill='none'>
                  <path d='M17.5 17.5L22 22' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  <path d='M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
                </svg>

              </button>
            </div>
      {/* User Dropdown Menu */}
      {user ? <>
        <div className="user-section" onClick={() => handleDropwdown()}>
          <div>
            <img src={renderProfilePhoto(user?.fotoPerfil || '')} alt={user.nombre + "'s photo"} title={user.nombre + "'s photo"} className="avatar-small" />
          </div>
          <div>
            <Link to='/notificaciones' className='notification'>
            {/* Notification icon */}
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'><path d='M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
            </Link>
            <Link to={`/favoritos/${user._id}`} style={{ all: 'inherit' }}>
              <div className='heart'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#ffffff' fill='none'><path d='M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
                {(user && user.favoritos.length !== 0) &&
                  <div className='heartIconCount'>
                    {user.favoritos.length}
                  </div>}
              </div>
            </Link>
          </div>
      </div>

        <div className="nav-dropdown">
          <Link to='/cuenta'>Mi perfil</Link>
          <Link to='/libros/crear'>Publica tu libro</Link>
          <Link to={`/usuarios/${user._id}`}>Mis libros</Link>
          <Link to='/mensajes'>Mis mensajes</Link>
          <Link className="logout" onClick={logoutFn}>Cerrar sesión</Link>
        </div>
      </> : 
        <div className="user-section">
          <Link to='/login' className="login">Iniciar sesión</Link>
        </div>
      }
    </div>
  )
}
