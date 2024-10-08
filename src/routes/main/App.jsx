
import Header from '../../components/header.jsx'
import Footer from '../../components/footer.jsx'
import { Link } from 'react-router-dom'
import SideInfo from '../../components/sideInfo.jsx'
import Sections from '../../components/sections.jsx'
import './App.css'

function App() {

  return (
    <>
      <Header/>
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
