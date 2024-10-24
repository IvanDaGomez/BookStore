import { reduceText } from "./reduceText"
import { Link } from "react-router-dom";
const makeCard = (element, index) => {
    return (
      <Link style={{width:'100%', height:'100%'}} to={`${window.location.origin}/libros/${element._id}`}>
            <div className="sectionElement" key={index}>
                
                <div className="imageElementContainer"  style={{backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`}}>
                {(element.oferta) ? <div className="percentageElement">
                    { Math.ceil(((1 - element.oferta / element.precio) * 100).toFixed(2) / 5) * 5 + '% de descuento'}
                </div>:<div style={{padding:"calc(10px + 1rem)"}}></div>}
                    <div className="moreInfoElement">
                            <div className="fastInfoElement">
                                <span>Comprar</span>
                            </div>
                        <div className="extraInfoElement">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                                <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                                <path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div style={{padding:"5px 0"}}>
                <h2>{reduceText(element.titulo,33)}</h2>
                <h3>
                  {[element.autor && reduceText(element.autor, 30), 
                    element.genero && reduceText(element.genero, 15), 
                    element.estado]
                    .filter(Boolean) // Filtra los elementos que no son null/undefined/false
                    .join(" | ")}
                </h3>
                <div className="precioSections">{(element.oferta) ? <><h3 style={{display:"inline", marginRight:"10px"}}><s>${element.precio.toLocaleString('es-CO')}</s></h3><h2 style={{display:"inline"}}>${element.oferta.toLocaleString('es-CO')}</h2></>: <><h2 style={{textAlign:"center"}}>${element.precio.toLocaleString('es-CO')}</h2></>}
                </div>

                </div>
            </div>
            </Link>
    )
}

const makeOneFrCard = (element, index) => {
    return (
      <Link style={{width:'100%', height:'100%'}} to={`${window.location.origin}/libros/${element._id}`}>
      <div key={index} className="cardContainer" >
        
        {/* Imagen de los auriculares */}
        <div className="imageContainer" style={{ textAlign: 'center' }}>
          <img
            src={`http://localhost:3030/uploads/${element.images[0]}`}
            alt={element.titulo}
            
          />
        </div>
  
        {/* Nombre del producto */}
        <div className="infoContainer">
        <h2 className="productName" >
          {reduceText(element.titulo, 50)}
        </h2>
  
        {/* Estrellas de rating y número de reseñas 
        <div className="ratings">
          <span className="ratingsStars accent">★★★★☆</span>
          <span className="ratingsNumber">3,356</span>
        </div>*/}
  
        {/* Precio y oferta */}
        <div>
        <div className="precioSections">{(element.oferta) ? <><h2 style={{display:"inline"}}>${element.oferta.toLocaleString('es-CO')}</h2><h3 style={{display:"inline", marginLeft:"10px"}}><s>${element.precio.toLocaleString('es-CO')}</s></h3></>: <><h2>${element.precio.toLocaleString('es-CO')}</h2></>}
        </div>
        </div>
  
        <div className="details">
          <h2>{element.autor}</h2>
          <h2 style={{textAlign:'left'}}>{element.estado}</h2>
          <h2>{element.categoria}</h2>
        </div>


        <div className="soldBy" style={{ fontSize: '14px', color: '#555' }} >
          Vendido por <Link to={`/usuarios/${element.idVendedor}`}><span className="accent">{element.vendedor}</span></Link>
        </div>
  
        {/* Botón de agregar al carrito */}
        <button
          className="addToCartButton"
          
        >
          Agregar a favoritos
        </button>

        </div>
      </div>
      </Link>
    );
  };
  const makeUpdateCard = (element, index) => {
    
    return (
            <Link style={{width:'100%', height:'100%'}} to={`${window.location.origin}/libros/${element._id}`}>
            <div className="sectionElement" key={index}>
                
                <div className="imageElementContainer"  style={{backgroundImage: `url(http://localhost:3030/uploads/${element.images[0]})`}}>
                {(element.oferta) ? <div className="percentageElement">
                    { Math.ceil(((1 - element.oferta / element.precio) * 100).toFixed(2) / 5) * 5 + '% de descuento'}
                </div>:<div style={{padding:"calc(10px + 1rem)"}}></div>}
                    <div className="moreInfoElement">
                            <Link to={`/libros/crear?vendedor=${element.idVendedor}&libro=${element._id}`}>
                            <div className="fastInfoElement">
                                <span>Editar</span>
                            </div>
                            </Link> 
                            <Link to={`/usuarios/${element.idVendedor}?eliminar=y&libro=${element._id}`}>
                            <div className="fastInfoElement eliminar" style={{ background: 'white', border: '3px solid red', color: 'red'}}>
                                <span style={{fontWeight:'800'}}>Eliminar</span>
                            </div>
                            </Link>
                    </div>
                </div>
                <div style={{padding:"5px"}}>
                <h2 style={{textAlign: 'center'}}>{reduceText(element.titulo,33)}</h2>
                <h3>
                  {[element.autor && reduceText(element.autor, 30), 
                    element.genero && reduceText(element.genero, 15), 
                    element.estado]
                    .filter(Boolean) // Filtra los elementos que no son null/undefined/false
                    .join(" | ")}
                </h3>
                <div className="precioSections">{(element.oferta) ? <><h3 style={{display:"inline", marginRight:"10px"}}><s>${element.precio.toLocaleString('es-CO')}</s></h3><h2 style={{display:"inline"}}>${element.oferta.toLocaleString('es-CO')}</h2></>: <><h2 style={{textAlign:"center"}}>${element.precio.toLocaleString('es-CO')}</h2></>}
                </div>

                </div>
            </div>
            </Link>

    )
}
export { makeCard, makeOneFrCard, makeUpdateCard };