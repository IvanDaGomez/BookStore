import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../assets/config';

const GoogleOneTapLogin = () => {
  const handleLoginSuccess = async (data) => {
    try {
      // Fetch user info from Google API
      const userInfoResponse = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        { headers: { Authorization: `Bearer ${data.credential}` } }
      );

      const userData = {
        nombre: userInfoResponse.data.name,
        correo: userInfoResponse.data.email,
        fotoPerfil: userInfoResponse.data.picture
      };

      // Optional: Fetch location if needed
      // const { pais, ciudad, departamento } = await getLocation();
      // userData.ubicacion = { pais, ciudad, departamento };

      // Send user data to the backend
      const response = await axios.post(
        `${BACKEND_URL}/api/users/google-login`,
        userData,
        { withCredentials: true }
      );

      if (!response.data.success) {
        console.error('Failed to log in');
        return;
      }

      // Redirect to home or previous page
      window.location.href = '/';
    } catch (error) {
      console.error('Error fetching user info:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  const handleLoginFailure = () => {
    console.error('Google Login Error');
    toast.error('Falló la autenticación con Google. Por favor, inténtalo de nuevo.');
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={handleLoginFailure}
        useOneTap
      />
    </div>
  );
};

export default GoogleOneTapLogin;
