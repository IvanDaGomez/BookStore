import { useState, useEffect } from "react";
export default function Mensajes(){

    const [user, setUser] = useState(null);
    const [mensajes, setMensajes ] = useState([])

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
                    setMensajes(data.user.mensajes)
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUser(); // Llama a la función para obtener el usuario
    }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente

    
    return(<>
    
    </>)
}