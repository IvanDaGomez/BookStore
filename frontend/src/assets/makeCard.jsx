/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { reduceText } from './reduceText'
import { Link, useNavigate } from 'react-router-dom'
import { handleFavoritos } from './handleFavoritos'
import { toast } from 'react-toastify'
import { useEffect } from 'react'

const anchoDeIconos = 30

const MakeCard = ({ element, index, user = '', callback = () => {} }) => {
  // Aplicar la clase "favoritoActivo" después de renderizar las tarjetas
  useEffect(() => {
    if (user && user.favoritos) {
      user.favoritos.forEach((favoritoId) => {
        const favorites = document.querySelectorAll(`.favorito-${favoritoId}`)
        favorites.forEach((element) => element.classList.add('favoritoActivo'))
      })
    }
  }, [user]) // Se ejecuta cada vez que se actualizan user o libros
  return (
    <Link to={`/libros/${element._id}`}>
      <div className='sectionElement' key={index} style={{ filter: `opacity(${element.disponibilidad === 'Vendido' ? '0.6' : '1'})` }}>
        <div className='imageElementContainer' style={{ backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`, backgroundRepeat: 'no-repeat' }}>
          {element.disponibilidad === 'Vendido' ? (
            <div
              className='percentageElement'
              style={{ background: 'red' }}
            >
              Vendido
            </div>
          ) : (element.oferta || element.estado === 'Nuevo' || element.fechaPublicacion) ? (
            <div
              className='percentageElement'
              style={{
                background: element.oferta
                  ? 'green'
                  : (new Date() - new Date(element.fechaPublicacion) < 15 * 24 * 60 * 60 * 1000) // 15 días en milisegundos
                      ? '#4457ff' // Color para "Nuevo"
                      : 'gray' // Color para "En perfecto estado"
              }}
            >
              {element.oferta
                ? Math.ceil(((1 - element.oferta / element.precio) * 100).toFixed(2) / 5) * 5 + '% de descuento'
                : (new Date() - new Date(element.fechaPublicacion) < 15 * 24 * 60 * 60 * 1000)
                    ? '¡Nuevo!' // Si se creó hace menos de 15 días
                    : 'En perfecto estado' // Si no se creó recientemente
                      }
            </div>
          ) : null}

        </div>
        <h2>{reduceText(element.titulo, 25)}</h2>
        <div className='sectionElementTextDiv'>

          <h3>
            {[element.autor && reduceText(element.autor, 20),
              element.genero && reduceText(element.genero, 15)
            ]
              .filter(Boolean) // Filtra los elementos que no son null/undefined/false
              .join(' | ')}
          </h3>
          <h3 style={{ color: 'var(--using4)', fontSize: '1.8rem' }}>{element.estado}</h3>
          <div className='precioSections'>{(element.oferta)
            ? <><h3 style={{ display: 'inline', marginRight: '10px' }}><s>${element.precio.toLocaleString('es-CO')}</s></h3>
              <h2 style={{ display: 'inline' }}>${element.oferta.toLocaleString('es-CO')}</h2>
            </>
            : <><h2 style={{ textAlign: 'center' }}>${element.precio.toLocaleString('es-CO')}</h2></>}
          </div>

        </div>
        {element.disponibilidad !== 'Vendido'
          ? <div className='extraInfoElement'>
            <svg
              onClick={(event) => {
                event.preventDefault()

                if (!user) {
                  toast.error(<div>Necesitas iniciar sesión <Link to='/login' style={{ textDecoration: 'underline', color: 'var(--using4)' }}>aquí</Link></div>)
                  return
                }
                user._id ? handleFavoritos(event, element._id, user._id) : handleFavoritos(event, element._id)
                callback()
              }} className={'favoritos ' + `favorito-${element._id}`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={anchoDeIconos} height={anchoDeIconos} color='#fff'
            >
              <path d='M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z' stroke='currentColor' strokeWidth='1' strokeLinecap='round' />
            </svg>

            <div
              className='fastInfoElement' onClick={(e) => {
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
                window.location.href = `/checkout/${element._id}`
              }}
            >
              <span>Comprar</span>
            </div>

            <svg
              onClick={(e) => {
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
                window.location.href = `/mensajes?n=${element.idVendedor}&q=${element._id}`
              }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={anchoDeIconos} height={anchoDeIconos} color='#000000' fill='none'
            >
              <path d='M8.5 14.5H15.5M8.5 9.5H12' stroke='currentColor' strokeWidth='1' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z' stroke='currentColor' strokeWidth='1' strokeLinejoin='round' />
            </svg>

            </div>
          : <div style={{ height: '30px' }} />}
      </div>
    </Link>

  )
}

const MakeOneFrCard = ({ element, index, user = '' }) => {
  const navigate = useNavigate()
  return (
    <Link key={element._id} to={`/libros/${element._id}`}>
      <div className='cardContainer' style={{ filter: `opacity(${element.disponibilidad === 'Vendido' ? '0.6' : '1'})` }}>

        {/* Imagen de los auriculares */}
        <div className='imageContainer' style={{ textAlign: 'center' }}>
          <img
            src={`http://localhost:3030/uploads/${element.images[0]}`}
            alt={element.titulo}
          />
        </div>

        {/* Nombre del producto */}
        <div className='infoContainer'>
          <h2 className='productName'>
            {reduceText(element.titulo, 50)}
          </h2>

          {/* Estrellas de rating y número de reseñas
        <div className="ratings">
          <span className="ratingsStars accent">★★★★☆</span>
          <span className="ratingsNumber">3,356</span>
        </div> */}

          {/* Precio y oferta */}
          <div>
            <div className='precioSections'>{(element.oferta) ? <><h2 style={{ display: 'inline' }}>${element.oferta.toLocaleString('es-CO')}</h2><h3 style={{ display: 'inline', marginLeft: '10px' }}><s>${element.precio.toLocaleString('es-CO')}</s></h3></> : <><h2>${element.precio.toLocaleString('es-CO')}</h2></>}
            </div>
          </div>

          <div className='details'>
            <h2>{element.autor}</h2>
            <h2 style={{ textAlign: 'left' }}>{element.estado}</h2>
            <h2>{element.categoria}</h2>
          </div>

          <div className='soldBy' style={{ fontSize: '14px', color: '#555' }}>
            Vendido por <span onClick={() => navigate(`/usuarios/${element.idVendedor}`)} className='accent'>{element.vendedor}</span>
          </div>

          {/* Botón de agregar al carrito */}

          <button
            className='addToCartButton'
            onClick={(event) => {
              event.preventDefault()

              if (!user._id) {
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
  return (
    <Link key={index} to={`/libros/${element._id}`}>
      <div className='sectionElement' style={{ filter: `opacity(${element.disponibilidad === 'Vendido' ? '0.6' : '1'})` }}>

        <div className='imageElementContainer' style={{ backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`, backgroundRepeat: 'no-repeat' }}>
          {(element.disponibilidad === 'Vendido')
            ? (
              <div
                className='percentageElement'
                style={{ background: 'red' }}
              >
                Vendido
              </div>
              )
            : null}
        </div>

        <div style={{ padding: '5px' }}>
          <h2 style={{ textAlign: 'center' }}>{reduceText(element.titulo, 25)}</h2>
          <h3>
            {[element.autor && reduceText(element.autor, 30),
              element.genero && reduceText(element.genero, 15)]
              .filter(Boolean) // Filtra los elementos que no son null/undefined/false
              .join(' | ')}
          </h3>
          <h3 style={{ color: 'var(--using4)', fontSize: '1.8rem' }}>{element.estado}</h3>
          <div className='precioSections'>{(element.oferta) ? <><h3 style={{ display: 'inline', marginRight: '10px' }}><s>${element.precio.toLocaleString('es-CO')}</s></h3><h2 style={{ display: 'inline' }}>${element.oferta.toLocaleString('es-CO')}</h2></> : <><h2 style={{ textAlign: 'center' }}>${element.precio.toLocaleString('es-CO')}</h2></>}
          </div>
          <div className='editarOEliminar'>

            <Link to={`/libros/crear?vendedor=${element.idVendedor}&libro=${element._id}`}>
              <button>
                Editar
              </button>
            </Link>

            <Link to={`/usuarios/${element.idVendedor}?eliminar=y&libro=${element._id}`}>
              <button
                className='eliminar'
              >
                Eliminar
              </button>
            </Link>
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
            ? <div className='percentageElement'>
              {Math.ceil(((1 - element.oferta / element.precio) * 100).toFixed(2) / 5) * 5 + '%'}
            </div>
            : <div style={{ padding: 'calc(10px + 1rem)' }} />}
        </div>

        <h2>{reduceText(element.titulo, 33)}</h2>

        <div className='precioSections'>{(element.oferta) ? <><h2>${element.oferta.toLocaleString('es-CO')}</h2></> : <><h2>${element.precio.toLocaleString('es-CO')}</h2></>}
        </div>

      </div>
    </Link>
  )
}
// Pendiente
const MakeCollectionCard = ({ element, index }) => {
  return (
    <Link key={index} style={{ width: '100%', height: '100%' }} to={`/colecciones/${element._id}`}>
      <div className='collectionElement'>
        <div className='imageElementCollectionContainer'>
          <img src={element.foto} alt='' />
        </div>
        <div className='info'>
          <h2>{element.nombre}</h2>
          Seguidores: {element.seguidores.length}
        </div>
      </div>
    </Link>
  )
}

export { MakeCard, MakeOneFrCard, MakeUpdateCard, MakeSmallCard, MakeCollectionCard }
