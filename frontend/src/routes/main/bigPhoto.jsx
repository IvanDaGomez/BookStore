import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import './bigPhoto.css';
export default function BigPhoto () {
  const { user } = useContext(UserContext)
  return (<>
    <div className="bigPhoto">
      <div className="bigPhotoText">
        <h1>Todo el conocimiento en un solo lugar.</h1>
        <h2>Descubre tu siguiente libro favorito o vende los tuyos</h2>
        <div>
          {user ? <a href="/libros/crear"><button>Comienza a vender</button></a>
          : <a href="/login"><button>Inicia sesión</button></a>}
          <a href="/para-ti"><button className="btn btn-primary">Explora</button></a>
        </div>
      </div>
      <div className="bigPhotoImage">
        <img src="/bigImage.webp" alt="" />
      </div>
    </div>
  </>)
}