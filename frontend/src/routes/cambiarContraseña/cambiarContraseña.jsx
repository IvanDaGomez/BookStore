import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function CambiarContraseña () {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [strengthLevel, setStrengthLevel] = useState(0) // Estado para el nivel de fortaleza

  // Calcular la fortaleza de la contraseña
  const calculateStrength = (password) => {
    let strength = 0

    if (password.length >= 8) strength++ // Longitud mínima
    if (/[A-Z]/.test(password)) strength++ // Mayúsculas
    if (/[a-z]/.test(password)) strength++ // Minúsculas
    if (/\d/.test(password)) strength++ // Números
    if (/[@$!%*?&.]/.test(password)) strength++ // Caracteres especiales

    setStrengthLevel(strength) // Actualizar el nivel
  }

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    calculateStrength(newPassword)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      setError('Por favor, completa todos los campos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (strengthLevel <= 3) {
      setError('La contraseña es demasiado débil')
      return
    }

    try {
      const response = await axios.post('http://localhost:3030/api/users/changePassword', {
        token,
        password
      }, { withCredentials: true })

      if (response.data.ok) {
        setSuccess(true)
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError('Error al cambiar la contraseña')
      }
    } catch (error) {
      console.error('Error al cambiar la contraseña:', error)
      setError(error.response?.data?.error || 'Ocurrió un error inesperado')
    }
  }

  return (
    <div className='verifyContainer cambiarContraseñaDiv'>
      <h1>Cambiar Contraseña</h1>
      <div className='imageDiv'>
        <img src='/contraCambiada.png' alt='' />
      </div>
      {!success && (
        <form onSubmit={handleSubmit} className='form'>
          <div className='input-field'>

            <input
              type='password'
              id='password'
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor='password'>Nueva Contraseña:</label>
          </div>

          <div className='input-field'>

            <input
              type='password'
              id='confirmPassword'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <label htmlFor='confirmPassword'>Confirmar Contraseña:</label>
          </div>
          <div className='strengthMeter'>
            <span>Fortaleza:</span>
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <div
                  className='strengthDiv'
                  key={index}
                  style={{
                    width: '20%',
                    height: '10px',
                    margin: '2px',
                    backgroundColor:
                                                strengthLevel > index
                                                  ? strengthLevel <= 2
                                                    ? 'red'
                                                    : strengthLevel <= 4
                                                      ? 'orange'
                                                      : 'green'
                                                  : '#e0e0e0'
                  }}
                />
              ))}
          </div>
          {error && <p className='error'>{error}</p>}

          <button type='submit'>Cambiar Contraseña</button>
        </form>
      )}
      {success && <><p className='success'>Contraseña cambiada exitosamente!</p><p>Serás redirigido automáticamente</p></>}
    </div>
  )
}
