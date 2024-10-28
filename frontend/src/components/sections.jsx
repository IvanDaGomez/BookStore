import { useEffect, useState } from "react"
import { makeCard } from "../assets/makeCard";
import { cambiarEspacioAGuiones } from "../assets/agregarMas";

// eslint-disable-next-line react/prop-types
export default function Sections({ filter, backgroundColor }){
    /*const [elementSections, setElementSections] = useState()
    useEffect(() => {
        async function fetchData(){
            //www.domainetc/api/filter
            const domainName = "https://localhost:3030"
            const data = await fetch(`${domainName} + /api/filter?filter=${filter}&limit=4`)
            setElementSections(data)
        }
        fetchData()
    }, [filter])*/
    const [user, setUser] = useState({});

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

        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUser(); // Llama a la función para obtener el usuario
}, []); // Dependencias vacías para ejecutar solo una vez al montar el componente


    const [libros, setLibros] = useState([])
    useEffect(()=>{
        const fetchResults = async () => {
            try {
                
                const response = await fetch(`http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(filter)}&l=6`, {
                    method: 'GET',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                
                const info = await response.json(); 
                
                
                if (info !== undefined) {
                    setLibros(info);
                }
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };
    
        fetchResults()
        
    },[filter])
    
        // Aplicar la clase "favoritoActivo" después de renderizar las tarjetas
    useEffect(() => {
        if (user && user.favoritos) {
            user.favoritos.forEach((favoritoId) => {
                const favorites = document.querySelectorAll(`.favorito-${favoritoId}`);
                favorites.forEach((element) => element.classList.add('favoritoActivo'));
            });
        }
    }, [user, libros]); // Se ejecuta cada vez que se actualizan user o libros
    return(  <>
        <div style={{backgroundColor: {backgroundColor}, width:"auto", height:"auto"}}>


        <h1 style={{margin:"0 40px", textAlign:"left"}}>{filter}</h1>
        <div className="sectionsContainer">
            
            {user && libros.slice(0,6).map((element, index) => makeCard(element, index, user._id))}
        </div>
        </div>
        </>)
}