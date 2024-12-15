import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createNotification } from '../../assets/createNotification'

export default function ProtectedReviewBook () {
  const [user, setUser] = useState(null)
  const [books, setBooks] = useState([])
  const [currentBook, setCurrentBook] = useState(null)

  // Fetch the user session on mount
  useEffect(() => {
    async function fetchUser () {
      try {
        const response = await fetch('http://localhost:3030/api/users/userSession', {
          method: 'POST',
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data?.user?.rol === 'admin') {
            setUser(data.user)
            return
          }
        }
        // Redirect if user is not authorized
        window.location.href = '/'
      } catch (error) {
        console.error('Error fetching user data:', error)
        window.location.href = '/popUp/noUser'
      }
    }

    fetchUser()
  }, [])

  // Fetch books once the user is validated
  useEffect(() => {
    async function fetchBackStageBooks () {
      if (!user) return

      try {
        const response = await fetch('http://localhost:3030/api/books/review')

        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }

        const data = await response.json()

        if (data.error) {
          console.error(data.error)
          return
        }

        setBooks(data)
        setCurrentBook(data[0] || null)
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    }

    fetchBackStageBooks()
  }, [user])

  // Function to remove a book from the review stage
  async function removeBookFromBackStage (bookId) {
    console.log(bookId)
    if (!bookId) return

    try {
      const url = `http://localhost:3030/api/books/review/${bookId}`
      const response = await fetch(url, { method: 'DELETE' })
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to remove book')
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId))
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
          ? `http://localhost:3030/api/books/${book._id}`
          : 'http://localhost:3030/api/books'

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

      await removeBookFromBackStage(book._id)
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
      await removeBookFromBackStage(book._id)

      const reasonInput = document.querySelector('.reason')
      const reason = reasonInput ? reasonInput.value : 'Razón no especificada'

      const notificationToSend = {
        title: book.method === 'PUT' ? 'Tu libro no ha podido ser actualizado' : 'Tu libro ha sido rechazado',
        priority: 'normal',
        input: reason,
        type: 'bookRejected',
        userId: book.idVendedor,
        actionUrl: `${window.location.origin}/libros/${book._id}`,
        metadata: {
          photo: book.images?.[0] || 'default.png',
          bookTitle: book.titulo,
          bookId: book._id
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
              currentBook.ubicacion && `Ubicación: ${currentBook.ubicacion}`,
              currentBook.fechaPublicacion &&
              `Publicado: ${new Date(currentBook.fechaPublicacion).toLocaleDateString('es-ES', {
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
                  src={`http://localhost:3030/uploads/${image || 'default.png'}`}
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
