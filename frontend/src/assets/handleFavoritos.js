import { toast } from 'react-toastify'
import { necesitasIniciarSesion } from './jsxConstants'
import axios from 'axios'

const handleFavoritos = (event, id, userId) => {
  event.stopPropagation()
  async function updateFavorites () {
    if (!id || !userId) {
      toast.error(necesitasIniciarSesion)
      return
    }

    const url = `http://localhost:3030/api/users/favorites/${userId}`
    // Select the <path> inside the SVG using its unique className
    const favoritoIconPath = document.querySelectorAll(`.favorito-${id}`)

    try {
      const response = await axios.patch(url, {
        book_id: id,
        accion: (favoritoIconPath.length > 0 && favoritoIconPath[0].classList.contains('favoritoActivo')) ? 'eliminar' : 'agregar'
      }, { withCredentials: true })


      if (response.data.error) {
        console.error(response.data.error)
        toast.error('Hubo un problema al agregar a favoritos')
        return
      }

      if (favoritoIconPath.length > 0) {
        if (favoritoIconPath[0].classList.contains('favoritoActivo')) {
          favoritoIconPath[0].classList.remove('favoritoActivo')
          toast.success('Eliminado de favoritos exitosamente')
        } else {
          favoritoIconPath[0].classList.add('favoritoActivo')
          toast.success('Agregado a favoritos exitosamente')
        }
      } else {
        toast.success('Agregado a favoritos exitosamente')
      }
    } catch (err) {
      console.error('Error agregando a favoritos:', err)
      toast.error('Error al agregar a favoritos')
    }
  }

  updateFavorites()
}

export { handleFavoritos }
