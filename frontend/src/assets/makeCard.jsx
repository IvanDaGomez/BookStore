/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { reduceText } from './reduceText.js'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { handleFavoritos } from './handleFavoritos.js'
import { toast } from 'react-toastify'
import { useEffect } from 'react'
import { renderProfilePhoto } from './renderProfilePhoto.js'
import { handleFollowers } from './handles/handleFollowers.jsx'
import RenderImageHeader from './makeCard/renderImageHeader.jsx'
import RenderMidText from './makeCard/renderMidText.jsx'
import RenderBottomText from './makeCard/renderBottomText.jsx'
import { necesitasIniciarSesion } from './jsxConstants.jsx'
export const PriceTitleRender = ({ element }) => {

  if (!element?.precio) return null
  return (<>
  
  {(element.oferta) ? <>
  <h2 className='red' style={{ display: 'inline' }}>
    ${element.oferta.toLocaleString('es-CO')}
    </h2>
    <h3 style={{ display: 'inline', marginLeft: '10px' }}>
      <s>${element.precio.toLocaleString('es-CO')}</s>
      </h3></> : <>
      <h2 className='red'>
        ${element.precio.toLocaleString('es-CO')}
        </h2></>}
  </>)
}
const MakeCard = ({ element, index, user = '', callback = () => {}, wordLimit = 25 }) => {
  // Aplicar la clase "favoritoActivo" después de renderizar las tarjetas
  useEffect(() => {
    if (user && user.favoritos) {
      user.favoritos.forEach((favoritoId) => {
        const favorites = document.querySelectorAll(`.favorito-${favoritoId}`)
        favorites.forEach((element) => element.classList.add('favoritoActivo'))
      })
    }
  }, [user]) // Se ejecuta cada vez que se actualizan user o libros
  const [width, setWidth] = useState(0)
  const sectionsContainer = document.querySelector('.sectionsContainer') ?? null
  const updateWidth = () => {
    if (sectionsContainer) {
      const numBooks = sectionsContainer.querySelectorAll('.sectionElement').length
      setWidth(sectionsContainer.offsetWidth / numBooks)
    }
  }

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Link to={`/libros/${element._id}`} key={index} >
      <div className='sectionElement' 
        style={{ filter: `opacity(${element.disponibilidad === 'Vendido' ? '0.6' : '1'})`, 
                 width: `${width}px`
      }}
        
        >
        <div className='imageElementContainer' style={{ backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`, backgroundRepeat: 'no-repeat' }}>
          <RenderImageHeader element={element}/>
        </div>
        <RenderMidText element={element} wordLimit={wordLimit}/>
        <RenderBottomText element={element} user={user} callback={callback}/>
      </div>
    </Link>

  )
}
const MakeCardPlaceHolder = ({ l }) => {
  return (<>
    {Array.from({ length: l }).map((_, index) => (
    <div className='sectionElement placeholder' key={index}>

        <div className='imageElementContainer'/>
        <div className='sectionElementTextDiv'></div>
          <div className='textPlaceholder'></div>
          <div className='textPlaceholder'></div>
        

    </div>
  ))}</>)
}
const MakeOneFrCard = ({ element, index, user = '' }) => {
  const navigate = useNavigate()
  return (
    <Link key={element._id} to={`/libros/${element._id}`}>
      <div className='cardContainer' style={{ filter: `opacity(${element.disponibilidad === 'Vendido' ? '0.6' : '1'})` }}>

        {/* Imagen de los auriculares */}
        <div className='imageContainer' style={{ textAlign: 'center' }}>
          <img
            src={`http://localhost:3030/uploads/${element.images ? element?.images[0]: ''}`}
            alt={element.titulo}
            title={element.titulo}
          />
        </div>

        {/* Nombre del producto */}
        <div className='infoContainer'>
          <h2 className='productName'>
            {reduceText(element?.titulo ?? '', 50)}
          </h2>


          {/* Precio y oferta */}
            <div className='precioSections'>
              <PriceTitleRender element={element} />
            </div>


          <div className='details'>
            <h3>{element.autor}</h3>
            <h3 style={{ textAlign: 'left' }}>{element.estado}</h3>
            <h3>{element.categoria}</h3>
          </div>

          <div className='soldBy'>
            Vendido por <span onClick={() => navigate(`/usuarios/${element.idVendedor}`)} className='accent'>{element.vendedor}</span>
          </div>

          {/* Botón de agregar al carrito */}

          <button
            className='addToCartButton'
            onClick={(event) => {
              event.preventDefault()

              if (!user._id) {
                toast.error(necesitasIniciarSesion)
                return
              }
              user._id ? handleFavoritos(event, element._id, user._id) : handleFavoritos(event, element._id)
              toast.success('Agregado a favoritos exitosamente')
            }}
          >
            Agregar a favoritos
          </button>

        </div>
      </div>
    </Link>

  )
}
const MakeUpdateCard = ({ element, index }) => {
  const navigate = useNavigate()
  return (
    <Link key={index} to={`/libros/${element._id}`}>
      <div className='sectionElement' style={{ filter: `opacity(${element.disponibilidad === 'Vendido' ? '0.6' : '1'})` }}>

        <div className='imageElementContainer' style={{ backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`, backgroundRepeat: 'no-repeat' }}>
          {(element.disponibilidad === 'Vendido')
            ? (
              <div
               className='bookLabel'
                style={{ background: 'red' }}
              >
                Vendido
              </div>
              )
            : null}
        </div>

        <div>
          <RenderMidText element={element}/>
          <div className='editarOEliminar'>

              <button onClick={(e)=> {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/libros/crear?vendedor=${element.idVendedor}&libro=${element._id}`)}
                }>
                Editar
              </button>


              <button
                onClick={(e)=> {
                  e.preventDefault()
                  e.stopPropagation()
                  navigate(`/usuarios/${element.idVendedor}?eliminar=y&libro=${element._id}`)}
                }
                className='eliminar'
              >
                Eliminar
              </button>

          </div>
        </div>
      </div>
    </Link>

  )
}

