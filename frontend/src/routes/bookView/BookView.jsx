import { useParams } from 'react-router'
import { useState, useEffect, useRef, useContext } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header'
import SideInfo from '../../components/sideInfo'
import Footer from '../../components/footer'
import ErrorPage from '../../components/errorPage/errorPage.jsx'
import { MakeCard, MakeSmallCard } from '../../assets/makeCard'
import { cambiarEspacioAGuiones } from '../../assets/agregarMas'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import 'react-toastify/dist/ReactToastify.css'
import { handleFavoritos } from '../../assets/handleFavoritos'
import { createNotification } from '../../assets/createNotification'
import { UserContext } from '../../context/userContext.jsx'
export default function BookView () {
  const { bookId } = useParams()
  const [libro, setLibro] = useState([]) // Inicialmente null
  const [loading, setLoading] = useState(true) // Estado de carga
  const [error, setError] = useState(false)
  const [actualImage, setActualImage] = useState('')
  const [isZoomed, setIsZoomed] = useState(false)
  const [librosRelacionadosVendedor, setLibrosRelacionadosVendedor] = useState([])
  const [librosRelacionados, setLibrosRelacionados] = useState([])
  const actualImageRef = useRef(null)
  const { user } = useContext(UserContext)
  const [sagaLibros, setSagaLibros] = useState([])
  const [nombreSaga, setNombreSaga] = useState('')
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [bookId])

  useEffect(() => {
    async function fetchLibro (id) {
      const url = `http://localhost:3030/api/books/${id}`
      try {
        const response = await axios.get(url, { withCredentials: true })
        const book = response.data
        setLibro(book || {}) // Asegurar que el libro existe o dejar vacío
        const imageUrl = book.images[0]
          ? `http://localhost:3030/uploads/${book.images[0]}` // Ruta completa hacia las imagenes
          : ''
        setActualImage(imageUrl)
      } catch (error) {
        setLibro({})
        setError(true)
        console.error('Error fetching book data:', error)
      } finally {
        setLoading(false) // Marcar que la carga ha finalizado
      }
    }

    fetchLibro(bookId)
  }, [bookId])

  useEffect(() => {
    async function fetchLibroRelacionadoVendedor () {
      const libros = []
      if (libro) {
        const url = 'http://localhost:3030/api/users/' + libro.idVendedor
        const response = await axios.get(url)
        const librosIds = response.data.librosIds

        // Conseguir los libros del usuario
        const urlLibros = 'http://localhost:3030/api/books/'
        for (let i = 0; i < librosIds.length; i++) {
          const response = await axios.get(urlLibros + librosIds[i])
          libros.push(response.data)
        }

        setLibrosRelacionadosVendedor(libros)
      }
    }
    fetchLibroRelacionadoVendedor()
  }, [libro])
  useEffect(() => {
    async function fetchLibroRelacionado () {
      if (libro) {
        // Conseguir los libros del usuario
        const urlLibros = `http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(libro.titulo)}&l=12`

        const response = await axios.get(urlLibros)

        setLibrosRelacionados(response.data)
      }
    }
    fetchLibroRelacionado()
  }, [libro])
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#comments') {
        const comments = document.querySelector('#comments')

        if (comments) {
          setTimeout(window.scrollTo(0, comments.style.top), 300)
        }
      }
    }

    // Verificar si ya estamos en el hash al montar el componente
    handleHashChange()

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange)

    // Limpieza del listener al desmontar el componente
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(()=>{
    async function fetchSagaLibros() {
      if (!libro) return
      try {
        const url = 'http://localhost:3030/api/collections/collectionSaga'
        const body = {
          bookId: libro._id,
          userId: libro.idVendedor
        }
        const response = await axios.post(url, body, {withCredentials: true})
        
        if (response.data) {
          setNombreSaga(response.data.data.nombre)
          const fetchedBooks = await Promise.all(
            response.data.data.librosIds.map(async (idLibro) => {
              const response = await fetch(`http://localhost:3030/api/books/${idLibro}`, {
                method: 'GET',
                credentials: 'include'
              })
              if (response.ok) {
                return response.json()
              } else {
                console.error('Libro no encontrado')
                return null
              }
            })
          )
          const validBooks = fetchedBooks.filter(book => book !== null)
          setSagaLibros(validBooks)
        }
      } catch  {
        console.error('Error en el servidor')
      }
    }
    fetchSagaLibros()
  }, [libro])

  if (loading) {
    return <><Header/><Footer/></>
  }
  if (error) {
    return <ErrorPage />
  }
  const zoomConst = 3 // Aumento del zoom

  const handleZoom = () => {
    const imagenDentro = actualImageRef.current.querySelector('img')
    if (isZoomed) {
      setIsZoomed(false)
      imagenDentro.style.transform = 'none'
    } else {
      setIsZoomed(true)
      imagenDentro.style.transform = `scale(${zoomConst})`
    }
  }

  const moverMouse = (e, amountOfZoom = zoomConst) => {
    if (!isZoomed) return

    const rect = actualImageRef.current.getBoundingClientRect()
    const imagenDentro = actualImageRef.current.querySelector('img')

    // Obtener el tamaño original y zoomf
    const originalWidth = imagenDentro.offsetWidth
    const originalHeight = imagenDentro.offsetHeight
    const imgWidth = originalWidth * amountOfZoom
    const imgHeight = originalHeight * amountOfZoom

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Porcentajes relativos al contenedor
    const porcentajeX = x / rect.width
    const porcentajeY = y / rect.height

    // Movimiento máximo permitido
    const maxMoveX = Math.max(0, imgWidth - rect.width)
    const maxMoveY = Math.max(0, imgHeight - rect.height)

    // Calcular desplazamiento manteniendo la imagen dentro del contenedor
    const moverX = Math.min(Math.max(porcentajeX * maxMoveX, 0), maxMoveX)
    const moverY = Math.min(Math.max(porcentajeY * maxMoveY, 0), maxMoveY)

    imagenDentro.style.transformOrigin = `${porcentajeX * 100}% ${porcentajeY * 100}%`
    imagenDentro.style.transform = `scale(${amountOfZoom}) translate(-${moverX / Math.pow(amountOfZoom, 9)}px, -${moverY / Math.pow(amountOfZoom, 9)}px)`
  }

  function diff_weeks (dt2, dt1) {
    // Calculate the difference in milliseconds between dt2 and dt1
    let diff = (dt2.getTime() - dt1.getTime()) / 1000
    // Convert the difference from milliseconds to weeks by dividing it by the number of milliseconds in a week
    diff /= (60 * 60 * 24 * 7)
    // Return the absolute value of the rounded difference as the result
    return Math.abs(Math.round(diff))
  }

  function handleSetPregunta (str) {
    const inputPregunta = document.querySelector('.inputPregunta')

    if (str === 'costo') {
      inputPregunta.value = '¿Cuál es el costo del producto?'
    } else if (str === 'devolucion') {
      inputPregunta.value = '¿Cómo puedo hacer una devolución?'
    } else if (str === 'metodoPago') {
      inputPregunta.value = '¿Qué métodos de pago aceptan?'
    } else if (str === 'estadoProducto') {
      inputPregunta.value = '¿En qué estado se encuentra el producto?'
    }
  }

  async function handleSubmitPregunta () {
    const inputPregunta = document.querySelector('.inputPregunta')

    if (!inputPregunta.value) {
      return
    }
    if (!user) {
      toast.error('Necesitas iniciar sesión para hacer preguntas')
      return
    }
    if (libro) {
      const url = `http://localhost:3030/api/books/${libro._id}`

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mensaje: inputPregunta.value,
            tipo: 'pregunta',
            senderId: user._id
          }),
          credentials: 'include'

        })

        if (!response.ok) {
          // Actualizar el estado de errores usando setErrors
          return // Salir de la función si hay un error
        }
        const data = await response.json()
        if (data.error) {
          toast.error('Error')
          return
        }

        const notificationToSend = {
          title: 'Tienes una nueva pregunta',
          priority: 'normal',
          type: 'newQuestion',
          userId: libro.idVendedor,
          input: inputPregunta.value,
          actionUrl: window.location.href,
          metadata: {
            photo: libro.images[0],
            bookTitle: libro.titulo,
            bookId: libro._id
          }
        }
        createNotification(notificationToSend)
        toast.success('Pregunta enviada exitosamente')
        inputPregunta.value = ''
      } catch (error) {
        console.error('Error al enviar la solicitud:', error)
        // También puedes agregar el error de catch a los errore
      }
    }
  }

  return (
    <>

      <Header />
      <div className='anuncio' />
      <div className='libroContenedor'>
        <div className='imagesContainer'>
          <div className='imagesVariable'>
            {libro.images &&
                        libro.images.map((image, index) => (
                          <div
                            className='imageElement'
                            key={index}
                            onClick={() => {
                              // Construir la URL completa para cada imagen
                              const imageUrl = image ? `http://localhost:3030/uploads/${image}` : ''
                              setActualImage(imageUrl) // Establecer la URL de la imagen actual
                            }}
                          >
                            <img
                              loading='lazy'
                              src={`http://localhost:3030/uploads/${image}`} // Usar la URL completa para mostrar la imagen
                              alt={libro.title}
                              title={libro.title}
                            />
                          </div>
                        ))}
          </div>

          <div
            className='actualImage'
            ref={actualImageRef}
            style={{ cursor: !isZoomed ? 'zoom-in' : 'zoom-out' }}
          >
            {libro.images && libro.images.length > 0 && (
              <img
                src={actualImage}
                alt={libro.titulo}
                title={libro.titulo}
                onMouseMove={moverMouse}
                onClick={handleZoom}
              />
            )}
          </div>
        </div>

        <div className='infoContainer'>
          {(diff_weeks(new Date(libro.fechaPublicacion), new Date()) <= 2) ? <div className='informacion'>Nuevo</div> : <></>}
          <h1>{libro.titulo}</h1>
          {libro.oferta
            ? (
              <>
                <h3>
                  <s>${libro.precio.toLocaleString('es-CO')}</s>
                </h3>
                <h2>${libro.oferta.toLocaleString('es-CO')}</h2>
              </>
              )
            : (
              <h2>${libro.precio.toLocaleString('es-CO')}</h2>

              )}
          {[

            libro.autor && `Autor: ${libro.autor}`,
            libro.genero && `Género: ${libro.genero}`,
            libro.isbn && `ISBN: ${libro.isbn}`,
            libro.estado && `Estado: ${libro.estado}`,
            libro.edicion && `Edición: ${libro.edicion}`,
            libro.tapa && `Tapa: ${libro.tapa}`,
            libro.idioma && `Idioma: ${libro.idioma}`,
            libro.ubicacion && `Ubicación: ${libro?.ubicacion?.ciudad || 'No encontrada'}`,
            libro.fechaPublicacion && `Publicado: ${new Date(libro.fechaPublicacion)
                        .toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}`,
            libro.edad && `Edad recomendada: ${libro.edad}`
          ]
            .filter(Boolean)
            .map((item, index) => (
              <p key={index}>{item}</p>
            ))}

        </div>

        <div className='comprarContainer'>
          {(libro.disponibilidad == 'Disponible')
            ? <>
              <h3 style={{ color: '#228B22' }}>Disponible</h3>

              {((libro && user && user.librosIds) && !user?.librosIds.includes(libro._id))
                ? <><Link to={`/checkout/${libro._id}`}><button>Comprar ahora</button></Link>
                  <button onClick={(event) => handleFavoritos(event, libro._id, user._id)} className='botonInverso'>Agregar a favoritos</button>
                </>
                : <></>}
            </>
            : <>{libro.disponibilidad}</>}

          <h3>Vendido por:</h3>
          <Link to={`/usuarios/${libro.idVendedor}`}><span>{libro.vendedor}</span></Link>
          <hr />
          <div className='separarConFoto'>

            <div>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#228B22' fill='none'>
                <path d='M12 9C10.8954 9 10 9.67157 10 10.5C10 11.3284 10.8954 12 12 12C13.1046 12 14 12.6716 14 13.5C14 14.3284 13.1046 15 12 15M12 9C12.8708 9 13.6116 9.4174 13.8862 10M12 9V8M12 15C11.1292 15 10.3884 14.5826 10.1138 14M12 15V16' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                <path d='M21 11.1833V8.28029C21 6.64029 21 5.82028 20.5959 5.28529C20.1918 4.75029 19.2781 4.49056 17.4507 3.9711C16.2022 3.6162 15.1016 3.18863 14.2223 2.79829C13.0234 2.2661 12.424 2 12 2C11.576 2 10.9766 2.2661 9.77771 2.79829C8.89839 3.18863 7.79784 3.61619 6.54933 3.9711C4.72193 4.49056 3.80822 4.75029 3.40411 5.28529C3 5.82028 3 6.64029 3 8.28029V11.1833C3 16.8085 8.06277 20.1835 10.594 21.5194C11.2011 21.8398 11.5046 22 12 22C12.4954 22 12.7989 21.8398 13.406 21.5194C15.9372 20.1835 21 16.8085 21 11.1833Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
              </svg>
              <span style={{ color: '#228B22', fontSize: '2rem', textAlign: 'center' }}>Compra protegida</span>
            </div>
            <div>
              <img src='/Mercado Pago.svg' alt='' />
              <span style={{ fontSize: '2rem' }}>Compra con MercadoPago.</span>
            </div>
            <div>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#228B22' fill='none'>
                <path d='M19.5 17.5C19.5 18.8807 18.3807 20 17 20C15.6193 20 14.5 18.8807 14.5 17.5C14.5 16.1193 15.6193 15 17 15C18.3807 15 19.5 16.1193 19.5 17.5Z' stroke='currentColor' strokeWidth='1.5' />
                <path d='M9.5 17.5C9.5 18.8807 8.38071 20 7 20C5.61929 20 4.5 18.8807 4.5 17.5C4.5 16.1193 5.61929 15 7 15C8.38071 15 9.5 16.1193 9.5 17.5Z' stroke='currentColor' strokeWidth='1.5' />
                <path d='M14.5 17.5H9.5M15 15.5V7C15 5.58579 15 4.87868 14.5607 4.43934C14.1213 4 13.4142 4 12 4H5C3.58579 4 2.87868 4 2.43934 4.43934C2 4.87868 2 5.58579 2 7V15C2 15.9346 2 16.4019 2.20096 16.75C2.33261 16.978 2.52197 17.1674 2.75 17.299C3.09808 17.5 3.56538 17.5 4.5 17.5M15.5 6.5H17.3014C18.1311 6.5 18.5459 6.5 18.8898 6.6947C19.2336 6.8894 19.4471 7.2451 19.8739 7.95651L21.5725 10.7875C21.7849 11.1415 21.8911 11.3186 21.9456 11.5151C22 11.7116 22 11.918 22 12.331V15C22 15.9346 22 16.4019 21.799 16.75C21.6674 16.978 21.478 17.1674 21.25 17.299C20.9019 17.5 20.4346 17.5 19.5 17.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              </svg><span style={{ fontSize: '2rem' }}>Envío a nivel nacional</span>
            </div>
          </div>
          <hr />
          <div className='informacionDelVendedor'>

            {librosRelacionadosVendedor &&
                    librosRelacionadosVendedor.filter(element => element._id !== libro._id).length !== 0 &&
                    libro && (
                      <>
                        <h2>Productos de {libro.vendedor}: </h2>
                        <div className='smallCardContainer'>
                          {librosRelacionadosVendedor
                            .filter(element => element._id !== libro._id)
                            .map((element, index) =>
                              user
                                ? <MakeSmallCard key={index} element={element} index={index} user={user} />
                                : <MakeSmallCard key={index} element={element} index={index} />)}
                        </div>
                      </>
            )}
          </div>
        </div>

      </div>
      <div className='extraBookViewContainer'>

        <div className='comments' id='comments'>
          <div className='separar'>
            <h2>Pregúntale al vendedor</h2>
            <h2>Preguntas realizadas</h2>
          </div>
          <div className='separar'>
            <div>
              <div className='question-buttons'>
                <button className='botonInverso' onClick={() => handleSetPregunta('costo')}>Costo y tiempo de envío</button>
                <button className='botonInverso' onClick={() => handleSetPregunta('devolucion')}>Devoluciones gratis</button>
                <button className='botonInverso' onClick={() => handleSetPregunta('metodoPago')}>Medios de pago</button>
                <button className='botonInverso' onClick={() => handleSetPregunta('estadoProducto')}>Estado del producto</button>
              </div>

              <div className='ask-section'>
                <textarea type='text' className='inputPregunta' placeholder='Escribe tu pregunta...' rows='2' />
                <button onClick={handleSubmitPregunta} className='ask-button'>Preguntar</button>
              </div>
            </div>
            <div className='comentarios'>
              {/* Mensaje
                        [mensaje, respuesta]
                    */}

              {libro && libro.mensajes && libro.mensajes.filter(mensaje => mensaje[0] && mensaje[1]).length !== 0
                ? libro.mensajes.filter(mensaje => mensaje[0] && mensaje[1]).map((element, index) => (
                  <div className='mensajeContainer' key={index}>
                    <p className='mensaje'>{element[0]}</p>
                    <p className='respuesta'>{element[1]}</p>
                  </div>
                ))
                : <div className='mensajeContainer'>
                  <p>No hay preguntas sobre este libro</p>
                </div>}
            </div>
          </div>
        </div>
        {sagaLibros && sagaLibros.length !== 0 && <div className='related'>
              <h2>Este libro es parte de la colección &quot;{nombreSaga}&quot;</h2>
              <div className='leftScrollContainer'>
                {sagaLibros.filter(element => element._id !== libro._id)
                  .map((element, index) => <MakeCard key={index} element={element} index={index} user={user || ''} />)}
              </div>
            </div> }
        <div className='description'>

          <h2>Descripción</h2>
          <p>{libro.descripcion}</p>
        </div>

        {(librosRelacionados.filter(element => element._id !== libro._id).length !== 0 && libro)
          ? (
            <div className='related'>
              <h2>Productos Relacionados</h2>
              <div className='leftScrollContainer'>
                {librosRelacionados.filter(element => element._id !== libro._id)
                  .map((element, index) => <MakeCard key={index} element={element} index={index} user={user || ''} />)}
              </div>
            </div>
            )
          : <></>}
      </div>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
      <SideInfo />
      <Footer />
    </>
  )
}
