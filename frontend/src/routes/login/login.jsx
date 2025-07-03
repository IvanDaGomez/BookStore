import { GoogleOAuthProvider } from '@react-oauth/google'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import GoogleLogin from './googleLogin'
import { LoginSocialFacebook } from 'reactjs-social-login'
import handleFacebookSubmit from './facebookLogin'
import { quotes } from './quotes.js'
import useUpdateBreakpoint from '../../assets/useUpdateBreakPoint.js'
import { desktopBreakpoint } from '../../assets/config.js'
import SubmitForm from './submitForm.jsx'
import { handleGoogleSubmit } from './handleGoogleSubmit.js'
import { handleSubmit } from './handleSubmitForm.js'
import './login.css'
import Loader from '../../components/loader/loader.jsx'
export default function Login () {

  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)])
  const isMobile = useUpdateBreakpoint(desktopBreakpoint)
  const [isRegister, setIsRegister] = useState(false) // Estado para alternar entre login y signup
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])

  useEffect(() => {
    if (loading) {
      setTimeout(()=>setLoading(false), 5000)
    }
  }, [loading])

  return (
    <>
      {loading && <>
        <div className='opaqueBackground' />
        <div className='loader'><Loader /></div></>}
      <div
        className='login-container'
        style={{
          backgroundImage: isMobile ? "url('/drawing.svg')" : 'none',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr'
        }}
      >
        <div className='login-form'>
          <h1>{isRegister ? 'Crea una cuenta' : 'Bienvenido de vuelta'}</h1>
          <h2>
            {quote}
          </h2>

          
          <SubmitForm 
            handleSubmit={handleSubmit}
            isRegister={isRegister}
            errors={errors}
            setErrors={setErrors}
            setLoading={setLoading}
          />
          <div className='alternativasLogin'>
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLogin callback={(userData) =>handleGoogleSubmit({ userData, setLoading, setErrors })} />
            </GoogleOAuthProvider>
            {/* Logo de Facebook */}
            <LoginSocialFacebook
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              onResolve={res => handleFacebookSubmit(res, setErrors, setLoading)}
              onReject={(error) => console.error(error)}
            >
              <img loading='lazy' src='/facebook-logo.svg' alt='Facebook logo' title='Facebook logo' />
            </LoginSocialFacebook>
          </div>
          {!isRegister && (
            <div className='forgot-password'>
              <a href='/opciones/olvido-contraseña'>¿Olvidaste tu contraseña?</a>
            </div>
          )}
          <div className='register-link'>
            <span>{isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}</span>
            <a onClick={() => setIsRegister(!isRegister)}>
              <span style={{ cursor: 'pointer' }}>{isRegister ? 'Inicio de sesión' : 'Registro'}</span>
            </a>
          </div>
        </div>
        {!isMobile && <img loading='lazy' src='/drawing.svg' className='drawing' />}

      </div>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
    </>
  )
}
