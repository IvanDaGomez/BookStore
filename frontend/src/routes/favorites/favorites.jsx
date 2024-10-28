import { useState, useEffect } from "react";
import Header from "../../components/header";
import Footer from "../../components/footer";
import SideInfo from "../../components/sideInfo";
import { ToastContainer } from "react-toastify";
import { makeCard, makeSmallCard } from "../../assets/makeCard";
export default function Favorites(){

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
            }
            else window.location.href = '/popUp/noUser'
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUser(); // Llama a la función para obtener el usuario
}, []); // Dependencias vacías para ejecutar solo una vez al montar el componente

const [librosFavoritos, setLibrosFavoritos] = useState([]);

useEffect(() => {
    async function fetchLibrosFavoritos() {
        if (!user || !user.favoritos) return;

        try {
            const url = 'http://localhost:3030/api/books/';

            // Ejecutamos todas las peticiones en paralelo
            const promises = user.favoritos.map((favorito) =>
                fetch(url + favorito).then((res) => res.json())
            );

            // Esperamos a que todas las promesas se resuelvan
            const results = await Promise.all(promises);

            
            setLibrosFavoritos(results);
        } catch (error) {
            console.error('Error en el servidor:', error);
        }
    }

    fetchLibrosFavoritos();
}, [user]); // Se ejecuta cada vez que cambia el usuario

    return(<>
    <Header/>
    <div className="favoritesContainer">
        <h1>Mis favoritos</h1>
        <div className="postsContainer">
                    {librosFavoritos.map((libro, index) => (makeSmallCard(libro, index)))}
                </div>
    </div>
    <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            pauseOnHover={false}
            closeOnClick
            theme="light"
            />
    <Footer/>
    <SideInfo />
    </>)
}