import { useNavigate, useParams } from 'react-router'
import Header from '../../components/header/header.jsx'
import Footer from '../../components/footer/footer.jsx'
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
import { handleFollowers } from '../../assets/handles/handleFollowers.jsx'
import './usuario.css'
import { BACKEND_URL } from '../../assets/config'
export default function Usuario () {
  const navigate = useNavigate()
  const { idVendedor } = useParams()
  const { user, loading, setUser } = useContext(UserContext)
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
          const response = await fetch(`${BACKEND_URL}/api/users/${idVendedor}`, {
            method: 'GET',
            credentials: 'include'
          })
          if (!response.ok) {
            window.location.href = '/popUp/userNotFound'
          }
          const data = await response.json()
          setUsuario(data)
          if (user) {
            if (data.id === user.id) {
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
    if (usuario && usuario.libros_ids) {
      const fetchBooks = async () => {
        try {


          const response = await axios.get(`${BACKEND_URL}/api/books/idList/${usuario.libros_ids.join(',')}`, {
            method: 'GET',
            credentials: 'include'
          })
          if (!response.data.error) {
            const validBooks = response.data.filter(book => book !== null)
            setLibrosUsuario(validBooks)
            return response.data
          } else {
            console.error('Libro no encontrado')
            return null
          }

        
          

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
        await axios.delete(`${BACKEND_URL}/api/books/${libroAEliminar}`, { withCredentials: true })
        setLibrosUsuario((prevBooks) => prevBooks.filter((libro) => libro.id !== libroAEliminar))
        window.history.pushState({}, '', `/usuarios/${idVendedor}`)

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
  if (loading) return <div className='loading'>Cargando...</div>
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
        {(usuario && librosUsuario) &&
            <div className='user-container'>

              <img
                src={renderProfilePhoto(usuario.foto_perfil)}
                alt='Profile'
                className='profile-image'/>
              <div className='card-info'>
                <h1>{usuario.nombre}</h1>
                <h2>Seguidores: {usuario?.seguidores?.length ?? 0}</h2>
                <p>Libros publicados: {librosUsuario.length ?? 0}</p>
                <p>Libros vendidos: {librosUsuario.filter(libro => libro.disponibilidad === 'Vendido')?.length ?? 0}</p>
                <p>Estado de la cuenta: {usuario.estado_cuenta}</p>
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
                            navigate(`/mensajes?n=${usuario.id}`)
                          }}>
                          Enviar mensaje
                        </button>
                        <button className='compartir botonInverso' onClick={handleShare}>Compartir</button>
                        <button
                          style={{
                            background: user?.siguiendo?.includes(usuario.id) ? 'var(--using4)' : '',
                            color: user?.siguiendo?.includes(usuario.id) ? 'white' : ''
                          }}
                          className={`compartir ${user?.seguidores?.includes(usuario.id) ? 'normal' : 'botonInverso'}`}
                          onClick={(e)=>handleFollowers({ e, user, usuario, setUser, setUsuario})}>

                          {user?.siguiendo?.includes(usuario.id) ? 'Siguiendo' : 'Seguir'}
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
        <div className='postsContainer' style={{ paddingTop: permisos ? '60px': 0 }}>
          {(usuario && librosUsuario) &&
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
              ? <Favorites user={user} vendedor={usuario} />
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
