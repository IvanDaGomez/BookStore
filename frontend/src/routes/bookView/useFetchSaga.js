import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../../assets/config"

export default function useFetchSaga(libro){
  const [sagaLibros, setSagaLibros] = useState([])
  const [nombreSaga, setNombreSaga] = useState('')
  const [sagaId, setSagaId] = useState('')
  useEffect(()=>{
    async function fetchSagaLibros() {
      if (!libro) return
      try {
        const url = `${BACKEND_URL}/api/collections/collectionSaga`

        const body = {
          book_id: libro.id,
          user_id: libro.id_vendedor
        }
        const response = await axios.post(url, body, {withCredentials: true})
        if (response.data.error) {
          console.error('Error en el servidor:', response.data.error)
          return
        }

        setNombreSaga(response.data.nombre)
        setSagaId(response.data.id)
        const booksUrl = `${BACKEND_URL}/api/books/idList/${response.data.libros_ids.join(',')}`
        const booksResponse = await axios.get(booksUrl, {withCredentials: true})
        if (response.data.error) {
          console.error('Error en el servidor:', response.data.error)
          return
        }

        setSagaLibros(booksResponse.data)
      } catch  {
        // console.error('Error en el servidor')
      }
    }
    fetchSagaLibros()
  }, [libro])
  return [sagaLibros, nombreSaga, sagaId]
}