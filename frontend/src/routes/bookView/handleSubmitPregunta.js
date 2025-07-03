import { toast } from "react-toastify"
// import { createNotification } from "../../assets/createNotification"
import axios from "axios"
import { BACKEND_URL } from "../../assets/config"
import { necesitasIniciarSesion } from "../../assets/jsxConstants"
export   async function handleSubmitPregunta (libro, user) {
    const inputPregunta = document.querySelector('.inputPregunta')

    if (!inputPregunta.value) {
      return
    }
    if (!user) {
      toast.error(necesitasIniciarSesion)
      return
    }
    if (!libro) return
    const url = `${BACKEND_URL}/api/books/questionBook`
    const body = {
          pregunta: inputPregunta.value,
          tipo: 'pregunta',
          sender_id: user.id,
          book_id: libro.id
        }
    try {
      inputPregunta.value = 'Enviando...'
      const response = await axios.post(url, body, { withCredentials: true })

      if (response.data.error) {
        toast.error(response.data.error)
        return
      }
      // createNotification(notificationToSend)
      toast.success('Pregunta enviada exitosamente')
      inputPregunta.value = ''
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      toast.error('Error al enviar la pregunta')
      // También puedes agregar el error de catch a los errore
    }
  }