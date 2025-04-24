import axios from "axios"
import { cambiarEspacioAGuiones } from "../../assets/agregarMas"

let fetchTimeout = null // Variable to store the timeout ID

export function handleSearchInput(queryInput, setResults) {
  if (!queryInput.current.value) {
    setResults([])
    return
  }

  // Clear the previous timeout if it exists
  if (fetchTimeout) {
    clearTimeout(fetchTimeout)
  }

  // Set a new timeout for the cooldown period (e.g., 500ms)
  fetchTimeout = setTimeout(async () => {
    try {
      // Verificamos que la query no esté vacía o sea solo espacios
      if (queryInput.current.value && queryInput.current.value.trim()) {
        console.log('Fetching...')
        const url = `http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(queryInput.current.value)}`
        const response = await axios.get(url, { withCredentials: true })
        const bookResults = response.data

        // Convertir `bookResults` a un array antes de aplicar `slice`
        if (Array.isArray(bookResults)) {
          setResults(bookResults.slice(0, 5)) // Obtener los primeros 5 resultados
        }
      }
    } catch {
      // console.error('Error fetching book data:', error)
      setResults([]) // Retorna un array vacío en caso de error
    }
  }, 500) // Cooldown period in milliseconds
}