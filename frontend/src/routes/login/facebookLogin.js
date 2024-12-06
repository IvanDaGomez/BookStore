
export default async function handleFacebookSubmit(response, setErrors, setLoading) {
    
    const userData = {
        nombre: response.data.name,
        correo: response.data.email,
        fotoPerfil: response.data.picture.data.url
    }
    setLoading(true)
    const url = 'http://localhost:3030/api/users/facebook-login'
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'include'
    })

    
    if (!res.ok) {
        // Actualizar el estado de errores usando setErrors
        setErrors((prevErrors) => [...prevErrors, 'Error en el servidor: Intenta de Nuevo']);
        return; // Salir de la función si hay un error
      }

    setLoading(false)
    // Si no hay una pagina anterior, redirigir a inicio, si si redirigir a la pagina que estaba
    if (!document.referrer || !document.referrer.includes(window.location.hostname)){
      window.location.href = '/'
      return
    }
    window.history.back()


}
