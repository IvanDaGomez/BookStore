import Header from '../../components/header/header.jsx'
import Footer from '../../components/footer.jsx'
import { useParams } from 'react-router-dom'
import { renderNotification } from './renderNotification.jsx'
import SideInfo from '../../components/sideInfo.jsx'
import Sections from '../../components/sections/sections.jsx'
import { useState, useEffect } from 'react'
import { Carousel } from '../../components/slider/photoCarrousel.jsx'
import { ToastContainer } from 'react-toastify'
import CustomDesigns from '../../components/customDesigns.jsx'
import Loader from '../../components/loader/loader.jsx'
import GoogleOneTapLogin from '../../components/googleOneTap.jsx'
import useLoadingScreen from './useLoadingScreen.js'

function App () {
  const [notification, setNotification] = useState('')
  const { info } = useParams()
  useEffect(() => window.scrollTo(0, 0), [])
  useEffect(() => setNotification(info), [info])
  const loading = useLoadingScreen()

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
  return (
    <>
      {loading && <Loader />}
      {renderNotification(notification)}
      <Header />
      {/* <GoogleOneTapLogin /> */}
      <Carousel data={slides} />

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
