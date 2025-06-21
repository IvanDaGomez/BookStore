import { useEffect } from "react"
import { toast } from "react-toastify"
import { BACKEND_URL } from "../../assets/config"

export default function useSendForm ({
  fase,
  form,
  setForm,
  user,
  setFase,
  actualizar,
  libro,
  navigate,
  sending = false,
  setSending
}) {
  useEffect(() => {
    if (fase === 4 && user && user.id && user.nombre && !sending) {
      setSending(true)
      const enviarForm = async () => {
        const formData = new FormData() // Crear una nueva instancia de FormData

        async function urlToBlob (blobUrl) {
          const response = await fetch(blobUrl)
          const blob = await response.blob()
          return blob
        }

        const blobPromises = form.images.map(image => urlToBlob(image.url))

        // Esperar a que todas las promesas se resuelvan
        const blobs = await Promise.all(blobPromises)
        // Iterar sobre las imágenes en formato Blob y agregarlas al FormData
        blobs.forEach((blob, index) => {
          // Añadir cada imagen como archivo al FormData, dándole un nombre único
          formData.append('images', blob, `image-${index}.png`)
        })

        // Añadir los demás campos del formulario al FormData
        for (const [key, value] of Object.entries(form)) {
          if (key !== 'images') {
            formData.append(key, value)
          }
        }
        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`)
        }
        const timeNow = new Date().toISOString()
        // Agregar campos adicionales al FormData
        if (!actualizar) formData.append('fecha_publicacion', `${timeNow}`)
        formData.append('actualizado_en', `${timeNow}`)
        formData.append('id_vendedor', user.id)
        formData.append('vendedor', user.nombre)
        formData.append('disponibilidad', libro?.disponibilidad || 'Disponible')

        try {
          const URL = (!actualizar) ? `${BACKEND_URL}/api/books/review` : `${BACKEND_URL}/api/books/review/${libro}`
          const response = await fetch(URL, {
            method: (!actualizar) ? 'POST' : 'PUT',
            body: formData, // Enviar el FormData directamente
            credentials: 'include'
          })

          const data = await response.json()
          if (data.error) {
            console.error(data.error)
            toast.error('Se ha producido un error al crear el libro. Revisa los datos e intenta nuevamente.')
            setFase(1)
            return
          }

          setForm({}) // Restablecer el formulario
          localStorage.removeItem('form')
          setFase(1)
          localStorage.removeItem('fase')

          navigate('/popUp/exitoCreandoLibro')
        } catch (error) {
          console.error('Error al enviar los datos:', error)
        } finally {
          setSending(false)
        }
        
      }

      if (fase === 4) enviarForm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, form, user, actualizar, libro])
}