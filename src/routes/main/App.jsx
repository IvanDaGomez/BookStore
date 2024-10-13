
import Header from '../../components/header.jsx'
import Footer from '../../components/footer.jsx'
import { Link } from 'react-router-dom'
import SideInfo from '../../components/sideInfo.jsx'
import Sections from '../../components/sections.jsx'
import './App.css'

// eslint-disable-next-line react/prop-types
function App({notification=""}) {


  return (
    <>
      <Header />
      {notification && (
        <div className="success-container">
          <h2>¡Publicación enviada con éxito!</h2>
          <p>Tu publicación será revisada para su lanzamiento.</p>
          <Link to="/">
          <button className="back-button">
            Volver
          </button>
          </Link>
        </div>
      )}
      <div className="IntroDiv">
        <div>
          <h2>El mejor lugar para vender y comprar tus libros favoritos</h2>
          <p>Nutre tu conocimiento con los libros que quieras</p>
          <Link to="/search" style={{width:"auto"}}><button className='boton'>Comienza Ahora</button></Link>
        </div>      
      </div>
      <Sections filter={"Novedades"} backgroundColor={"#00ff00"}/>
      <Sections filter={"Para ti"} />
      <SideInfo/>
      {/*<ChatBot/>*/}
      <Footer/>
    </>
  )
}

export default App
