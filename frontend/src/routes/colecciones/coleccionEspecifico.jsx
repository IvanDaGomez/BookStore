import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer'
import Header from '../../components/header'
import SideInfo from '../../components/sideInfo'
import { useEffect, useState } from 'react'

export default function ColeccionEspecificoPage () {
  const [coleccion, setColeccion] = useState([])

  useEffect(() => {

  }, [])
  return (
    <>
      <Header />
      <div className='coleccionesContainer' />
      <Footer />
      <SideInfo />
      <ToastContainer position='top-center' autoClose={5000} hideProgressBar={false} pauseOnHover={false} closeOnClick theme='light' />
    </>
  )
}
