import axios from "axios"

export function handleSearchInput (queryInput, setResults) {
  if (!queryInput.current.value) {
    setResults([])
    return
  }

  // Función para obtener los resultados de búsqueda
  async function fetchResults () {
    try {
      // Verificamos que la query no esté vacía o sea solo espacios
      if (queryInput.current.value && queryInput.current.value.trim()) {
        const url = `http://localhost:3030/api/books/query?q=${queryInput.current.value}`
        const response = await axios.get(url, { withCredentials: true })
        console.log(response.data)
        return response.data
      }
    } catch (error) {
      console.error('Error fetching book data:', error)
      return [] // Retorna un array vacío en caso de error
    }
  }

  // Llama a la función para obtener los resultados
  fetchResults().then(bookResults => {
    // Convertir `bookResults` a un array antes de aplicar `slice`
    if (Array.isArray(bookResults)) {
      setResults(bookResults.slice(0, 5)) // Obtener los primeros 5 resultados
    }
  })
}