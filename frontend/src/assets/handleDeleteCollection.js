import { toast } from "react-toastify"

const handleDeleteCollection = (event, id, userId) => {
  event.stopPropagation()

  async function updateFavorites () {
    if (!id || !userId) return

    const url = `http://localhost:3030/api/collections/${userId}`
    // Select the <path> inside the SVG using its unique className
    const coleccionIconPath = document.querySelectorAll(`.coleccion-${id}`)

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          coleccions: id,
          accion: (coleccionIconPath.length > 0 && coleccionIconPath[0].classList.contains('coleccionActivo')) ? 'eliminar' : 'agregar'
        }),
        credentials: 'include'
      })

      const { error } = await response.json()
      if (error) {
        console.error(error)
        toast.error('Hubo un problema al agregar a coleccions')
        return
      }

      if (coleccionIconPath.length > 0) {
        if (coleccionIconPath[0].classList.contains('coleccionActivo')) {
          toast.success('Eliminado de coleccions exitosamente')
        } else {
          toast.success('Agregado a coleccions exitosamente')
        }
      }
    } catch (err) {
      console.error('Error agregando a coleccions:', err)
      toast.error('Error al agregar a coleccions')
    }
  }

  updateFavorites()
}
export { handleDeleteCollection }