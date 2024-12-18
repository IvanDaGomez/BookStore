import Header from '../../components/header.jsx'
import Footer from '../../components/footer.jsx'
import { Link, useParams } from 'react-router-dom'
import SideInfo from '../../components/sideInfo.jsx'
import Sections from '../../components/sections.jsx'
import { useState, useEffect } from 'react'
import { Carousel } from '../../components/photoCarrousel.jsx'
import { ToastContainer } from 'react-toastify'
import CustomDesigns from '../../components/customDesigns.jsx'

function App () {
  const [notification, setNotification] = useState('')
  const { info } = useParams()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  useEffect(() => {
    switch (info) {
      case 'exitoCreandoLibro':
        setNotification('success')
        break
      case 'noUser':
        setNotification('No user')
        break
      case 'userNotFound':
        setNotification('User not found')
        break
      case 'libroNoEncontrado':
        setNotification('Libro no encontrado')
        break

      default:

        setNotification('')
        break
    }
  }, [info])

  const renderNotification = () => {
    if (notification === 'success') {
      return (
        <>
          <div className='dropdownBackground' />
          <div className='success-container'>
            <h2>¡Publicación enviada con éxito!</h2>
            <p>Tu publicación será revisada para su lanzamiento.</p>
            <Link to='/'>
              <button className='back-button'>Volver</button>
            </Link>
          </div>
        </>
      )
    }
    if (notification === 'No user') {
      return (
        <>
          <div className='dropdownBackground' />
          <div className='success-container'>
            <h2>No puedes hacer esto si no has iniciado sesión</h2>
            <p>Inicia sesión para poder publicar tu contenido o acceder a tu cuenta</p>
            <div>

              <Link to='/login'>
                <button className='back-button'>Iniciar Sesión</button>
              </Link>
              <Link to='/'>
                <button className='back-button'>Volver a Inicio</button>
              </Link>
            </div>
          </div>
        </>
      )
    }
    if (notification === 'User not found') {
      return (
        <>
          <div className='dropdownBackground' />
          <div className='success-container'>
            <h2>No se ha encontrado el usuario</h2>

            <div>

              <Link to='/'>
                <button className='back-button'>Volver a Inicio</button>
              </Link>
            </div>
          </div>
        </>
      )
    }
    if (notification === 'Libro no encontrado') {
      return (
        <>
          <div className='dropdownBackground' />
          <div className='success-container'>
            <h2>No se encontró el libro</h2>

            <div>

              <Link to='/'>
                <button className='back-button'>Volver</button>
              </Link>
            </div>
          </div>
        </>
      )
    }
    document.documentElement.style.overflowY = 'scroll'
    return null // En caso de no haber notificación
  }

  const slides = [
    {
      src: '/customPlantilla2.png',
      alt: 'Image 1 for carousel'
    },
    {
      src: '/customPlantilla5.png',
      alt: 'Image 2 for carousel'
    },
    {
      src: '/customPlantilla4.png',
      alt: 'Image 3 for carousel'
    },
    {
      src: '/customPlantilla1.png',
      alt: 'Image 2 for carousel',
      extraComponents: [{
        href: '/buscar?q=tendencia',
        component: <button>Explorar</button>,
        height: '30px',
        width: '60px',
        top: '30px',
        left: '30px'
      }, {
        href: '/buscar?q=tendencia',
        component: <img href='' alt='' />,
        width: '40px',
        height: '50px',
        top: '30px',
        left: '30px'
      }, {
        href: '/buscar?q=tendencia',
        component: <button>Venta</button>,
        height: '30px',
        width: '80px',
        top: '40px',
        right: '5%'
      }]
    }
  ]
  const plantillas = [
    {
      photo: '/customPlantilla1.png',
      alt: 'Imagen 1'
    }, {
      photo: '/customPlantilla1.png',
      alt: 'Imagen 1'
    }, {
      photo: '/customPlantilla1.png',
      alt: 'Imagen 1'
    }, {
      photo: '/customPlantilla1.png',
      alt: 'Imagen 1'
    }
  ]
  return (
    <>
      {renderNotification()}
      <Header />

      <Carousel data={slides} />
      {/* <div className="IntroDiv">
        <div>
          <h2>El mejor lugar para vender y comprar tus libros favoritos</h2>
          <p>Nutre tu conocimiento con los libros que quieras</p>
          <Link to="/search" style={{width:"auto"}}><button className='boton'>Comienza Ahora</button></Link>
        </div>
      </div> */}

      <Sections filter='Para ti' />
      <img src='/customPlantilla3.png' style={{ width: '100vw' }} alt='' />
      <Sections filter='Nuevo' backgroundColor='#00ff00' />
      <CustomDesigns plantillas={plantillas} />

      <SideInfo />
      {/* <ChatBot/> */}

      <Footer />
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

export default App
