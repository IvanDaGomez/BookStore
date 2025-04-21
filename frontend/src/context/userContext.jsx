import { useState, useEffect, createContext } from 'react'
import axios from 'axios'

const UserContext = createContext()
// eslint-disable-next-line react/prop-types
const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchUser () {

      try {
        const url = 'http://localhost:3030/api/users/userSession'
        const response = await axios.post(url, null, {
          withCredentials: true
        })
        setUser(response.data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null) // En caso de error, usuario no autenticado
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
