import { toast } from 'react-toastify'

const handleFavoritos = (event, id, userId) => {
  event.stopPropagation()

  async function updateFavorites () {
    if (!id || !userId) return

    const url = `http://localhost:3030/api/users/${userId}`
    // Select the <path> inside the SVG using its unique className
    const favoritoIconPath = document.querySelectorAll(`.favorito-${id}`)

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          favoritos: id,
          accion: (favoritoIconPath.length > 0 && favoritoIconPath[0].classList.contains('favoritoActivo')) ? 'eliminar' : 'agregar'
        }),
        credentials: 'include'
      })

      const { error } = await response.json()
      if (error) {
        console.error(error)
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
      }
    } catch (err) {
      console.error('Error agregando a favoritos:', err)
      toast.error('Error al agregar a favoritos')
    }
  }

  updateFavorites()
}

export { handleFavoritos }
