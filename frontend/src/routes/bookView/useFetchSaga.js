import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchSaga(libro){
  const [sagaLibros, setSagaLibros] = useState([])
  const [nombreSaga, setNombreSaga] = useState('')
  useEffect(()=>{
    async function fetchSagaLibros() {
      if (!libro) return
      try {
        const url = 'http://localhost:3030/api/collections/collectionSaga'

        const body = {
          book_id: libro.id,
          user_id: libro.id_vendedor
        }
        const response = await axios.post(url, body, {withCredentials: true})
        if (response.data.error) {
          console.error('Error en el servidor:', response.data.error)
          return
        }
        console.log('Saga response:', response.data)
        if (response.data) {
          setNombreSaga(response.data.nombre)

          const validBooks = []
          
          for (const idLibro of response.data.libros_ids) {
            try {
              const response = await axios.get(`http://localhost:3030/api/books/${idLibro}`, {
                withCredentials: true
              })
              if (response.ok) {
                const book = await response.json()
                validBooks.push(book)
              } else {
                console.error(`Libro ${idLibro} no encontrado`)
              }
            } catch (error) {
              console.error(`Error fetching libro ${idLibro}:`, error)
            }
          }

          setSagaLibros(validBooks)
        }
      } catch  {
        // console.error('Error en el servidor')
      }
    }
    fetchSagaLibros()
  }, [libro])
  return [sagaLibros, nombreSaga]
}