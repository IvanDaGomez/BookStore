export const validateErrors = (formData, isRegister, setErrors, strengthLevel) => {
  const { name, email, password, confirmPassword } = formData
  const errorMessages = [] // Array para almacenar mensajes de error

  // Verificar campos vacíos
  if (!email) errorMessages.push('El correo es obligatorio.')
  if (!password) errorMessages.push('La contraseña es obligatoria.')

  // Validar formato de correo electrónico
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (email && !emailPattern.test(email)) {
    errorMessages.push('El correo no tiene un formato válido.')
  }

  // Validar longitud de la contraseña
  if (password && password.length < 8) {
    errorMessages.push('La contraseña debe tener al menos 8 caracteres.')
  }

  // Verificar coincidencia de contraseñas (solo para registro)
  if (isRegister && password !== confirmPassword) {
    errorMessages.push('Las contraseñas no coinciden.')
  }
  if (isRegister && !name) {
    errorMessages.push('El nombre es requerido')
  }
  if (isRegister && !document.querySelector('.aceptoTerminos input').checked) {
    setErrors((prevErrors) => [...prevErrors, 'Necesitas aceptar los términos y condiciones'])
    return
  } else {
    // If the condition is not met, remove the error if it exists
    setErrors((prevErrors) => prevErrors.filter(error => error !== 'Necesitas aceptar los términos y condiciones'))
  }
  if (isRegister && strengthLevel <= 3) {
    setErrors((prevErrors) => [...prevErrors, 'La contraseña es demasiado débil'])
    return
  }
  // Actualizar estado de errores
  setErrors(errorMessages)
  return errorMessages.length === 0 // Retornar verdadero si no hay errores
}