import { useState, useEffect, useContext } from 'react'
import Fase1 from './fase1'
import Fase2 from './fase2'
import Fase3 from './fase3'
import axios from 'axios'
import UseStep from '../../components/UseStep'
import Header from '../../components/header/header.jsx'
import Footer from '../../components/footer/footer.jsx'
import SideInfo from '../../components/sideInfo'
import './checkout.css'
import { useNavigate, useParams } from 'react-router'

import { UserContext } from '../../context/userContext.jsx'
import { ToastContainer } from 'react-toastify'
import useFetchActualBook from '../../assets/useFetchActualBook.js'
function Checkout () {
  const navigate = useNavigate()
  const { user, setUser, loading } = useContext(UserContext)
  useEffect(() => {
    if (loading) {
      return <>
      <Header />
      </>
    }
  })
  const [preferenceId, setPreferenceId] = useState(null)
  // Fetch del usuario primero que todo


  useEffect(() => {
    async function fetchUserBalance () {
      if (!user) return
      try {
        const url = `http://localhost:3030/api/users/balance/${user._id}`
        const response = await axios.post(url, null, {withCredentials: true})
        setUser({
          ...user,
          balance: response.data.balance || 0
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/popUp/noUser')
      }
    };
    fetchUserBalance()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { bookId } = useParams()
  // Fetch book


  const { libro } = useFetchActualBook(bookId)


  const [fase, setFase] = useState(1) // Estado para la fase actual
  const [form, setForm] = useState({
    // Estado para almacenar los datos del formulario
    _id: bookId,
    address: {},
    payment: {},
    confirmation: {}
  })

  useEffect(() => {
    // Fetch preferenceId only when `libro` changes
    const fetchPreferenceId = async () => {
      if (libro) {
        try {
          const url = 'http://localhost:3030/api/users/getPreferenceId'

          // Prepare the payload
          const body = {
            ...libro,
            title: libro.titulo,
            price: libro.oferta !== null ? libro.oferta : libro.precio
          }

          // Make the API call
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include' // Include credentials if necessary
          })

          // Parse the response JSON
          if (response.ok) {
            const data = await response.json()
            setPreferenceId(data.id) // Assuming response includes `preferenceId`
          } else {
            console.error('Error fetching preference ID:', response.statusText)
          }
        } catch (error) {
          console.error('Error fetching preference ID:', error)
        }
      }
    }

    fetchPreferenceId()
  }, [libro]) // Dependency array ensures this runs when `libro` changes

  const renderFase = () => {
    switch (fase) {
      case 1:
        return <Fase1 form={form} setForm={setForm} setFase={setFase} libro={libro} />
      case 2:
        return <Fase2 form={form} setForm={setForm} setFase={setFase} user={user} />
      case 3:
        return <Fase3 form={form} setForm={setForm} setFase={setFase} user={user} libro={libro} preferenceId={preferenceId} />
      // case 4:
      //   return <Fase4 />
      default:
        return <Fase1 form={form} setForm={setForm} setFase={setFase} />
    }
  }

  const steps = ['Información del producto', 'Datos de envío', 'Medios de pago']
  return (
    <>
      <Header />
      <div className='checkoutContainer'>
        <h1>{steps[fase - 1]}</h1>
        <UseStep currentStep={fase} titulos={steps} />

        {libro && renderFase()}
      </div>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
      <Footer />
      <SideInfo />
    </>
  )
}

export default Checkout
