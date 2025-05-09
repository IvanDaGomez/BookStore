import { toast } from 'react-toastify'
import axios from 'axios'
import { necesitasIniciarSesion } from '../jsxConstants'
export async function handleFollowers ({ e, usuario, user, setUser, setUsuario = '' }) {
    e.preventDefault()
    if (!user) {
      toast.error(necesitasIniciarSesion)
      return
    }

    // Fetch para actualizar el contador de seguidores
    try {
      const url = 'http://localhost:3030/api/users/follow'
      // Seguidor es el otro y user yo
      const body = {
        follower_id: usuario.id,
        user_id: user.id
      }

      const response = await axios.post(url, body, { withCredentials: true })
      if (response.data.error) return
      if (setUsuario) setUsuario(response.data.follower)
      setUser(response.data.user)
    } catch (error) {
      console.error('Error:', error)
    }
  }