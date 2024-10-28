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
    const favoritoIconPath = document.querySelector(`.favorito-${id}`);
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


      if (favoritoIconPath.classList.contains('favoritoActivo')) {
        favoritoIconPath.classList.remove('favoritoActivo');
        toast.success('Eliminado de favoritos exitosamente');
      }
      else{
        favoritoIconPath.classList.add('favoritoActivo');
        toast.success('Agregado a favoritos exitosamente');
      }

      
    } catch (err) {
      console.error('Error agregando a favoritos:', err);
      toast.error('Error al agregar a favoritos');
    }
  }

  updateFavorites();
};

export { handleFavoritos };
