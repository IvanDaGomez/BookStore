import { toast } from "react-toastify"

const handleFavoritos = (event, id, userId) => {
  event.preventDefault();
  event.stopPropagation();

  async function updateFavorites() {
    if (!id) return;
    if (!userId) {
      toast.error('Necesitas iniciar sesión');
      return;
    }

    const url = `http://localhost:3030/api/users/${userId}`;
    // Selecciona el <path> dentro del SVG usando su className único
    const favoritoIconPath = document.querySelectorAll(`.favorito-${id}`);
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          favoritos: id,
          accion: (favoritoIconPath.classList.contains('favoritoActivo')) ? 'eliminar' : 'agregar'
        }),
        credentials: 'include'
      });

      const { error } = await response.json();
      if (error) {
        console.error(error);
        toast.error('Hubo un problema al agregar a favoritos');
        return;
      }

      
      if (favoritoIconPath[0].classList.contains('favoritoActivo')) {
        
        favoritoIconPath.classList.remove('favoritoActivo');
        toast.success('Eliminado de favoritos exitosamente');
      }
      else{
        favoritoIconPath[0].classList.add('favoritoActivo');
        toast.success('Agregado a favoritos exitosamente');
      }
      /*let action;
    console.log(favoritoIconPath)
      favoritoIconPath.forEach((favoritoId) => {
        if (favoritoId.classList.contains('favoritoActivo')) {
        
          favoritoId.classList.remove('favoritoActivo');
          action = 'Eliminado de favoritos exitosamente'
          
        }
        else{
          favoritoId.classList.add('favoritoActivo');
          action ='Agregado a favoritos exitosamente'
        }
      })
      toast.success(action);
 */
      
    } catch (err) {
      console.error('Error agregando a favoritos:', err);
      toast.error('Error al agregar a favoritos');
    }
  }

  updateFavorites();
};

export { handleFavoritos };
