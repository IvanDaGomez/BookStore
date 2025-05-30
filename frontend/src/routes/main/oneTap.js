import { useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import { BACKEND_URL } from '../../assets/config';

export default function useGoogleOneTap() {
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (window.google && !user) {
      window.google.accounts.id.initialize({
        client_id: '116098868999-7vlh6uf4e7c7ctsif1kl8nnsqvrk7831.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false,
      });
      // Delay showing the One Tap by 2 seconds
      
      setTimeout(() => {
        window.google.accounts.id.prompt();
      }, 2000);
    }
  }, [user]);

  const handleCredentialResponse = async (response) => {
    console.log("ID Token:", response.credential);
    const decodedToken = window.google.accounts.id.decodeJwt(response.credential);
    console.log("Decoded Token:", decodedToken);

    const userData = {
      nombre: decodedToken.name,
      correo: decodedToken.email,
      foto_perfil: decodedToken.picture
    };

    const url = `${BACKEND_URL}/api/users/google-login`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const result = await res.json();
      console.log("Server Response:", result);
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };
}