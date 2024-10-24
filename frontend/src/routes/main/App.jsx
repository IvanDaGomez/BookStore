
import Header from '../../components/header.jsx'
import Footer from '../../components/footer.jsx'
import { Link, useParams } from 'react-router-dom'
import SideInfo from '../../components/sideInfo.jsx'
import Sections from '../../components/sections.jsx'
import './App.css'
import { useState } from 'react'
import { useEffect } from 'react'

// eslint-disable-next-line react/prop-types
function App() {
  const [notification, setNotification] = useState('');
  const { info } = useParams();
  
  useEffect(() => {
    switch (info) {
      case 'exitoCreandoLibro':
        setNotification('success');
        break;
      case 'noUser':
        setNotification('No user')
        break;
      case 'userNotFound':
        setNotification('User not found');
        break;
      default:
        setNotification('');
        break;
    }
  }, [info]);

  const renderNotification = () => {
    if (notification === 'success'){ 
      return (<>
        <div className="dropdownBackground"></div>
        <div className="success-container">
          <h2>¡Publicación enviada con éxito!</h2>
          <p>Tu publicación será revisada para su lanzamiento.</p>
          <Link to="/">
            <button className="back-button">Volver</button>
          </Link>
        </div>
        </>
      );
    }
    if (notification === 'No user'){
      return(<>
        <div className="dropdownBackground"></div>
        <div className="success-container">
          <h2>No puedes hacer esto si no has iniciado sesión</h2>
          <p>Inicia sesión para poder publicar tu contenido o acceder a tu cuenta</p>
          <div>

          <Link to="/login">
            <button className="back-button">Iniciar Sesión</button>
          </Link>
          <Link to="/">
            <button className="back-button">Volver a Inicio</button>
          </Link>
          </div>
        </div>
        </>)
    }
    if (notification === 'User not found'){
      return(<>
        <div className="dropdownBackground"></div>
        <div className="success-container">
          <h2>No se ha encontrado el usuario</h2>
          
          <div>

          <Link to="/">
            <button className="back-button">Volver a Inicio</button>
          </Link>
          </div>
        </div>
        </>)
    }
    document.documentElement.style.overflowY = 'scroll'
    return null; // En caso de no haber notificación
  };

  return (
    <>
      {renderNotification()}
      <Header />
      
      <div className="IntroDiv">
        <div>
          <h2>El mejor lugar para vender y comprar tus libros favoritos</h2>
          <p>Nutre tu conocimiento con los libros que quieras</p>
          <Link to="/search" style={{width:"auto"}}><button className='boton'>Comienza Ahora</button></Link>
        </div>      
      </div>
      <Sections filter={"Nuevo"} backgroundColor={"#00ff00"}/>
      <Sections filter={"Para ti"} />
      <SideInfo/>
      {/*<ChatBot/>*/}
      <Footer/>
    </>
  )
}

export default App
