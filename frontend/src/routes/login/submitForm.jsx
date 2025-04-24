import { useState } from "react"

/* eslint-disable react/prop-types */
export default function SubmitForm({ handleSubmit, isRegister, errors, setErrors, setLoading}) { 
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('') // Para registro
  const [name , setName] = useState('')
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
  const strengthColor = (index) => {
    if (strengthLevel > 0 && index < strengthLevel) {
      if (strengthLevel <= 2) {
        return 'red'
      }
      if (strengthLevel <= 4) {
        return 'orange'
      }
      return 'green'
    }
    return '#e0e0e0'
  }

  return(<>

  <form onSubmit={(e) => handleSubmit({
      e,
      isRegister,
      email,
      password,
      confirmPassword,
      name,
      setErrors,
      setLoading
  })} noValidate>
            {isRegister && (<div className='input-group'>
              <label>Nombre</label>
              <input
                type='text'
                name='nombre'
                autoComplete="name"
                placeholder='Ingresa tu nombre'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>)}
            <div className='input-group'>
              <label>Correo</label>
              <input
                type='email'
                name='email'
                autoComplete="email"
                placeholder='Ingresa tu correo'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='input-group'>
              <label>Contraseña</label>
              <input
                type='password'
                name='password'
                autoComplete="current-password"
                placeholder='Ingresa tu contraseña'
                value={password}
                onChange={(e) => {
                  calculateStrength(e.target.value)
                  setPassword(e.target.value)
                }}
                required
              />
            </div>
            {isRegister && (
              <div className='input-group'>
                <label>Confirma tu contraseña</label>
                <input
                  type='password'
                  name='passwordConfirm'
                  placeholder='Confirma tu contraseña'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {isRegister && (<div className='strengthMeter'>
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
                      backgroundColor: strengthColor(index)
                    }}
                  />
                ))}
            </div>)}
            {isRegister && <div className='aceptoTerminos'>
              <input type='checkbox' />
              <span>Acepto los <a href='/terminos-y-condiciones' target='_blank'> términos y condiciones</a></span>
            </div>}
            <button type='submit' className='login-button'>
              {isRegister ? 'Registro' : 'Inicio de sesión'}
            </button>
          </form>
          {(errors.length != 0)
            ? <div className='error'>
              {errors[0]}
            </div>
            : <></>}
  </>)
}