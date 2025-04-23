import axios from "axios"
import { useEffect, useState } from "react"
import { cambiarEspacioAGuiones } from "./agregarMas"

export default function useFetchBooksByQuery(query, limit = 12) {
  const [results, setResults] = useState([])
  const [url] = useState(`http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(query)}&l=${limit}`)
  useEffect(() => {
    const fetchResults = async () => {
      try {

        // if (filter === 'Nuevo') {
        //    url = 'http://localhost:3030/api/books/query/filters?Fecha-de-publicación=' + 'Menos-de-una-semana'
        // }
        // else {
        // }

        const response = await axios.get(url, { withCredentials: true })
        setResults(response.data)
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }

    fetchResults()
  }, [query, url])
  return [results]
}