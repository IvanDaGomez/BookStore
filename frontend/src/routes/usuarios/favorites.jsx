/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { MakeCard } from '../../assets/makeCard'

export default function Favorites ({ vendedor }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser () {
      try {
        const response = await fetch('http://localhost:3030/api/users/userSession', {
          method: 'POST',
          credentials: 'include' // Ensure cookies are sent
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUser() // Call to fetch user on mount
  }, []) // Only run once, on mount

  const [librosFavoritos, setLibrosFavoritos] = useState([])

  useEffect(() => {
    async function fetchLibrosFavoritos () {
      try {
        const url = 'http://localhost:3030/api/books/'

        // Create promises to fetch all the favoritos books
        const promises = vendedor.favoritos.map(async (favorito) => {
          try {
            const response = await fetch(url + favorito)

            if (!response.ok) {
              console.error(`Error fetching book with ID ${favorito}:`, response.statusText)
              return null // Return null on error to handle gracefully
            }

            const data = await response.json()

            if (data.error) {
              console.error(`Error in book data for ID ${favorito}:`, data.error)
              return null // Return null if there's an error in the data
            }

            return data // Return the valid book data
          } catch (error) {
            console.error(`Error fetching book with ID ${favorito}:`, error)
            return null // Return null in case of an error
          }
        })

        // Wait for all promises to resolve
        const results = await Promise.all(promises)

        console.log(results.filter((libro) => libro != null)) // Log results to see what's returned

        // Filter out null or undefined results
        setLibrosFavoritos(results.filter((libro) => libro != null))
      } catch (error) {
        console.error('Error in the server:', error)
      }
    }

    fetchLibrosFavoritos()
  }, [vendedor]) // Re-run whenever 'vendedor' changes

  return (
    <>
      {librosFavoritos && librosFavoritos
        .map((libro, index) => <MakeCard key={index} element={libro} index={index} user={user || ''} />)}
      {librosFavoritos.length === 0 && <>No hay libros por aquí</>}
    </>
  )
}
