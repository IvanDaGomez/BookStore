/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCollectionCard } from '../../assets/makeCard'
import { cropImageToAspectRatio } from '../../assets/cropImageToAspectRatio'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto'

export default function Colecciones ({ user, permisos }) {
  const [colecciones, setColecciones] = useState([])
  const [openNewCollection, setOpenNewCollection] = useState(false)
  const [croppedImage, setCroppedImage] = useState({})
  const [librosFav, setLibrosFav] = useState([])
  const [addedCollections, setAddedCollections] = useState([])
  const [errors, setErrors] = useState([])
  useEffect(() => {
    async function fetchColecciones () {
      try {
        if (!user) return
        const url = 'http://localhost:3030/api/collections/getCollectionsByUser/' + user._id
        const response = await axios.get(url, { withCredentials: true })

        if (response.data) {
          setColecciones(response.data.data)
        }
      } catch {
        console.error('Error')
      }
    }
    fetchColecciones()
  }, [user])

  useEffect(() => {
    async function fetchFavorites () {
      if (!user) return
      const url = 'http://localhost:3030/api/books/getFavoritesByUser/' + user._id
      try {
        const response = await axios.get(url, { withCredentials: true })
        
        if (response.data) {
          setLibrosFav(response.data.data)
        }
      } catch {
        console.error('Error en el servidor')
      }
    }
    fetchFavorites()
  }, [user])
  async function handleSubmit (e) {
    e.preventDefault()
    if (!user) return
    const { nombre } = e.target
    const data = {
      nombre: nombre.value,
      foto: croppedImage?.url || '',
      userId: user._id
    }
    if (!data.nombre) {
      setErrors([...errors, 'El nombre es requerido'])
      return
    }
    if (Object.keys(croppedImage).length !== 0 && !croppedImage.type.includes('image/')) {
      setErrors([...errors, 'La imagen no es válida'])
      return
    }
    setErrors([])

    const formData = new FormData()
    async function urlToBlob (blobUrl) {
      const response = await fetch(blobUrl)
      const blob = await response.blob()
      return blob
    }
    if (Object.keys(croppedImage).length !== 0) {
      const blob = await urlToBlob(croppedImage.url)
      formData.append('images', blob, 'imagenPerfil.png') // Append new image
    }
    if (data) {
      for (const [key, value] of Object.entries(data || {})) {
        formData.append(key, value)
      }
    }
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`)
    // }
    try {
      const createCollectionUrl = 'http://localhost:3030/api/collections'
      const createCollectionResponse = await axios.post(createCollectionUrl, formData, { withCredentials: true })
      if (createCollectionResponse.data) {
        setColecciones([...colecciones, {...createCollectionResponse.data.data, librosIds: addedCollections}])
        
      }
      if (addedCollections.length > 0) {
        const addToCollectionUrl = 'http://localhost:3030/api/collections/addToCollection?collectionId=' + createCollectionResponse.data.data._id
        
        // Realizar las solicitudes de manera secuencial
        for (const bookId of addedCollections) {
          const fullUrl = addToCollectionUrl + `&bookId=${bookId}`
          try {
            const addToCollectionResponse = await axios.post(fullUrl, null, { withCredentials: true })
            // Puedes manejar la respuesta de cada libro aquí si lo necesitas
            console.log(addToCollectionResponse.data)
          } catch (error) {
            console.error('Error al agregar libro a la colección:', error)
          }
        }
      }

      setAddedCollections([])
      setCroppedImage({})
      setOpenNewCollection(false)
    } catch (error){
      console.log(error)
      console.error('Error en el servidor')
    }
  }

  async function handleImageChange (e) {
    const file = e.target.files[0]
    const crop = async () => {
      const croppedURL = await cropImageToAspectRatio(file, 2 / 3)
      return { url: croppedURL, type: file.type } // Guardar URL y tipo de archivo
    }
    const croppedFile = await crop()

    setCroppedImage(croppedFile) // Añadir imágenes recortadas con su tipo
  }

  async function handleClickImage (e) {
    e.preventDefault()
    document.querySelector('#foto').click()
  }

  async function handleAddToCollection (bookId) {
    if (!addedCollections.includes(bookId)) {
      setAddedCollections([...addedCollections, bookId])
    } else {
      setAddedCollections(addedCollections.filter(collection=>collection !== bookId))
    }
  }
  return (
    <>
      {openNewCollection && <div className='dropdownBackground'>
        <div className='success-container' style={{ width: 'min(60vw, 400px)', height: 'min(500px, 70vh)' }}>
          <form onSubmit={handleSubmit} noValidate>
            <h2>Crear Nueva Colección</h2>
            <div>
              <label htmlFor='nombre'>Nombre de la Colección:</label>
              <input
                type='text'
                name='nombre'
                id='nombre'
                required
              />
            </div>
            <div className='photoContainer' onClick={handleClickImage}>
              <img src={croppedImage?.url || 'http://localhost:3030/uploads/default.jpg'} alt='Profile Photo' />
              <svg className='more' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
                <path d='M12 8V16M16 12L8 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                <path d='M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z' stroke='currentColor' strokeWidth='1.5' />
              </svg>
            </div>
            <div>
              <input
                type='file'
                name='foto'
                id='foto'
                accept='image/*'
                required
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <h4>Agregar libros:</h4>
              <div className='librosFav'>{
                librosFav.length !== 0
                  ? librosFav.map((libro, index) => (
                    <div className={`libroFav ${addedCollections.includes(libro._id) ? 'reverse' : ''}`} key={index}
                      onClick={()=>handleAddToCollection(libro._id)}
                    >
                      <img src={renderProfilePhoto(libro.images[0])} alt={`Foto del libro ${libro.titulo}`} />
                      {libro.titulo}

                    </div>
                  ))
                  : <><h3>No tienes libros en favoritos</h3></>
}
              </div>
            </div>
            {errors.length !== 0 && <div className='error'>{errors[0]}</div>}
            <div className='flex'>
              <button type='submit'>Crear</button>
              <button className='botonInverso' onClick={() => setOpenNewCollection(!openNewCollection)}>Cerrar</button>
            </div>
          </form>
        </div>
      </div>}
      {permisos && <button className='newCollection' onClick={() => setOpenNewCollection(!openNewCollection)}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
          <path d='M12 8V16M16 12L8 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z' stroke='currentColor' strokeWidth='1.5' />
        </svg>Crear nueva colección
      </button>}
      {colecciones.length !== 0
        ? colecciones.map((coleccion, index) => (
          <MakeCollectionCard key={index} element={coleccion} index={index} user={user || ''} />
        )).reverse()
        : <>Aún no hay colecciones</>}
    </>
  )
}
