import { Link } from 'react-router-dom'
import './error.css'
export default function ErrorPage () {
  return (
    <>
      <div className='errorContainer'>
        <div>
        <img src="/404photo.png" alt="" />
        <div>
          <h1>404</h1>
          <h2>Parece que estás perdido</h2>
          <h2>La página que buscas no está disponible</h2>
          <Link to='/'><p>Volver a inicio</p></Link>
        </div>
        </div>
      </div>
    </>
  )
}
