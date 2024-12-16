/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { MakeCard } from '../../assets/makeCard'
import axios from 'axios'

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
        if (!vendedor) return
        const url = 'http://localhost:3030/api/books/getFavoritesByUser/' + vendedor._id


        const response = await axios.get(url, { withCredentials: true })
        if (response.data) {
          setLibrosFavoritos(response.data.data)
        }
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
