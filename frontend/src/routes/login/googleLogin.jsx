/* eslint-disable react/prop-types */
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'

export default function GoogleLogin ({ callback }) {
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (data) => {
      try {
        // Use the access_token to fetch the user's profile info
        const userInfoResponse = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${data.access_token}` } }
        )

        // Pass the user data to the callback
        const userData = {
          nombre: userInfoResponse.data.name,
          correo: userInfoResponse.data.email,
          foto_perfil: userInfoResponse.data.picture
        }
        callback(userData)
      } catch (error) {
        console.error('Error fetching user info:', error)
      }
    },
    onError: (error) => console.error('Google Login Error:', error)
  })

  return (
    <div onClick={handleGoogleLogin}>
      <img
        loading='lazy'
        src='/google-logo.svg'
        alt='Google logo'
        title='Google logo'
      />
    </div>
  )
}
