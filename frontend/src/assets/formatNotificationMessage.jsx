import { formatDate } from './formatDate'
import { toast } from 'react-toastify'
import axios from 'axios'
import { reduceText } from './reduceText'
import { BACKEND_URL } from './config'
function SimpleNotification (notification) {
  const { title, created_in } = notification


  const formattedDate = formatDate(created_in)
  return (
    <>
      <span style={{fontSize: 'var(--font-size-medium)'}}>{reduceText(title, 50)}</span>
      <span style={{fontSize: 'var(--font-size-medium)'}}>{formattedDate}</span>
    </>
  )
}

function DetailedNotification (notification) {
  const { type, created_in, metadata, user_id, action_url, input, read, id } = notification
  console.log(notification)
  const formattedDate = formatDate(created_in)
  async function handleSubmitAnswer () {
    const inputPregunta = document.querySelector('.answerQuestion')

    if (!inputPregunta.value) {
      return
    }
    if (metadata) {
      const url = `${BACKEND_URL}/api/books/questionBook`

      try {
        const response = await axios.post(url, {
            respuesta: inputPregunta.value,
            tipo: 'respuesta',
            pregunta: metadata.pregunta, 
            sender_id: user_id,
            book_id: metadata.book_id
          },
          { withCredentials: 'include' })

        if (response.data.error) {
          toast.error('Error en el servidor')
          return
        }

        const deleteUrl = `${BACKEND_URL}/api/notifications/${id}`
        await axios.delete(deleteUrl)

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
              src={`${BACKEND_URL}/uploads/${metadata.photo}`}
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
        {type === 'bookRejected' && <>Razón: </>}{input}</div>}
      {['messageQuestion', 'messageResponse'].includes(type) && <>
        <div className='input'>
          Pregunta: {notification.metadata.pregunta}
        </div>
        {['messageResponse'].includes(type) &&
        <div className='input'>
          Respuesta: {notification.metadata.respuesta}
        </div>
        }
        {['messageQuestion'].includes(type) &&
        <div className='sendAnswer'>
          <input type='text' className='answerQuestion' placeholder='Responder' />
          <div className='send' onClick={(event) => handleSubmitAnswer(event)}>
            <img src='/sendMessage.svg' alt='Send Message' />
          </div>
        </div>
        }</>}
      <div className='downNotification'>
        {action_url && !['bookRejected', 'newFollower'].includes(type) && (
          <a href={action_url} className='notification-link'>
            Ver el libro
          </a>)}
        <span>{formattedDate}</span>
      </div>

    </div>
  )
}

export { SimpleNotification, DetailedNotification }
