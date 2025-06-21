import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNotification } from '../../assets/createNotification'
import { UserContext } from '../../context/userContext'
import axios from 'axios'
import { useReturnIfNoUser } from '../../assets/useReturnIfNoUser'
import './protectedReview.css'
import { BACKEND_URL } from '../../assets/config'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto'
import { isObjectEmpty } from '../../assets/isObjectEmpty'
export default function ProtectedReviewBook () {
  const { user, loading } = useContext(UserContext)
  const [books, setBooks] = useState([])
  const [currentBook, setCurrentBook] = useState(null)
  useReturnIfNoUser(user, loading, true)
  // Fetch books once the user is validated
  useEffect(() => {
    async function fetchBackStageBooks () {
      if (!user) return

      try {
        const response = await axios.get(`${BACKEND_URL}/api/books/review`)

        if (response.data.error) {
          console.error(response.data.error)
          return
        }

        setBooks(response.data)
        setCurrentBook(response.data[0] ?? null)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    fetchBackStageBooks()
  }, [user])

  // Function to remove a book from the review stage
  async function removeBookFromBackStage (bookId) {
    if (!bookId) return

    try {
      const url = `${BACKEND_URL}/api/books/review/${bookId}`
      const response = await axios.delete(url)
      if (response.data.error) {
        console.error(response.data.error)
        return
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId))
      toast.success('Libro eliminado')
    } catch (error) {
      console.error('Error removing book:', error)
    }
  }

  // Function to handle book acceptance
  async function handleAccept (book) {
    if (!book) return
    try {
      const url =
        book.method === 'PUT'
          ? `${BACKEND_URL}/api/books/${book.id}`
          : `${BACKEND_URL}/api/books`

      const body = {
        ...book,
        oferta: book.oferta !== null ? book.oferta : 0
      }

      const response = await fetch(url, {
        method: book.method === 'PUT' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include'
      })

      const data = await response.json()

      if (data.error) {
        console.error(data.error)
        return
      }

      await removeBookFromBackStage(book.id)
      moveToNextBook()
    } catch (error) {
      console.error('Error accepting book:', error)
    }
  }

  // Function to handle book rejection
  async function handleReject (book) {
    if (!book) return
    console.log(book)
    try {
      await removeBookFromBackStage(book.id)

      const reasonInput = document.querySelector('.reason')
      const reason = reasonInput ? reasonInput.value : 'Razón no especificada'

      const notificationToSend = {
        title: book.method === 'PUT' ? 'Tu libro no ha podido ser actualizado' : 'Tu libro ha sido rechazado',
        priority: 'normal',
        input: reason,
        type: 'bookRejected',
        user_id: book.id_vendedor,
        action_url: `${window.location.origin}/libros/${book.id}`,
        metadata: {
          photo: book.images?.[0] || 'default.jpg',
          book_title: book.titulo,
          book_id: book.id
        }
      }

      await createNotification(notificationToSend)
      moveToNextBook()
    } catch (error) {
      console.error('Error rejecting book:', error)
    }
  }

  // Move to the next book in the list
  function moveToNextBook () {
    setCurrentBook((prevBook) => {
      const nextIndex = books.indexOf(prevBook) + 1

      if (nextIndex < books.length) {
        return books[nextIndex]
      } else {
        setBooks([])
        return null
      }
    })
  }

  return (
    <>
      <Link to='/'>
        <button>Volver a inicio</button>
      </Link>
      <h1>Libros a revisar: {books.length}</h1>
      {books.length > 0 && currentBook
        ? (
          <div className='book-review'>
            <h2>{currentBook.titulo}</h2>
            <p>Descripción: {currentBook.descripcion}</p>
            {[
              currentBook.isbn && `ISBN: ${currentBook.isbn}`,
              currentBook.autor && `Autor: ${currentBook.autor}`,
              currentBook.genero && `Género: ${currentBook.genero}`,
              currentBook.estado && `Estado: ${currentBook.estado}`,
              currentBook.edicion && `Edición: ${currentBook.edicion}`,
              currentBook.tapa && `Tapa: ${currentBook.tapa}`,
              currentBook.idioma && `Idioma: ${currentBook.idioma}`,
              isObjectEmpty(currentBook.ubicacion) && `Ubicación: 
                                        Ciudad: ${currentBook.ubicacion.ciudad},
                                        Departamento: ${currentBook.ubicacion.departamento},
                                        País: ${currentBook.ubicacion.pais}`,
              currentBook.fecha_publicacion &&
              `Publicado: ${new Date(currentBook.fecha_publicacion).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}`,
              currentBook.edad && `Edad recomendada: ${currentBook.edad}`
            ]
              .filter(Boolean)
              .map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            <div className='keywordWrapper'>
              Palabras clave:{' '}
              {currentBook.keywords?.map((keyword, index) => (
                <div className='keyword' key={index}>
                  {keyword}
                </div>
              ))}
            </div>
            <div className='imageWrapper'>
              {currentBook.images?.map((image, index) => (
                <img
                  key={index}
                  src={renderProfilePhoto(image)}
                  alt='Portada del libro'
                />
              ))}
            </div>
            <div className='actions'>
              <button style={{ background: 'red' }} onClick={() => handleReject(currentBook)}>
                Rechazar
              </button>
              <button onClick={() => handleAccept(currentBook)}>Aprobar</button>
            </div>
            <input type='text' className='reason' placeholder='Razón de rechazo' />
          </div>
          )
        : (
          <p>{books.length === 0 ? 'No hay más libros para revisar.' : 'Cargando libros...'}</p>
          )}
    </>
  )
}
