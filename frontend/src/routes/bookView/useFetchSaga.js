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
          bookId: libro.id,
          userId: libro.idVendedor
        }
        const response = await axios.post(url, body, {withCredentials: true})
        
        if (response.data) {
          setNombreSaga(response.data.data.nombre)

          const validBooks = []
          
          for (const idLibro of response.data.data.librosIds) {
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
        console.error('Error en el servidor')
      }
    }
    fetchSagaLibros()
  }, [libro])
  return [sagaLibros, nombreSaga]
}