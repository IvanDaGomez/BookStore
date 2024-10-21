import { useParams } from "react-router"
import Header from "../../components/header"
import Footer from "../../components/footer"
import SideInfo from "../../components/sideInfo"
import { useState, useEffect } from "react"
import { makeCard } from "../../assets/makeCard"

export default function Usuario(){
    const { idVendedor } = useParams()


    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:3030/api/users/userSession', {
                    method: 'POST',
                    credentials: 'include',  // Asegúrate de enviar las cookies
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); // Establece el usuario en el estado
                } else {
                    console.error('Failed to fetch user data:', response);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUser(); // Llama a la función para obtener el usuario
    }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente

    
    const [usuario, setUsuario] = useState({})
    const [permisos, setPermisos] = useState(false)

        // Fetch del usuario
        useEffect(() => {
            async function fetchResults() {
              try {
                // Verificamos que la query no esté vacía o sea solo espacios
                if (idVendedor && user) {
                  const response = await fetch(`http://localhost:3030/api/users/${idVendedor}`, {
                    method: 'GET',
                    credentials: 'include',  // Enviar las cookies
                  });
          
                  if (!response.ok) {
                    window.location.href = '/popUp/userNotFound'  
                  }
                  const data = await response.json();
                    setUsuario(data); // Establece los resultados en el estado
                    
                  if (data._id === user._id){
                    setPermisos(true)
                  }
                }

              } catch (error) {
                console.error('Error fetching book data:', error);
              }
            }
          
            fetchResults(); // Llama a la función para obtener los resultados
          }, [idVendedor, user]); // Ejecuta cada vez que 'query' cambie
          const [librosUsuario, setLibrosUsuario] = useState([]);

          // Fetch de los libros del usuario
          useEffect(() => {
            if (usuario && usuario.librosIds) {
              const fetchBooks = async () => {
                try {
                  const fetchedBooks = await Promise.all(
                    usuario.librosIds.map(async (idLibro) => {
                      const response = await fetch(`http://localhost:3030/api/books/${idLibro}`, {
                        method: 'GET',
                        credentials: 'include', // Enviar las cookies
                      });
          
                      if (response.ok) {
                        return response.json();
                      } else {
                        console.log('Book not found');
                        return null; // o podrías lanzar un error
                      }
                    })
                  );
          
                  // Filtra los resultados válidos
                  const validBooks = fetchedBooks.filter(book => book !== null);
                  setLibrosUsuario(validBooks); // Actualiza el estado con todos los libros
                } catch (error) {
                  console.error('Error fetching book data:', error);
                }
              };
          
              fetchBooks(); // Llama a la función para obtener los resultados
            }
          }, [usuario]); // Ejecuta cada vez que 'usuario' cambie

          const handleShare = async () => {
    const url = window.location.href; // Puedes personalizar la URL o texto

    try {
      await navigator.share({
        title: '¡Mira esto!',
        text: 'Visita esta página increíble:',
        url,
      });
      console.log('Compartido con éxito');
    } catch (error) {
      console.error('Error al compartir:', error);
      alert('No se pudo compartir. Intenta copiar el enlace.');
    }
  };
          return (
            <>
              <Header />
              {usuario.nombre ? ( // Renderiza solo si el usuario está cargado
                <div className="card-container">
                  <img
                    src={
                      usuario.fotoPerfil && usuario.fotoPerfil.trim() !== ''
                        ? `http://localhost:3030/uploads/${usuario.fotoPerfil}`
                        : 'http://localhost:3030/uploads/default.jpg'
                    }
                    alt="Profile"
                    className="profile-image"
                  />
                  <div className="card-info">
                    <h1 className="name">{usuario.nombre}</h1>
                    <p>Libros publicados: {librosUsuario.length || 0}</p>
                    <p>Libros vendidos: {usuario?.librosVendidos || 0}</p>
                    <p>Estado de la cuenta: {usuario.estadoCuenta}</p>
                    
                    <div>
                    { !permisos ? 
                    <>
                    <button className="compartir normal">Enviar mensaje</button>
                    <button className="compartir botonInverso" onClick={handleShare}>Compartir</button>
                    </>
                    : <button className="compartir normal">Editar perfil</button>
                    }
                    </div>
                  </div>
                </div>
              ) : (
                <p>Cargando información del usuario...</p> // Loader mientras se carga el usuario
              )}
          
              <div className="postsContainer">
                {librosUsuario.map((libro, index) => makeCard(libro, index))}
              </div>
              <Footer />
              <SideInfo />
            </>
          );
}