import { Link } from "react-router-dom"
export const renderNotification = (notification) => {
if (notification === 'exitoCreandoLibro') {
    return (
    <>
        <div className='dropdownBackground' />
        <div className='success-container'>
        <h2>¡Publicación enviada con éxito!</h2>
        <p>Tu publicación será revisada para su lanzamiento.</p>
        <div className="button-container">
            <Link to='/libros/crear'>
                <button className='back-button'>Crear otro libro</button>
            </Link>
            <Link to='/'>
                <button className='back-button'>Volver</button>
            </Link>
        </div>
        </div>
    </>
    )
}
if (notification === 'noUser') {
    return (
    <>
        <div className='dropdownBackground' />
        <div className='success-container'>
        <h2>No puedes hacer esto si no has iniciado sesión</h2>
        <p>Inicia sesión para poder publicar tu contenido o acceder a tu cuenta</p>
        <div className="button-container">

            <Link to='/login'>
            <button className='back-button'>Iniciar Sesión</button>
            </Link>
            <Link to='/'>
            <button className='back-button'>Volver a Inicio</button>
            </Link>
        </div>
        </div>
    </>
    )
}
if (notification === 'noAdmin') {
    return (
    <>
        <div className='dropdownBackground' />
        <div className='success-container'>
        <h2>No tienes permisos para hacer esto</h2>
        <p>Inicia sesión como administrador para poder acceder a esta sección</p>
        <div className="button-container">

            <Link to='/login'>
            <button className='back-button'>Iniciar Sesión</button>
            </Link>
            <Link to='/'>
            <button className='back-button'>Volver a Inicio</button>
            </Link>
        </div>
        </div>
    </>
    )
}
if (notification === 'banned') {
    return (
    <>
        <div className='dropdownBackground' />
        <div className='success-container'>
        <p>Tu cuenta ha sido bloqueada por un administrador</p>
        <p>Si crees que esto es un error, por favor <a href="mailto:meridian@gmail.com">contacta</a> a un administrador</p>
        <div className="button-container">
            <Link to='/login'>
            <button className='back-button'>Iniciar Sesión con otra cuenta</button>
            </Link>
        </div>
        </div>
    </>
    )
}
if (notification === 'usuarioNoEncontrado') {
    return (
    <>
        <div className='dropdownBackground' />
        <div className='success-container'>
        <h2>No se ha encontrado el usuario</h2>

        <div>

            <Link to='/'>
            <button className='back-button'>Volver a Inicio</button>
            </Link>
        </div>
        </div>
    </>
    )
}
if (notification === 'libroNoEncontrado') {
    return (
    <>
        <div className='dropdownBackground' />
        <div className='success-container'>
        <h2>No se encontró el libro</h2>

        <div>

            <Link to='/'>
            <button className='back-button'>Volver</button>
            </Link>
        </div>
        </div>
    </>
    )
}
document.documentElement.style.overflowY = 'scroll'
return null // En caso de no haber notificación
}