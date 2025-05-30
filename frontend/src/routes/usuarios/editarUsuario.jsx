import { useState, useEffect, useContext } from 'react'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import Footer from '../../components/footer/footer.jsx'
import { validarActualizarUsuario } from '../../assets/validarPublicar'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto'
import { cropImageToAspectRatio } from '../../assets/cropImageToAspectRatio'
import './usuario.css'
import { UserContext } from '../../context/userContext.jsx'
import titleCase from '../../assets/toTitleCase.js'
import SelectButton from '../search/selectButton.jsx'
import { BACKEND_URL } from '../../assets/config'
export default function EditarUsuario () {
  const { user } = useContext(UserContext)
  const [fotoPerfil, setFotoPerfil] = useState('')
  const [estadoCuenta, setEstadoCuenta] = useState('')

  const [form, setForm] = useState({})
  const [errors, setErrors] = useState([])



  useEffect(() => {
    if (user) {
      document.querySelector('#nombre').value = user.nombre || ''
      document.querySelector('#bio').value = user.bio || ''

      setFotoPerfil(renderProfilePhoto(user?.foto_perfil || ''))

    }
  }, [user])


  const handleSetForm = (e) => {
    const { name, value } = e.target
    setForm((prevForm) => ({ ...prevForm, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { nombre, bio, nuevaContraseña } = e.target
    const fallos = validarActualizarUsuario({
      nombre: nombre.value,
      bio: bio.value
    }) || []

    if (fallos.length !== 0) {
      setErrors(fallos)
      return
    }

    setErrors([])

    const formData = new FormData()
    setForm({ ...form, contraseña: (nuevaContraseña) || '' })

    async function urlToBlob (blobUrl) {
      const response = await fetch(blobUrl)
      const blob = await response.blob()
      return blob
    }
    if (Object.keys(croppedImage).length !== 0) {
      const blob = await urlToBlob(croppedImage.url)
      formData.append('images', blob, 'imagenPerfil.png') // Append new image
    }
    if (form) {
      for (const [key, value] of Object.entries(form || {})) {
        formData.append(key, value)
      }
    }

    formData.append('actualizado_en', new Date().toISOString())

    formData.append('estado_cuenta', titleCase(estadoCuenta || user.estado_cuenta))
    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}: ${value}`)
    // }
    try {
      const URL = `${BACKEND_URL}/api/users/${user.id}`
      const response = await fetch(URL, {
        method: 'PATCH',
        body: formData,
        credentials: 'include'
      })

      const data = await response.json()
      if (data.error) {
        setErrors([...errors, data.error])
        console.error(data.error)
        return
      }

      window.location.href = '/popUp/exitoActualizandoUsuario'
    } catch (error) {
      console.error('Error al enviar los datos:', error)
    }
  }
  function handleProfilePhotoClick (e) {
    e.preventDefault()
    document.getElementById('inputFotoPerfil').click()
  }

  const [croppedImage, setCroppedImage] = useState({})
  async function handleImageChange (e) {
    const file = e.target.files[0]
    const crop = async () => {
      const croppedURL = await cropImageToAspectRatio(file, 1 / 1)
      return { url: croppedURL, type: file.type } // Guardar URL y tipo de archivo
    }
    const croppedFile = await crop()

    setCroppedImage(croppedFile) // Añadir imágenes recortadas con su tipo
  }
  return (
    <>
      <Header />
      {user && (
        <form onSubmit={handleSubmit} noValidate onChange={handleSetForm}>
          <div className='editarUsuario'>
            <div className='editarFotoContainer'>
              <img src={croppedImage.url || fotoPerfil} alt='Profile' />
              <input
                id='inputFotoPerfil'
                type='file' name='foto_perfil'
                accept='image/*'
                onChange={handleImageChange} style={{ display: 'none' }}
              />

            </div>

            <button onClick={handleProfilePhotoClick}>Cambiar foto</button>
            <div className='inputCrear'>
              <label htmlFor='nombre'>Nombre</label>
              <input id='nombre' type='text' name='nombre' placeholder='Tu nombre' />
            </div>
            <div className='inputCrear'>
              <label htmlFor='bio'>Bio</label>
              <input id='bio' type='text' name='bio' placeholder='Tu bio' />
            </div>
            {/* <div className='inputCrear'>
              <label htmlFor='correo'>Correo</label>
              <input id='correo' type='email' name='correo' placeholder='Tu correo' />
            </div>
            <div className='inputCrear'>
              <label htmlFor='anteriorContraseña'>Cambiar Contraseña *</label>
              <input id='anteriorContraseña' type='password' name='anteriorContraseña' placeholder='Anterior Contraseña' />
              <input id='nuevaContraseña' type='password' name='nuevaContraseña' placeholder='Nueva Contraseña' />
            </div> */}
            
              <SelectButton 
              filter={
                {
                  name: 'Estado de la cuenta',
                  values: ['Activo', 'Inactivo', 'Vacaciones']
                }
              }
              callback={(e) => {
                setEstadoCuenta(e.target.innerText)
                document.querySelectorAll('.filterOption').forEach((el) => {
                  el.classList.remove('choosen')
                })
                e.target.classList.add('choosen')
              }}
              index={0}
              />
            {errors.length > 0 && <div className='error'>{errors[0]}</div>}
            <button type='submit'>Enviar</button>
          </div>
        </form>
      )}
      <SideInfo />
      <Footer />
    </>
  )
}
