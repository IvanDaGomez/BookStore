/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCollectionCard } from '../../assets/makeCard'
import { cropImageToAspectRatio } from '../../assets/cropImageToAspectRatio'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto'
import { useFetchFavoriteBooks } from './useFetchFavoriteBooks'
import { BACKEND_URL } from '../../assets/config'

export default function Colecciones ({ user, permisos }) {
  const [colecciones, setColecciones] = useState([])
  const [openNewCollection, setOpenNewCollection] = useState(false)
  const [croppedImage, setCroppedImage] = useState({})
  const librosFav = useFetchFavoriteBooks(user)
  const [misLibros, setMisLibros] = useState([])
  const [addedCollections, setAddedCollections] = useState([])
  const [errors, setErrors] = useState([])
  const [checkbox, setCheckbox] = useState(false)
  useEffect(() => {
    async function fetchColecciones () {
      try {
        if (!user) return
        const url = `${BACKEND_URL}/api/collections/getCollectionsByUser/${user.id}`
        const response = await axios.get(url, { withCredentials: true })
        setColecciones(response.data)
      } catch {
        console.error('Error')
      }
    }
    fetchColecciones()
  }, [user])


  useEffect(() => {
    if (user && user.libros_ids) {
      const fetchBooks = async () => {
        try {
          const librosIds = user.libros_ids.join(',')
          const response = await axios.get(`${BACKEND_URL}/api/books/idList/${librosIds}`,{
            withCredentials: true
          })
          if (response.data.error) {
            console.error('Error in the server:', response.data.error)
            setMisLibros([])
            return
          }
          
          const validBooks = response.data.filter(book => book !== null)
          setMisLibros(validBooks)
        } catch (error) {
          console.error('Error fetching book data:', error)
        }
      }
      fetchBooks()
    }
  }, [user])
  async function handleSubmit (e) {
    e.preventDefault()
    if (!user) return
    if (user.libros_ids.length === 0) {
      setErrors([...errors, 'No tienes libros para agregar a la colección, vuelve cuando tengas libros'])
      setTimeout(()=>{
        setOpenNewCollection(false)
        setErrors([])
      }, 1000)
      return
    }
    const { nombre } = e.target

    const data = {
      nombre: nombre.value,
      foto: croppedImage?.url || '',
      user_id: user.id,
      saga: checkbox
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
      let filtered = addedCollections
      if (checkbox) {
        const filteredCollections = addedCollections.filter(coleccion=> misLibros.map(l => l.id).includes(coleccion))
        filtered = filteredCollections
      }
      const createCollectionUrl = `${BACKEND_URL}/api/collections`
      const createCollectionResponse = await axios.post(createCollectionUrl, formData, { withCredentials: true })
      if (createCollectionResponse.data.error) {
        setErrors([...errors, createCollectionResponse.data.error])
        return
      }
      setColecciones([...colecciones, {...createCollectionResponse.data, libros_ids: filtered}])
      
      if (addedCollections.length > 0) {
        const addToCollectionUrl = `${BACKEND_URL}/api/collections/addToCollection?collectionId=${createCollectionResponse.data.id}`

        // Realizar las solicitudes de manera secuencial
        const fullUrl = addToCollectionUrl + `&booksIds=${addedCollections.join(',')}`
        try {
          await axios.get(fullUrl, null, { withCredentials: true })
        } catch (error) {
          console.error('Error al agregar libro a la colección:', error)
        }
      }

      setAddedCollections([])
      setCheckbox(false)
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
      const croppedURL = await cropImageToAspectRatio(file, 21 / 9)
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
              <img src={croppedImage?.url || `${BACKEND_URL}/uploads/default.jpg`} alt='Profile Photo' />
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
              <div className='librosFav'>

                {misLibros.length !== 0 && <><div className="libroFav" style={{justifyContent:'center', padding: '5px'}}>Mis libros</div>
                  {misLibros.map((libro, index) => (
                    <div className={`libroFav ${addedCollections.includes(libro.id) ? 'reverse' : ''}`} key={index}
                      onClick={()=>handleAddToCollection(libro.id)}
                    >
                      <img src={renderProfilePhoto(libro.images[0])} alt={`Foto del libro ${libro.titulo}`} />
                      {libro.titulo}

                    </div>
                  ))}</>
                }{
                  (librosFav.length !== 0 && !checkbox) && <><div className="libroFav" style={{justifyContent:'center', padding: '5px'}}>Mis favoritos</div>
                    {librosFav.map((libro, index) => (
                      <div className={`libroFav ${addedCollections.includes(libro.id) ? 'reverse' : ''}`} key={index}
                        onClick={()=>handleAddToCollection(libro.id)}
                      >
                        <img src={renderProfilePhoto(libro.images[0])} alt={`Foto del libro ${libro.titulo}`} />
                        {libro.titulo}
  
                      </div>
                    ))}</>
                  }
              </div>
            </div>
            <div className='saga' ><label htmlFor='checkbox'>¿Pertenece a una serie de libros que estás vendiendo?</label>
                  <input type='checkbox' name='checkbox' id='checkbox' onClick={()=> setCheckbox(!checkbox)}  />
                  
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

      <div className="collection">
      {colecciones.length !== 0
        ? colecciones.map((coleccion, index) => (
          <MakeCollectionCard key={index} element={coleccion} index={index} user={user || ''} />
        )).reverse()
        : <>Aún no hay colecciones</>}
        </div>
    </>
  )
}
