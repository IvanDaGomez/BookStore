import axios from "axios"
import { useEffect, useState } from "react"

export function useFetchFavoriteBooks (vendedor) {
  const [librosFavoritos, setLibrosFavoritos] = useState([])

  useEffect(() => {
    async function fetchLibrosFavoritos () {
      try {
        if (!vendedor) return
        const url = 'http://localhost:3030/api/books/getFavoritesByUser/' + vendedor.id


        const response = await axios.get(url, { withCredentials: true })

        if (response.data.error) {
          console.error('Error in the server:', response.data.error)
          setLibrosFavoritos([])
          return
        }
        setLibrosFavoritos(response.data)

      } catch (error) {
        console.error('Error in the server:', error)
        setLibrosFavoritos([])
      }
    }
    fetchLibrosFavoritos()
  }, [vendedor]) // Re-run whenever 'vendedor' changes
  return librosFavoritos
}