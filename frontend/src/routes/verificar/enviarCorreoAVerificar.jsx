import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Verificar from './verificar'
import { toast, ToastContainer } from 'react-toastify'

export default function EnviarCorreoAVerificar () {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [sending, setSending] = useState(true)
  const [code, setCode] = useState(null)
  const [token, setToken] = useState(null)
  const [errors, setErrors] = useState('')
  const [verifying, setVerifying] = useState(true)
  const [inputCode, setInputCode] = useState(new Array(6).fill('')) // Estado para almacenar el código ingresado
  const inputRefs = useRef([]) // Referencias a los inputs

  // Fetch user session
  useEffect(() => {
    async function fetchUser () {
      try {
        const url = 'http://localhost:3030/api/users/userSession'
        const response = await axios.post(url, null, {
          withCredentials: true
        })
        if (response.data.validated) {
          setVerifying(false)
        }
        setUser(response.data)
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/popUp/noUser')
      }
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch user email if not already set
  useEffect(() => {
    if (!user || user?.correo) return

    async function fetchUserEmail () {
      try {
        const response = await axios.get(
          `http://localhost:3030/api/users/c/${user.id}`,
          {
            withCredentials: true // Ensures cookies are sent with the request
          }
        )

        if (response.status === 200 && response.data) {
          setUser({
            ...user,
            correo: response.data.correo
          })
        }
      } catch (error) {
        console.error('Error fetching user email:', error)
      }
    }

    fetchUserEmail()
  }, [user])
  const [fetching, setFetching] = useState(false)
  async function sendVerifyEmail () {
    if (!user || !user?.correo || user.validated || fetching) return
    setFetching(true)
    try {
      const url = 'http://localhost:3030/api/users/sendValidationEmail'
      const body = {
        correo: user.correo,
        nombre: user.nombre,
        id: user.id
      }

      const response = await axios.post(url, body, { withCredentials: true })
      if (response.data.ok) {
        setSending(false)
        setCode(response.data.code)
        setToken(response.data.token)
      }
    } catch (error) {
      console.error('Error en el servidor:', error)
    }
  }

  // Send verification email
  useEffect(() => {
    sendVerifyEmail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Manejar cambio de inputs
  const handleInputChange = (e, index) => {
    const value = e.target.value
    if (!/^\d?$/.test(value)) return // Solo aceptar dígitos

    const newInputCode = [...inputCode]
    newInputCode[index] = value
    setInputCode(newInputCode)

    // Mover foco al siguiente input
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Manejar navegación con flechas
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !inputCode[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus()
    } else if (e.key === 'ArrowRight' && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Verificar código ingresado
  function verifyCode () {
    if (!token) {
      setErrors('Token no válido. Por favor, intenta de nuevo.')
      return
    }
    const completeInputCode = parseInt(inputCode.join('')) // Combinar código ingresado
    if (code !== completeInputCode) {
      setErrors('El código no coincide.')
      return
    }
    setVerifying(false)
  }

  return (
    <>
      <div className='verifyContainer'>
        {verifying ? (
          <>
            <h1>Verificación</h1>
            {sending ? (<>
              <div className='imageDiv'>
                <img src='/mailAnimation.gif' alt='' />
              </div>
              <p>Enviando correo...</p>
            </>
            ) : (
              <>
                <p>Se ha enviado un correo de verificación a:</p>
                <p>{user && user?.correo}</p>

                <div className='imageDiv'>
                  <img src='/imagenEmail.jpg' alt='' />
                </div>
                <div className='inputContainer'>
                  {inputCode.map((_, index) => (
                    <input
                      type='number'
                      className='codeInput'
                      key={index}
                      maxLength={1} // Permitir solo un carácter
                      ref={(el) => (inputRefs.current[index] = el)} // Guardar referencia al input
                      value={inputCode[index]}
                      onChange={(e) => handleInputChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                    />
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '2.3rem' }}>Si no recibiste el correo</p>
                  <a onClick={() => {
                    sendVerifyEmail()
                    toast.success('Código enviado exitosamente')
                  }}
                  >Volver a enviar código
                  </a>
                </div>
                <button onClick={verifyCode}>Verificar</button>
                {errors && <p className='error'>{errors}</p>}
              </>
            )}
          </>
        ) : (
          user && <Verificar user={user} token={token} />
        )}
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
