import { toast } from 'react-toastify'
import axios from 'axios'
import { Link } from 'react-router-dom'
export async function handleFollowers ({ e, usuario, user, setUser, setUsuario = '' }) {
    e.preventDefault()
    if (!user) {
      toast.error(<div>Necesitas iniciar sesión <Link to='/login' style={{ textDecoration: 'underline', color: 'var(--using4)' }}>aquí</Link></div>)
      return
    }

    // Fetch para actualizar el contador de seguidores
    try {
      const url = 'http://localhost:3030/api/users/follow'
      // Seguidor es el otro y user yo
      const body = {
        followerId: usuario._id,
        userId: user._id
      }

      const response = await axios.post(url, body, { withCredentials: true })
      if (!response.data.ok) return
      if (setUsuario) setUsuario(response.data.follower)
      setUser(response.data.user)
    } catch (error) {
      console.error('Error:', error)
    }
  }