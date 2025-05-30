import axios from 'axios'
import { useState } from 'react'
import Loader from '../../components/loader/loader'
import { toast, ToastContainer } from 'react-toastify'
import { BACKEND_URL } from '../../assets/config'

export default function EnviarCorreoCambiarContraseña () {
  const [emailSent, setEmailSent] = useState(false)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  async function handleSubmitMail (e) {
    e.preventDefault()
    const { email } = e.target
    // verify email
    const emailValue = email.value

    // Expresión regular para validar un correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailValue)) {
      setErrors(['Por favor ingresa un correo electrónico válido'])
      return
    }

    // Simulación de éxito o llamadas API
    setErrors([])
    setLoading(true)
    try {
      const url = `${BACKEND_URL}/api/users/changePasswordEmail`
      const response = await axios.post(url, { email: email.value }, { withCredentials: true })

      if (response.data.error) {
        toast.error(response.data.error)
        return 
      } 
      setEmailSent(true)
      
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      {loading && <>
        <div className='opaqueBackground' />
        <div className='loader'><Loader /></div></>}
      <div className='verifyContainer cambiarContraseñaDiv'>
        {
        !emailSent
        ?
        <>
          <h1>¿Olvidaste tu contraseña?</h1>
          <p>Escribe tu correo electrónico y te enviaremos un enlace para cambiar tu contraseña.</p>
          <p>Si no recibes el correo, revisa tu bandeja de spam o correo no deseado.</p>
        </>
        :
        <h1>El correo se ha enviado exitosamente, revisa tu bandeja de entrada.</h1>
        }
        <div className='imageDiv'>
          <img src={
            !emailSent
            ?'/olvidasteContra.png'
            : '/correoEnviado.png'
          }
          alt='Imagen' />
        </div>

        <form onSubmit={handleSubmitMail} noValidate>
          <div className='input-field'>

            <input
            placeholder='Correo electrónico:'
              type='email'
              name='email'
              required
            />

          </div>
          
          <button type='submit'
          style={{width: 'auto'}}
          >{!emailSent ? 'Enviar' : 'Volver a enviar'}</button>
          {errors.length !== 0 && <div className='error'>{errors[0]}</div>}
        </form>

      </div>
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'/>
    </>
  )
}
