import { toast } from "react-toastify"
import { createNotification } from "../../assets/createNotification"

export   async function handleSubmitPregunta (user, libro) {
    const inputPregunta = document.querySelector('.inputPregunta')

    if (!inputPregunta.value) {
      return
    }
    if (!user) {
      toast.error('Necesitas iniciar sesión para hacer preguntas')
      return
    }
    if (libro) {
      const url = `http://localhost:3030/api/books/${libro._id}`

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mensaje: inputPregunta.value,
            tipo: 'pregunta',
            senderId: user._id
          }),
          credentials: 'include'

        })

        if (!response.ok) {
          // Actualizar el estado de errores usando setErrors
          return // Salir de la función si hay un error
        }
        const data = await response.json()
        if (data.error) {
          toast.error('Error')
          return
        }
        // Future: type de notificación
        const notificationToSend = {
          title: 'Tienes una nueva pregunta',
          priority: 'normal',
          type: 'newQuestion',
          userId: libro.idVendedor,
          input: inputPregunta.value,
          actionUrl: window.location.href,
          metadata: {
            photo: libro.images[0],
            bookTitle: libro.titulo,
            bookId: libro._id
          }
        }
        createNotification(notificationToSend)
        toast.success('Pregunta enviada exitosamente')
        inputPregunta.value = ''
      } catch (error) {
        console.error('Error al enviar la solicitud:', error)
        // También puedes agregar el error de catch a los errore
      }
    }
  }