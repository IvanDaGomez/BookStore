/* eslint-disable react/prop-types */
import axios from 'axios'
import { useEffect, useState } from 'react'

export default function Verificar ({ user, token }) {
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)
  const [counter, setCounter] = useState(5)

  useEffect(() => {
    async function validateUser () {
      const countdown = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            window.location.href = '/'
            return 0
          }
          return prev - 1
        })
      }, 1000)
      if (!token || user?.validated) {
        setVerifying(false)
        return
      }

      try {
        const url = `http://localhost:3030/api/users/validateUser/${token}`
        const response = await axios.get(url, { withCredentials: true })
        if (response.data.error) {
          return
        }
        if (response?.data?.verified || response?.data?.status) {
          setVerified(true)
          // Iniciar el contador y redirección después de verificar
        }
      } catch (error) {
        console.error('Error validating user:', error)
      } finally {
        setVerifying(false)
      }
    }

    validateUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return (
    <div className='verifyContainer'>
      <h1>Estado de Cuenta</h1>
      {verifying
        ? (
          <div className='verifying'>
            <p>Verificando tu cuenta... Por favor espera.</p>
          </div>
          )
        : (
          <>
            <div className='imageDiv'>
              <img src='/verifiedPhoto.jpg' alt='' />
            </div>
            <h2>
              {verified || user?.validated
                ? 'Cuenta verificada'
                : 'Cuenta no verificada'}

            </h2>
            <div style={{ width: 'auto' }}>
              <a href='/'><button>Regresar a inicio</button></a>

              <p>Serás redirigido a inicio en {counter > 0 ? counter : 0} segundos</p>

            </div>
          </>
          )}
    </div>
  )
}
