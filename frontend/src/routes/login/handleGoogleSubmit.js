export const handleGoogleSubmit = async ({
  userData,
  setLoading,
  setErrors
}) => {
    try {
      setLoading(true)
    
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
  
      window.location.href = document.referrer || '/'
    } catch (error) {
      setLoading(false)
      document.body.style.cursor = 'auto'
      console.error('Error al enviar la solicitud:', error)
      // También puedes agregar el error de catch a los errores
      setErrors((prevErrors) => [...prevErrors, 'Error de conexión: ' + error.message])
      
    }
  }