/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { cambiarEspacioAGuiones } from "../../assets/agregarMas";
import { reduceText } from "../../assets/reduceText";
import { renderProfilePhoto } from "../../assets/renderProfilePhoto";

export default function RenderResults ({ results}) {
  return (<>
  <div className='resultsContainer'>
    {results.slice(0, 4).map((result, index) => (
      <Link to={`/libros/${result.id}`} key={index}>
        <div className='result'>
          <img loading='lazy' src={renderProfilePhoto(result.images[0])} alt={result.titulo} className='result-photo' />
          <div className='result-info'>
            <div>
              <h2>{reduceText(result.titulo, 50)}</h2>
            </div>
            <Link
              to={`/buscar?q=${cambiarEspacioAGuiones(result.titulo)}`}
              rel='noopener noreferrer'
            >
              <div className='see-more'>Similares</div>
            </Link>
          </div>
        </div>
      </Link>
    ))}
  </div>
  </>)
}