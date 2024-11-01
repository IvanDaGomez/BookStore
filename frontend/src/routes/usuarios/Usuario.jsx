import { useParams } from "react-router";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SideInfo from "../../components/sideInfo";
import { useState, useEffect } from "react";
import { makeCard, makeUpdateCard } from "../../assets/makeCard";
import { useSearchParams, Link } from "react-router-dom";

export default function Usuario() {
    const { idVendedor } = useParams();
    const [user, setUser] = useState(null);
    const [usuario, setUsuario] = useState({});
    const [permisos, setPermisos] = useState(false);
    const [librosUsuario, setLibrosUsuario] = useState([]);
    const [dropdown, setDropdown] = useState(false);
    const [libroAEliminar, setLibroAEliminar] = useState(null);

    const [searchParams] = useSearchParams();
    const eliminar = searchParams.get('eliminar');
    const libro = searchParams.get('libro');

    // Mantener el dropdown según los parámetros de búsqueda
    useEffect(() => {
        if (eliminar === 'y' && libro) {
          window.scrollTo(0, 0);
          document.documentElement.style.overflow = 'hidden'
            setDropdown(true);
            setLibroAEliminar(libro);
        } else {
          document.documentElement.style.overflow = 'auto'
            setDropdown(false);
        }
    }, [eliminar, libro]);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:3030/api/users/userSession', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    console.error('Failed to fetch user data:', response);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchResults() {
            try {
                if (idVendedor) {
                    const response = await fetch(`http://localhost:3030/api/users/${idVendedor}`, {
                        method: 'GET',
                        credentials: 'include',
                    });
                    if (!response.ok) {
                        window.location.href = '/popUp/userNotFound';
                    }
                    const data = await response.json();
                    setUsuario(data);
                    if (user){
                        if (data._id === user._id) {
                            setPermisos(true);
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchResults();
    }, [idVendedor, user]);

    useEffect(() => {
        if (usuario && usuario.librosIds) {
            const fetchBooks = async () => {
                try {
                    const fetchedBooks = await Promise.all(
                        usuario.librosIds.map(async (idLibro) => {
                            const response = await fetch(`http://localhost:3030/api/books/${idLibro}`, {
                                method: 'GET',
                                credentials: 'include',
                            });
                            if (response.ok) {
                                return response.json();
                            } else {
                                console.log('Libro no encontrado');
                                return null;
                            }
                        })
                    );
                    const validBooks = fetchedBooks.filter(book => book !== null);
                    setLibrosUsuario(validBooks);
                } catch (error) {
                    console.error('Error fetching book data:', error);
                }
            };
            fetchBooks();
        }
    }, [usuario]);

    const confirmDelete = async () => {
        if (libroAEliminar) {
            try {
                const response = await fetch(`http://localhost:3030/api/books/${libroAEliminar}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                if (response.ok) {
                    // Actualiza el estado para eliminar el libro de la lista
                    setLibrosUsuario((prevBooks) => prevBooks.filter((libro) => libro._id !== libroAEliminar));
                    // Redirigir después de eliminar
                    window.history.pushState({}, '', `/usuarios/${idVendedor}`);
                } else {
                    console.error('Error al eliminar el libro');
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setDropdown(false);
                setLibroAEliminar(null);
            }
        }
    };

    return (
        <>
            <Header />
            {dropdown && (
                <>
                    <div className="dropdownBackground"></div>
                    <div className="success-container">
                        <h2>Eliminar libro</h2>
                        <p>¿Estás seguro de eliminar? Esta acción es irreversible</p>
                        <div>
                            <Link to={`/usuarios/${idVendedor}`}>
                                <button className="back-button">Cancelar</button>
                            </Link>
                            <button className="back-button eliminar" onClick={confirmDelete}>Eliminar</button>
                        </div>
                    </div>
                </>
            )}
            {usuario ? (
                <div className="card-container">
                    <img
                        src={usuario.fotoPerfil && usuario.fotoPerfil.trim() !== ''
                            ? `http://localhost:3030/uploads/${usuario.fotoPerfil}`
                            : 'http://localhost:3030/uploads/default.jpg'}
                        alt="Profile"
                        className="profile-image"
                    />
                    <div className="card-info">
                        <h1 className="name">{usuario.nombre}</h1>
                        <p>Libros publicados: {librosUsuario.length || 0}</p>
                        <p>Libros vendidos: {usuario?.librosVendidos || 0}</p>
                        <p>Estado de la cuenta: {usuario.estadoCuenta}</p>
                        <div>
                            {!permisos ? (
                                <>
                                    <Link to={`/mensajes?n=${usuario._id}`}><button className="compartir normal">Enviar mensaje</button></Link>
                                    <button className="compartir botonInverso">Compartir</button>
                                </>
                            ) : (
                                <Link to='/usuarios/editarUsuario'>
                                    <button className="compartir normal">Editar perfil</button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Cargando información del usuario...</p>
            )}

            <div className="postsContainer">
                {librosUsuario.map((libro, index) => (<>
                    {permisos ? makeUpdateCard(libro, index) : makeCard(libro, index)}                        
                    </>
                ))}
            </div>
            <Footer />
            <SideInfo />
        </>
    );
}
