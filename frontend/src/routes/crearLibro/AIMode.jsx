/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import ModalDiv from "../../assets/modalDiv"
import { BACKEND_URL } from "../../assets/config"
export default function AIMode({ croppedImages, setCroppedImages, form, setForm }) {
  const switchRef = useRef(null)
  function inputGenerating() {
    document.querySelector('#titulo').value = 'Generando...'
    document.querySelector('#descripcion').value = 'Generando...'
    document.querySelector('#autor').value = 'Generando...'
  }
  const [alreadyGenerated, setAlreadyGenerated] = useState(false)
  async function handleAIMode() {
    try {
      if (croppedImages.length === 0 || !switchRef.current.checked) return 
      if (alreadyGenerated) return
      const formData = new FormData()
      // async function urlToBlob (blobUrl) {
      //   const response = await fetch(blobUrl)
      //   const blob = await response.blob()
      //   return blob
      // }
      // const blobImage = await urlToBlob(croppedImages[0])
      // const fixedBlob = new Blob([blobImage], { type: 'image/png' })
      // console.log('Imagen Blob:', fixedBlob)
      // Iterar sobre las imágenes en formato Blob y agregarlas al FormData
      formData.append('image', croppedImages[0].blob, `image.png`)
      inputGenerating()
      const url = `${BACKEND_URL}/api/books/ai/aiMode`
      const response = await axios.post(url, formData, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } })
      if (response.data.error) {
        console.error('Error en la respuesta:', response.data.error)
        return
      }
      const data = response.data
      const newForm = {
        ...form,
        titulo: data.titulo,
        images: croppedImages,
        autor: data.autor,
        precio: data.precio,
        idioma: data.idioma,
        descripcion: data.descripcion,
        // genero: data.genero, genero no me esta devolviendo bien valores
        keywords: data.keywords
      }
      setForm(newForm)
      setCroppedImages(croppedImages)
      setAlreadyGenerated(true)
      console.log('Nuevo formulario:', newForm)
    } catch (error) {
      console.error('Error en la respuesta', error)
    }
  }
  useEffect(() => {
    if (croppedImages.length > 0 && switchRef.current.checked) {
      handleAIMode()
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedImages, switchRef.current?.checked])

  return (
    <div className="AIMode">
      <h2>Modo IA</h2>
      <ModalDiv
        icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={30} height={30} color={"#ffffff"} fill={"none"}><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5"></circle><path d="M10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9C14 9.39815 13.8837 9.76913 13.6831 10.0808C13.0854 11.0097 12 11.8954 12 13V13.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"></path><path d="M11.992 17H12.001" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
        content={<><p>El modo IA te permite generar automáticamente la mayor parte de la información del libro. Para ello, selecciona una imagen de la portada de tu libro y la IA generará los datos automáticamente.</p>
            <p>Recuerda que puedes editar los datos generados por la IA antes de enviar el formulario.</p></>}
        />
      <div>
      <label className="switch">
        <input type="checkbox" ref={switchRef} onChange={handleAIMode}/>
        <span className="slider">
        <svg className="slider-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation"><path fill="none" d="m4 16.5 8 8 16-16"></path></svg> 
        </span>
      </label>
      </div>
    </div>
  )
}