const MakeSmallCard = ({ element, index }) => {
  return (
    <Link key={index} style={{ width: '100%', height: '100%' }} to={`${window.location.origin}/libros/${element._id}`}>
      <div className='sectionElement'>

        <div className='imageElementContainer' style={{ backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`, backgroundRepeat: 'no-repeat' }}>
          {(element.oferta)
            ? <div className='bookLabel'>
              {Math.ceil(((1 - element.oferta / element.precio) * 100).toFixed(2) / 5) * 5 + '%'}
            </div>
            : <div style={{ padding: 'calc(10px + 1rem)' }} />}
        </div>
          <div className="sectionElementTextDiv">
        <h2>{reduceText(element.titulo, 33)}</h2>
        
        {(element.oferta) ? <h2 className='red'>${element.oferta.toLocaleString('es-CO')}</h2> : <h2 className='red'>${element.precio.toLocaleString('es-CO')}</h2>}
        </div>


      </div>
    </Link>
  )
}
// Pendiente
const MakeCollectionCard = ({ element, index }) => {
  async function handleSave () {
    
  }
  return (
    <Link key={index} style={{ width: '100%', height: '100%' }} to={`/colecciones/${element._id}`}>
      <div className='sectionElement'>
        <h2>{element.nombre}</h2>
        <div className='imageElementCollectionContainer'>
          <img src={renderProfilePhoto(element.foto)} alt='' />
        </div>
        <div className='info'>
          Libros: {element.librosIds.length}
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </Link>
  )
}

const MakeUserCard = ({ element, index, user, setElement, setUser }) => {
  const [following, setFollowing] = useState(false)
  async function handleFollow() {

  }
  return (
    <Link key={index} style={{ width: '100%', height: '100%' }} to={`/usuarios/${element._id}`}>
      {console.log(element)}
      <div className="userElement" >
        <div className="imageElementUserContainer"> 
          <img
            src={renderProfilePhoto(element.fotoPerfil)}
            alt="Foto de perfil"
          />
        </div>
        <div className="info" >
          <h2>{element.nombre}</h2>
          {/*<p>{element.bio || ''}</p>*/}
          <p>
            Libros publicados: <strong>{element?.librosIds?.length || 0}</strong>
          </p>
          <button onClick={(e) => handleFollowers({ e, user, usuario: element, setUsuario: setElement, setUser})}
            className={`${user?.siguiendo?.includes(element._id) ? 'botonInverso' : ''}`}>
          {user?.siguiendo?.includes(element._id) ? 'Siguiendo' : 'Seguir'}
          </button>
        </div>
      </div>
    </Link>
  );
};

export { MakeCard, MakeCardPlaceHolder, MakeOneFrCard, MakeUpdateCard, MakeSmallCard, MakeCollectionCard, MakeUserCard }
