import { createNotification } from './createNotification'
import { formatDate } from './formatDate'
import { toast } from 'react-toastify'
function SimpleNotification (notification) {
  const { type, title, created_in, metadata } = notification

  const typeMessages = {
    newMessage: 'Tienes un nuevo mensaje!',
    newQuestion: 'Tienes una nueva pregunta!',
    bookPublished: 'Tu libro ha sido publicado!',
    bookUpdated: 'Tu libro ha sido actualizado con éxito!',
    bookSold: `Tu libro "${metadata.book_title}" ha sido vendido!`,
    orderShipped: 'Tu pedido ha sido entregado!',
    reviewReceived: `Tienes una nueva reseña de "${metadata.book_title}"!`
  }

  const typeIcons = {
    newMessage: '📩',
    bookPublished: '📘',
    bookUpdated: '📘',
    bookSold: '💸',
    orderShipped: '📦',
    reviewReceived: '⭐'
  }

  const formattedDate = formatDate(created_in)
  return (
    <>
      {typeIcons[type] || '🔔'}
      <span>{title || typeMessages[type]}</span>
      <span>{formattedDate}</span>
    </>
  )
}

function DetailedNotification (notification) {
  const { type, created_in, metadata, user_id, action_url, read, input, id } = notification

  const typeIcons = {
    newMessage: '📩',
    bookPublished: '📘',
    bookSold: '💸',
    orderShipped: '📦',
    reviewReceived: '⭐'
  }

  const formattedDate = formatDate(created_in)

  async function handleSubmitAnswer () {
    const inputPregunta = document.querySelector('.answerQuestion')

    if (!inputPregunta.value) {
      return
    }
    if (metadata) {
      const url = `http://localhost:3030/api/books/${metadata.book_id}`

      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mensaje: inputPregunta.value,
            tipo: 'respuesta',
            pregunta: input
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

        const deleteUrl = `http://localhost:3030/api/notifications/${id}`
        const deleted = await fetch(deleteUrl, {
          method: 'DELETE',
          credentials: 'include'
        })
        if (!deleted.ok) {
          toast.error('No se pudo eliminar la notificación')
          return
        }
        const notificationToSend = {
          title: 'Tu pregunta ha sido respondida!',
          priority: 'normal',
          type: 'questionAnswered',
          user_id,
          input: inputPregunta.value,
          action_url,
          metadata: {
            photo: metadata.photo,
            bookTitle: metadata.book_title,
            bookId: metadata.book_id,
            question: input
          }
        }
        // Enviar notificación de vuelta al usuario
        createNotification(notificationToSend)

        toast.success('Pregunta enviada exitosamente')
        inputPregunta.value = ''
      } catch (error) {
        console.error('Error al enviar la solicitud:', error)
        // También puedes agregar el error de catch a los errore
      }
    }
  }
  return (
    <div className={`notification-item ${read ? 'read' : 'unread'}`}>
      <h2 style={{ marginBottom: '5px' }}>{notification.title}</h2>
      <div className='notification-content'>
        {metadata.photo && (
          <>
            <img
              src={'http://localhost:3030/uploads/' + metadata.photo}
              alt='Notification'
              className='notification-photo'
            />
            <div>
              <h2>{metadata.book_title}</h2>
            </div>
          </>
        )}
      </div>
      {metadata?.question && <span><big>{metadata.question}</big></span>}
      {(input) && <div className='input'>
        {type === 'bookRejected' && <>Razón: </>}{input}

                  </div>}
      {['newQuestion'].includes(type) && <>
        <div className='sendAnswer'>
          <input type='text' className='answerQuestion' placeholder='Responder' />
          <div className='send' onClick={(event) => handleSubmitAnswer(event)}>
            <img src='/sendMessage.svg' alt='Send Message' />
          </div>
        </div></>}
      <div className='downNotification'>
        {typeIcons[type] || '🔔'}
        {action_url && !['bookRejected'].includes(type) && (
          <a href={action_url} className='notification-link'>
            Ver el libro
          </a>)}
        <span>{formattedDate}</span>

      </div>

    </div>
  )
}

export { SimpleNotification, DetailedNotification }
