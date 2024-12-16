import { useNavigate, useParams } from 'react-router'
import Header from '../../components/header'
import Footer from '../../components/footer'
import SideInfo from '../../components/sideInfo'
import { useState, useEffect, useContext } from 'react'
import { MakeCard, MakeUpdateCard } from '../../assets/makeCard'
import { useSearchParams, Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Favorites from './favorites'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto.js'
import axios from 'axios'
import Colecciones from './colecciones.jsx'
import { UserContext } from '../../context/userContext.jsx'

export default function Usuario () {
  const navigate = useNavigate()
  const { idVendedor } = useParams()
  const { user, setUser } = useContext(UserContext)
  const [usuario, setUsuario] = useState({})
  const [permisos, setPermisos] = useState(false)
  const [librosUsuario, setLibrosUsuario] = useState([])
  const [dropdown, setDropdown] = useState(false)
  const [libroAEliminar, setLibroAEliminar] = useState(null)
  // Si la url incluye 'Usuarios' renderizar mis libros
  const [myPosts, setMyPosts] = useState(window.location.href.includes('usuarios') ? 'libros' : window.location.href.includes('favoritos') ? 'favoritos' : 'colecciones')

  const [searchParams] = useSearchParams()
  const eliminar = searchParams.get('eliminar')
  const libro = searchParams.get('libro')

  // Mantener el dropdown según los parámetros de búsqueda
  useEffect(() => {
    if (eliminar === 'y' && libro) {
      window.scrollTo(0, 0)
      document.documentElement.style.overflow = 'hidden'
      setDropdown(true)
      setLibroAEliminar(libro)
    } else {
      document.documentElement.style.overflow = 'auto'
      setDropdown(false)
    }
  }, [eliminar, libro])

  useEffect(() => {
    async function fetchResults () {
      try {
        if (idVendedor) {
          const response = await fetch(`http://localhost:3030/api/users/${idVendedor}`, {
            method: 'GET',
            credentials: 'include'
          })
          if (!response.ok) {
            window.location.href = '/popUp/userNotFound'
          }
          const data = await response.json()
          setUsuario(data)
          if (user) {
            if (data._id === user._id) {
              setPermisos(true)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchResults()
  }, [idVendedor, user])

  useEffect(() => {
    if (usuario && usuario.librosIds) {
      const fetchBooks = async () => {
        try {
          const fetchedBooks = await Promise.all(
            usuario.librosIds.map(async (idLibro) => {
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
          setLibrosUsuario(validBooks)
        } catch (error) {
          console.error('Error fetching book data:', error)
        }
      }
      fetchBooks()
    }
  }, [usuario])

  const confirmDelete = async () => {
    if (libroAEliminar) {
      try {
        const response = await fetch(`http://localhost:3030/api/books/${libroAEliminar}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
        if (response.ok) {
          // Actualiza el estado para eliminar el libro de la lista
          setLibrosUsuario((prevBooks) => prevBooks.filter((libro) => libro._id !== libroAEliminar))
          // Redirigir después de eliminar
          window.history.pushState({}, '', `/usuarios/${idVendedor}`)
        } else {
          console.error('Error al eliminar el libro')
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setDropdown(false)
        setLibroAEliminar(null)
      }
    }
  }

  function handleShare () {
    if (navigator.share) {
      navigator
        .share({
          title: 'Checa este vendedor!',
          text: 'Checa este vendedor:',
          url: window.location.href // Share the current URL
        })
        .then(() => console.log('Content shared successfully'))
        .catch((error) => console.error('Error sharing:', error))
    } else {
      // Fallback for unsupported browsers
      alert('Sharing is not supported on this browser.')
    }
  }
  async function handleFollowers (e) {
    e.preventDefault()
    if (!user) {
      toast.error(<div>Necesitas iniciar sesión <Link
        to='/login' style={{
          textDecoration: 'underline',
          color: 'var(--using4)'
        }}
                                                >aquí
                                                </Link>
                  </div>)
      return
    }

    // Fetch para actualizar el contador de seguidores
    try {
      const url = 'http://localhost:3030/api/users/follow'
      // Seguidor es el otro y user yo
      const body = {
        followerId: usuario._id,
        userId: user._id
      }

      const response = await axios.post(url, body, { withCredentials: true })
      if (!response.data.ok) return

      setUsuario(response.data.follower)
      setUser(response.data.user)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  return (
    <>
      <Header />
      <div className='userPageContainer'>
        {dropdown && (
          <>
            <div className='dropdownBackground' />
            <div className='success-container'>
              <h2>Eliminar libro</h2>
              <p>¿Estás seguro de eliminar? Esta acción es irreversible</p>
              <div>
                <Link to={`/usuarios/${idVendedor}`}>
                  <button className='back-button'>Cancelar</button>
                </Link>
                <button className='back-button eliminar' onClick={confirmDelete}>Eliminar</button>
              </div>
            </div>
          </>
        )}
        {usuario &&
            <div className='card-container'>

              <img
                src={renderProfilePhoto(usuario.fotoPerfil)}
                alt='Profile'
                className='profile-image'/>
              <div className='card-info'>

                <h1>{usuario.nombre}</h1>
                <h2>Seguidores: {usuario?.seguidores?.length || 0}</h2>
                <p>Libros publicados: {librosUsuario.length || 0}</p>
                <p>Libros vendidos: {usuario?.librosVendidos || 0}</p>
                <p>Estado de la cuenta: {usuario.estadoCuenta}</p>
                {usuario.bio && <span><big>{usuario.bio}</big></span>}
                <div>
                  {!permisos
                    ? (
                      <>

                        <button
                          className='compartir normal' onClick={(e) => {
                            e.preventDefault()
                            if (!user) {
                              toast.error(<div>Necesitas iniciar sesión <Link to='/login' style={{ textDecoration: 'underline', color: 'var(--using4)' }}>aquí</Link></div>)
                              return
                            }
                            navigate(`/mensajes?n=${usuario._id}`)
                          }}>
                          Enviar mensaje
                        </button>
                        <button className='compartir botonInverso' onClick={handleShare}>Compartir</button>
                        <button
                          style={{
                            background: user?.siguiendo?.includes(usuario._id) ? 'var(--using4)' : '',
                            color: user?.siguiendo?.includes(usuario._id) ? 'white' : ''
                          }}
                          className={`compartir ${user?.seguidores?.includes(usuario._id) ? 'normal' : 'botonInverso'}`}
                          onClick={handleFollowers}>

                          {user?.siguiendo?.includes(usuario._id) ? 'Siguiendo' : 'Seguir'}
                        </button>
                      </>
                      ) : (
                      <Link to='/usuarios/editarUsuario'>
                        <button className='compartir normal'>Editar perfil</button>
                      </Link>
                      )}
                </div>
              </div>
            </div>
            }
        <div className='select'>
          <div onClick={() => setMyPosts('libros')} className={myPosts === 'libros' ? 'active' : ''}>
            {permisos ? 'Mis libros' : 'Libros'}
          </div>
          <div onClick={() => setMyPosts('colecciones')} className={myPosts === 'colecciones' ? 'active' : ''}>
            Colecciones
          </div>
          <div onClick={() => setMyPosts('favoritos')} className={myPosts === 'favoritos' ? 'active' : ''}>
            {permisos ? 'Mis favoritos' : 'Favoritos'}
          </div>
        </div>
        <div className='postsContainer'>
          {usuario &&
                myPosts === 'libros' ? <>
                  {librosUsuario.map((libro, index) => 
                    permisos
                      ? <MakeUpdateCard key={index} element={libro} index={index} />
                      : user
                        ? <MakeCard key={index} element={libro} index={index} user={user} />
                        : <MakeCard key={index} element={libro} index={index} />
                  ).reverse()/* Están en orden de creación */}
                  {librosUsuario.length === 0 && <>No hay libros por aquí</>}
                </>
            : myPosts === 'favoritos'
              ? <Favorites vendedor={usuario} />
              : <Colecciones user={usuario} permisos={permisos} />}
        </div>
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
