import {  useEffect } from "react";

export default function useFetchUser(url) {

useEffect(() => {
    async function fetchUser() {
        try {
            const response = await fetch(url, {
                method: 'POST',
                credentials: 'include',  // Asegúrate de enviar las cookies
            });

            if (response.ok) {
                const data = await response.json();
                return data.user
            } else {
                console.error('Failed to fetch user data:', response);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUser(); // Llama a la función para obtener el usuario
}, [url]); // Dependencias vacías para ejecutar solo una vez al montar el componente
}