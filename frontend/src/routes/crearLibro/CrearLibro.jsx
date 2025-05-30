/* eslint-disable react-hooks/exhaustive-deps */
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import Fase1 from './Fase1'
import Fase2 from './Fase2'
import Fase3 from './Fase3'
import { useState, useEffect, useContext } from 'react'
import { average } from '../../assets/average'
import { useNavigate, useSearchParams } from 'react-router-dom'
import UseStep from '../../components/UseStep'
import { ToastContainer } from 'react-toastify'
import axios from 'axios'
import './crearLibro.css'
import { UserContext } from '../../context/userContext.jsx'
import useSendForm from './useSendForm.js'
import { cambiarEspacioAGuiones } from '../../assets/agregarMas.js'
import { useReturnIfNoUser } from '../../assets/useReturnIfNoUser.js'
import { BACKEND_URL } from '../../assets/config.js'

export default function CrearLibro () {
  const navigate = useNavigate()
  const { user, loading } = useContext(UserContext)
  useReturnIfNoUser(user, loading)
  const [form, setForm] = useState({})
  const [fase, setFase] = useState(1)

  // Recuperar datos de localStorage en el primer render
  useEffect(() => {
    const storedForm = localStorage.getItem('form')
    if (storedForm) {
      try {
        setForm(JSON.parse(storedForm))
      } catch (error) {
        console.error('Error parsing form from localStorage', error)
      }
    }
  }, [])

  // Guardar los cambios de fase y formulario en localStorage
  useEffect(() => {
    if (Object.keys(form).length !== 0) {
      localStorage.setItem('form', JSON.stringify(form))
    }
    if (fase !== null && !isNaN(fase)) {
      localStorage.setItem('fase', fase.toString())
    }
  }, [fase, form])

  const [searchParams] = useSearchParams() // Get the search parameters

  // Extract values for 'vendedor' and 'libro'
  const vendedor = searchParams.get('vendedor') // Retrieves the value of 'vendedor'
  const libro = searchParams.get('libro') // Retrieves the value of 'libro'
  const actualizar = vendedor && libro && user && vendedor === user.id && user.librosIds.includes(libro)
  // Fetch book data if libroId is present
  useEffect(() => {
    const fetchBook = async () => {
      if (actualizar) {
        try {
          const url = `${BACKEND_URL}/api/books/${libro}`
          const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
          })

          if (!response.ok) {
            navigate('/libros/crear')
            return // Exit the function if the response isn't OK
          }

          const data = await response.json()

          // Fetch image blobs in parallel
          const imageBlobs = await Promise.all(
            data.images.map(async (image) => {
              const imageResponse = await fetch(`${BACKEND_URL}/uploads/${image}`)
              if (!imageResponse.ok) {
                throw new Error(`Failed to fetch image at ${image}`)
              }
              const blob = await imageResponse.blob()
              return { url: URL.createObjectURL(blob), type: 'image/png' } // Create a URL for the blob
            })
          )

          // Update the form state with the data and image blobs
          setForm({
            titulo: data.titulo,
            autor: data.autor,
            precio: data.precio,
            oferta: data.oferta,
            keywords: data.keywords,
            descripcion: data.descripcion,
            estado: data.estado,
            genero: data.genero,
            edicion: data.edicion,
            idioma: data.idioma,
            tapa: data.tapa,
            edad: data.edad,
            images: imageBlobs,
            formato: data.formato,
            isbn: data.isbn
          })
        } catch (error) {
          console.error('Error fetching book data:', error)
        }
      } else {
        setForm({})
      }
    }

    fetchBook()
  }, [libro, actualizar])

  const steps = ['Imágenes y Titulo', 'Categorías', 'Precio']

  useSendForm({
    fase,
    form,
    setForm,
    user,
    setFase,
    actualizar,
    libro,
    navigate
  })

  const [meanPrice, setMeanPrice] = useState(null)
  // Fetch by title and look the price on the internet
  useEffect(() => {
    async function fetchPrice () {
      if (form.titulo) {
        try {
          const url = `${BACKEND_URL}/api/books/search/${cambiarEspacioAGuiones(form.titulo)}`
          const response = await axios.get(url)

          const prices = await Promise.all(response.data.map(info => Number(info.price)))
          setMeanPrice(average(prices))
        } catch {
          console.error('Error')
        }
      }
    }

    fetchPrice()
  }, [form.titulo])
  function renderFase () {
    if (fase === 1) {
      return <Fase1 form={form} setForm={setForm} fase={fase} setFase={setFase} />
    }
    else if (fase === 2) {
      return <Fase2 form={form} setForm={setForm} fase={fase} setFase={setFase} />
    }
    else if (fase === 3) {
      return <Fase3 form={form} setForm={setForm} fase={fase} setFase={setFase} meanPrice={meanPrice} user={user} />
    }
  }

  return (
    <>
      <Header />

      <div className='crearLibroDiv'>
        <div className='warning'>
          Solo aceptamos libros en buen estado. <span>Publicar réplicas o falsificaciones </span>
          es motivo de expulsión inmediata de Meridian.
        </div>
        <div className='info'>
          No todos los campos son requeridos, pero ten en cuenta que entre más completa esté tu publicación más rápido podrá venderse.
        </div>
        <h1>{actualizar ? <>Actualiza</> : <>Publica</>} tu libro</h1>
        <UseStep currentStep={fase} titulos={steps} />
        {renderFase()}
      </div>
      <Footer />
      <SideInfo />
      <ToastContainer position='top-center' autoClose={5000} hideProgressBar={false} pauseOnHover={false} closeOnClick theme='light' />
    </>
  )
}
