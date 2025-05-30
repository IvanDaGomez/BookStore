import axios from "axios"
import { BACKEND_URL } from './config'

export default async function logout() {
    try {
      await axios.post(`${BACKEND_URL}/api/users/logout`, null, { withCredentials: true })
      window.location.reload()
    } catch {
      console.error('Error en el servidor')
    }
  }