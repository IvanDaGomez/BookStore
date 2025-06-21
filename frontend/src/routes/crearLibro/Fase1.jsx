/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { validarPublicar1 } from '../../assets/validarPublicar'
import { toast } from 'react-toastify'
import FileUploader from './fase1/fileUploader'
import HowToUploadDropdown from './fase1/howToUploadDropdown'
import AIMode from './AIMode'
import ModalDiv from '../../assets/modalDiv'
import { BACKEND_URL } from '../../assets/config'

// import { ISBNmatch } from "../../assets/ISBNmatch";
export default function Fase1 ({ form, setForm, setFase, fase }) {
  
  const [croppedImages, setCroppedImages] = useState([])
  const [errors, setErrors] = useState([])
  // ---------------------------------------------FUNCION PARA ELIMINAR UNA IMAGEN EN LA LISTA

  const handleSubmit = async (e) => {
    e.preventDefault()

    const { autor, titulo, isbn, descripcion } = e.target
    const datos = {
      titulo: titulo.value,
      autor: autor.value,
      isbn: isbn.value,
      descripcion: descripcion.value,
      images: croppedImages
    }
    const fallos = validarPublicar1(datos) || []
    // Verificar ISBN

    // const coincide = await ISBNmatch(datos)
    // console.log(coincide)
    // if (!coincide) {
    //   setErrors([...errors, 'El ISBN no coincide con los datos del libro'])
    //   return
    // }
    if (fallos.length !== 0) {
      setErrors(fallos)
      return
    }

    setErrors([])

    setForm({
      ...form,
      ...datos
    })

    setFase(fase + 1)
  }

  useEffect(() => {
    document.querySelector('#titulo').value = form.titulo || ''
    document.querySelector('#descripcion').value = form.descripcion || ''
    document.querySelector('#autor').value = form.autor || ''
    document.querySelector('#isbn').value = form.isbn || ''

    setCroppedImages(form.images ?? [])
  }, [form.titulo, form.descripcion, form.images, form.autor, form.isbn])


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Previene el envío del formulario
    }
  }

  async function generateAutomaticDescription (e) {
    e.preventDefault()
    const titulo = document.querySelector('#titulo').value
    const autor = document.querySelector('#autor').value
    if (!titulo || !autor) {
      toast.error('Es necesario ingresar el título y autor del libro')
      return
    }
    const url = `${BACKEND_URL}/api/books/generateDescription`
    const body = {
      titulo,
      autor
    }

    document.querySelector('#descripcion').value = 'Creando descripción...'

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    if (response.error) {
      console.error('Error en la respuesta')
      return
    }
    const data = await response.json()

    if (data.error) {
      console.error('Error:', data.error)
      return
    }
    document.querySelector('#descripcion').value = data.description
  }

  return (
    <>
      <AIMode croppedImages={croppedImages} setCroppedImages={setCroppedImages} setForm={setForm} form={form}/>
      <form onSubmit={handleSubmit} noValidate>

        <HowToUploadDropdown />

        
        <FileUploader croppedImages={croppedImages} setCroppedImages={setCroppedImages} />
        <div className='inputCrear'>
          <label htmlFor='titulo'>Título *</label>
          <input

            id='titulo'
            type='text'
            name='titulo'
            placeholder='Título de tu libro'
            required
          />
        </div>
        <div className='inputCrear'>
          <label htmlFor='autor'>Autor *</label>
          <input
            id='autor'
            type='text'
            name='autor'
            placeholder='Autor de tu libro'
            required

          />
        </div>
        <div className='inputCrear'>
          <div>
          <label htmlFor='isbn'>ISBN * 
            <ModalDiv
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={30} height={30} color={"#ffffff"} fill={"none"}><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5"></circle><path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 9.39815 13.8837 9.76913 13.6831 10.0808C13.0854 11.0097 12 11.8954 12 13V13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"></path><path d="M11.992 17H12.001" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
              content={
                <>
                  <p>El ISBN (International Standard Book Number) es un identificador único para libros.</p>
                  <p>Se utiliza para distinguir ediciones y facilitar su comercialización.</p>
                </>
              }
              /></label></div>
          <input
            id='isbn'
            type='text'
            name='isbn'
            placeholder='ISBN de tu libro'
            required

          />
        </div>
        <div className='inputCrear'>
          <div>

            <label htmlFor='descripcion'>Descripción * </label>
            <ModalDiv
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}><path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="#ffffff" strokeWidth="1.5"></path><path d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path d="M11.992 8H12.001" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>} 
            content={<>
              <p>Indica por favor antes de la descripción del libro el estado y condiciones adicionales para evitar devoluciones.</p>
              <p>El costo de la devolución lo asume el vendedor.</p></>}
            />
            
            <button className='automaticDescription' onClick={generateAutomaticDescription}>Generar automáticamente</button>
          </div>
          
          <textarea
            id='descripcion'
            maxLength='2000'
            placeholder='Cuéntanos más de tu libro...'
            name='descripcion'
            required
            rows='6'
          />
        </div>

        {errors.length !== 0 && <div className='error'>{errors[0]}</div>}
        <div className='centrar'>
          <input type='submit' value='Continuar' onKeyDown={handleKeyPress} />
        </div>
      </form>
    </>
  )
}
