import Header from '../../components/header/header.jsx'
import Footer from '../../components/footer/footer.jsx'
import { useParams } from 'react-router-dom'
import { renderNotification } from './renderNotification.jsx'
import SideInfo from '../../components/sideInfo.jsx'
import Sections from '../../components/sections/sections.jsx'
import { useState, useEffect } from 'react'
import { Carousel } from '../../components/slider/photoCarrousel.jsx'
import { ToastContainer } from 'react-toastify'
import CustomDesigns from '../../components/customDesigns.jsx'
import Loader from '../../components/loader/loader.jsx'
import BigPhoto from './bigPhoto.jsx'
import useGoogleOneTap from './oneTap.js'

function App () {
  const [notification, setNotification] = useState('')
  const { info } = useParams()
  useEffect(() => window.scrollTo(0, 0), [])
  useEffect(() => setNotification(info), [info])

  const slides = [{
      photo: '/customPlantilla1.png',
      alt: 'Imagen 1'
    }, {
      photo: '/customPlantilla2.png',
      alt: 'Imagen 2'
    }, {
      photo: '/customPlantilla3.png',
      alt: 'Imagen 3'
    }, {
      photo: '/customPlantilla4.png',
      alt: 'Imagen 3'
    }, {
      photo: '/customPlantilla6.png',
      alt: 'Imagen 6'
    }, {
      photo: '/customPlantilla7.png',
      alt: 'Imagen 7'
    }]
  // Plantilla como coleccione, novedades, etc.
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
  useEffect(() => {
    if (document.referrer.includes('/login')) {
      setTimeout(window.location.reload(), 1000)
    }
  },[])

  useGoogleOneTap()
  return (
    <>
      <Loader />
      {renderNotification(notification)}
      <Header />
      <BigPhoto />
      {/* <GoogleOneTapLogin /> */}
      <Carousel data={slides} />

      <Sections filter='Para ti' />

      <img src='/customPlantilla3.png' style={{ width: '100vw' }} alt='' />
      <Sections filter='Nuevo' />
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
