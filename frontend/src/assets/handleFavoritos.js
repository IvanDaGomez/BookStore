import { toast } from "react-toastify"

const handleFavoritos = (event, id, userId) => {
    event.preventDefault()
    event.stopPropagation()
    
    async function updateFavorites(){
      if (!id) return
      if (!userId) {
        toast.error('Necesitas iniciar sesión')
        return
      }
      const url = 'http://localhost:3030/api/users/' + userId
  
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            favoritos: id,
            accion: 'agregar'
          }),
          credentials: 'include'
        })
        const data = await response.json()
        if (data.error){
          console.error(data.error)
        }
        // pendiente
        // document.querySelector('.favorites').style.fill = 'red'
        toast.success('Agregado a favoritos exitosamente')
      } catch {
        console.error('Error agregando a favoritos')
      }
    }
    updateFavorites()
  }

export { handleFavoritos }