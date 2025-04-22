import axios from "axios"

export default async function logout() {
    try {
      await axios.post('http://localhost:3030/api/users/logout', null, { withCredentials: true })
      window.location.reload()
    } catch {
      console.error('Error en el servidor')
    }
  }