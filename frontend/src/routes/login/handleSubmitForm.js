import axios from "axios"
import { validateErrors } from "./validateLoginErrors"
import getLocation from "../../assets/getLocation"
import { BACKEND_URL } from "../../assets/config"

export const handleSubmit = async ({
  e,
  isRegister,
  email,
  password,
  confirmPassword,
  name,
  setErrors,
  setLoading
}) => {
  e.preventDefault()

  const formData = {
    name,
    email,
    password,
    confirmPassword
  }

  const validated = validateErrors(formData, isRegister, setErrors)
  if (!validated) {
    // Si hay errores, no continuar con el envío
    return
  }
  const domain = BACKEND_URL || window.location.origin
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
  try {
    document.body.style.cursor = 'auto'
    const response = await axios.post(url, sendData, {
      withCredentials: true,
      headers: {
      'track': 'true'
      }
    })


    setLoading(false)
    document.body.style.cursor = 'auto'
    if (response.data.error) {
      setErrors((prevErrors) => [...prevErrors, `Error: ${response.data.error}`])
      return
    }

    // Si la respuesta es exitosa, puedes manejar la respuesta aquí
    // En teoría el token se guarda en la cookie desde el backend
    // Si la respuesta es exitosa, puedes manejar la respuesta aquí

    if (isRegister || !response.data?.validated) {
      window.location.href = '/verificar'
      return
    }
    // Si no hay una pagina anterior, redirigir a inicio, si si redirigir a la pagina que estaba
    if (!document.referrer || !document.referrer.includes(window.location.hostname)) {
      window.location.href = '/'
      return
    }
    window.history.back()
  } catch (error) {
    console.error('Error al enviar la solicitud:', error)
    // También puedes agregar el error de catch a los errores
    setErrors((prevErrors) => [...prevErrors, 'Error de conexión: ' + error.data])
  }
}