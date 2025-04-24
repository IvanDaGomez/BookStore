export const handleGoogleSubmit = async ({
  userData,
  setLoading,
  setErrors,
  navigate
}) => {
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