import { BACKEND_URL } from "../../assets/config"

export default async function handleFacebookSubmit (response, setErrors, setLoading) {
  try {
    const userData = {
      nombre: response.data.name,
      correo: response.data.email,
      foto_perfil: response.data.picture.data.url
    }
    setLoading(true)
    const url = `${BACKEND_URL}/api/users/facebook-login`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    })
  
    setLoading(false)
    if (!res.ok) {
      // Actualizar el estado de errores usando setErrors
      setErrors((prevErrors) => [...prevErrors, 'Error en el servidor: Intenta de Nuevo'])
      return // Salir de la función si hay un error
    }
  
    // Si no hay una pagina anterior, redirigir a inicio, si si redirigir a la pagina que estaba
    window.location.href = document.referrer || '/'
  } catch (error) {
    setLoading(false)
    document.body.style.cursor = 'auto'
    console.error('Error al enviar la solicitud:', error)
    // También puedes agregar el error de catch a los errores
    setErrors((prevErrors) => [...prevErrors, 'Error de conexión: ' + error.message])
  }
}
