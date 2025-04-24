import { GoogleOAuthProvider } from '@react-oauth/google'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ToastContainer } from 'react-toastify'
import GoogleLogin from './googleLogin'
import getLocation from '../../assets/getLocation'
import { LoginSocialFacebook } from 'reactjs-social-login'
import handleFacebookSubmit from './facebookLogin'
import Loader from '../cambiarContraseña/loader.jsx'
import '../cambiarContraseña/loader.css'
import { quotes } from './quotes.js'
import useUpdateBreakpoint from '../../assets/useUpdateBreakPoint.js'
import { desktopBreakpoint } from '../../assets/config.js'
import { validateErrors } from './validateLoginErrors.js'
import SubmitForm from './submitForm.jsx'

export default function Login () {
  const navigate = useNavigate()
  const [quote] = useState(quotes)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // Para registro
  const [name , setName] = useState('')
  const isMobile = useUpdateBreakpoint(desktopBreakpoint)
  const [isRegister, setIsRegister] = useState(false) // Estado para alternar entre login y signup
  const [loading, setLoading] = useState(false)

  const [errors, setErrors] = useState([])



  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = {
      name,
      email,
      password,
      confirmPassword
    }

    const validated = validateErrors(formData, isRegister, setErrors)
    if (!validated) {
      // Si hay errores, no continuar con el envíoz
      return
    }
    const domain = 'http://localhost:3030'
    const url = isRegister ? `${domain}/api/users` : `${domain}/api/users/login`
    const ubicacion = {}

    setLoading(true)

    if (isRegister) {
      const data = await getLocation()
      ubicacion.ciudad = data.ciudad
      ubicacion.pais = data.pais
      ubicacion.departamento = data.departamento
    }

    // Preparar los datos para enviar
    const sendData = {
      correo: email,
      contraseña: password,
      ...(isRegister && { nombre: name }),
      ...(isRegister && {
        ubicacion: {
          pais: ubicacion.pais,
          ciudad: ubicacion.ciudad,
          departamento: ubicacion.departamento
        }
      })
    }
    console.log('datos para enviar:', sendData)
    try {
      document.body.style.cursor = 'auto'
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendData),
        credentials: 'include'
      })

      const data = await response.json()

      setLoading(false)
      document.body.style.cursor = 'auto'
      if (data.error) {
        setErrors((prevErrors) => [...prevErrors, `Error: ${data.error}`])
        return
      }

      // Si la respuesta es exitosa, puedes manejar la respuesta aquí
      // En teoría el token se guarda en la cookie desde el backend
      // Si la respuesta es exitosa, puedes manejar la respuesta aquí

      if (isRegister || !data?.validated) {
        navigate('/verificar')
        return
      }
      // Si no hay una pagina anterior, redirigir a inicio, si si redirigir a la pagina que estaba
      if (!document.referrer || !document.referrer.includes(window.location.hostname)) {
        navigate('/')
        return
      }
      window.history.back()
    } catch (error) {
      console.error('Error al enviar la solicitud:', error)
      // También puedes agregar el error de catch a los errores
      setErrors((prevErrors) => [...prevErrors, 'Error de conexión: ' + error.message])
    }
  }
  const handleGoogleSubmit = async (userData) => {
    setLoading(true)
    // const { pais, ciudad, departamento } = await getLocation()
    // userData.ubicacion = {
    //   pais,
    //   ciudad,
    //   departamento
    // }

    document.body.style.cursor = 'wait'
    const url = 'http://localhost:3030/api/users/google-login'
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    })
    setLoading(false)
    if (!response.ok) {
      // Actualizar el estado de errores usando setErrors
      setErrors((prevErrors) => [...prevErrors, 'Error en el servidor: Intenta de Nuevo'])
      return // Salir de la función si hay un error
    }

    document.body.style.cursor = 'auto'
    // Si no hay una pagina anterior, redirigir a inicio, si si redirigir a la pagina que estaba
    if (!document.referrer || !document.referrer.includes(window.location.hostname)) {
      navigate('/')
      return
    }
    window.history.back()
  }



  return (
    <>
      {loading && <>
        <div className='opaqueBackground' />
        <div className='loader'><Loader /></div>
                  </>}
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
            {quote[Math.floor(Math.random() * quote.length)]}
          </h2>

          
          <SubmitForm 
            handleSubmit={handleSubmit}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            name={name}
            setName={setName}
            isRegister={isRegister}
            setIsRegister={setIsRegister}
            errors={errors}
            setErrors={setErrors}
          />
          <div className='alternativasLogin'>
            <GoogleOAuthProvider clientId='116098868999-7vlh6uf4e7c7ctsif1kl8nnsqvrk7831.apps.googleusercontent.com'>
              <GoogleLogin callback={handleGoogleSubmit} />
            </GoogleOAuthProvider>
            {/* Logo de Facebook */}
            <LoginSocialFacebook
              appId='2114886455594411'
              onResolve={res => handleFacebookSubmit(res, setErrors, setLoading)}
              onReject={(error) => console.error(error)}
            >
              <img loading='lazy' src='/facebook-logo.svg' alt='Facebook logo' title='Facebook logo' />
            </LoginSocialFacebook>

            {/* <div>{/*Logo de Amazon
            <img loading="lazy" src="/amazon-logo.svg" alt="Amazon logo" title='Amazon logo'/>
            </div> */}
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
