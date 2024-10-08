import { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { reduceText } from "../assets/reduceText";
import { cambiarEspacioAGuiones } from "../assets/agregarMas";

export default function Header() {
    const user = false;
    /*
        const abrirMenu = () => {
            let menu = document.querySelector(".inhamburger");
            let x = document.querySelector(".cerrar");
            let hamburguer = document.querySelector(".abrir");
            if (menu.style.display === "none" || menu.style.display === "") {
                x.style.display = "block";
                hamburguer.style.display = "none";
                menu.style.display = "flex";
                menu.style.height = "0px";
                menu.style.animationName = "agrandar";
                menu.style.animationPlayState = "running";
                menu.addEventListener("animationend", function handler() {
                    menu.style.animationPlayState = "paused";
                    menu.style.height = "calc(60vh + 7px)";
                    menu.removeEventListener("animationend", handler);
                });
            } else {
                x.style.display = "none";
                hamburguer.style.display = "block";
                menu.style.animationName = "reducir";
                menu.style.animationPlayState = "running";
                menu.addEventListener("animationend", function handler() {
                    menu.style.display = "none";
                    menu.style.height = "0px";
                    menu.removeEventListener("animationend", handler);
                });
            }
        };
    */
    
    // This state manages an array of information
    const [arrayInfo, setArrayInfo] = useState(null);

// Fetches extra information when hovering over a menu item
const openExtraInfo = async (str) => {
    try {
        const response = await fetch("/extraInfo.json");
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        
        const info = await response.json(); 
        
        if (info[str] !== undefined) {
            setArrayInfo(info[str]);
        } else {
            console.warn(`Key "${str}" not found in the fetched data.`);
        }
    } catch (error) {
        console.error("Fetch error:", error);
    }
};

    // Managing input ref for search and handling search input
    const queryInput = useRef(null);
    const [results, setResults] = useState([]);
    
    function handleSearchInput() {
        if (!queryInput.current.value) { 
            setResults([]); 
            return;
        }

        // Example of static results for the search
        setResults([
            {
                name: "Harry Potter y la Cámara Secreta",
                brand: "Warner Bros",
                price: 100000,  // en pesos colombianos
                salePrice: 80000,  // en pesos colombianos
                image: "https://via.placeholder.com/150",
                keywords: ["fantasía", "Harry Potter", "J.K. Rowling"],
                id: "a1b2c3d4-e5f6-7g8h-9i10-j11k12l13m14" // generated id
            },
            {
                name: "Harry Potter y la Cámara Secreta",
                brand: "Warner Bros",
                price: 100000,  // en pesos colombianos
                salePrice: 80000,  // en pesos colombianos
                image: "https://via.placeholder.com/150",
                keywords: ["fantasía", "Harry Potter", "J.K. Rowling"],
                id: "b2c3d4e5-f6g7-h8i9-1011-j12k13l14m15" // generated id
            },
            {
                name: "Harry Potter y la Cámara Secreta",
                brand: "Warner Bros",
                price: 100000,  // en pesos colombianos
                salePrice: 80000,  // en pesos colombianos
                image: "https://via.placeholder.com/150",
                keywords: ["fantasía", "Harry Potter", "J.K. Rowling"],
                id: "c3d4e5f6-g7h8-i910-1112-k13l14m15n16" // generated id
            },
            {
                name: "One Piece Vol. 124",
                brand: "Shueisha",
                price: 20000,  // en pesos colombianos
                salePrice: 18000,  // en pesos colombianos
                image: "https://images.cdn3.buscalibre.com/fit-in/360x360/7c/7f/7c7f5d38d2494aa32cec08859e76eadf.jpg",
                keywords: ["manga", "anime", "One Piece"],
                id: "d4e5f6g7-h8i9-1011-1213-l14m15n16o17" // generated id
            },
            {
                name: "Cien años de soledad",
                brand: "Editorial Sudamericana",
                price: 35000,  // en pesos colombianos
                salePrice: 32000,  // en pesos colombianos
                image: "https://via.placeholder.com/150",
                keywords: ["literatura", "Gabriel García Márquez", "realismo mágico"],
                id: "e5f6g7h8-i910-1112-1314-m15n16o17p18" // generated id
            },
            {
                name: "El nombre del viento",
                brand: "DAW Books",
                price: 45000,  // en pesos colombianos
                salePrice: 40000,  // en pesos colombianos
                image: "https://via.placeholder.com/150",
                keywords: ["fantasía", "Patrick Rothfuss", "aventura"],
                id: "f6g7h8i9-1011-1213-1415-n16o17p18q19" // generated id
            }
        ]);
    }

    // Submits the input value when the search button is clicked
    function submitInputValue() {
        if (!queryInput.current.value) return;
        window.location.href = `${window.location.origin}/buscar?q=${cambiarEspacioAGuiones(queryInput.current.value)}`;
        queryInput.current.value = "";
    }

    // Funcionalidad del perfil
    const [profile, setProfile] = useState(false)


    const profileContainer = useRef(null);

    // Function to adjust the `top` position of profileContainer
    function adjustTopProfile() {
        //50 de AntesHeader + 90 de el header
        let top;
        if (window.scrollY > 50) {
            top =  90 +"px";
            profileContainer.current.style.top = top
            
            return top
        }
        top = 140 - window.scrollY + "px";
        profileContainer.current.style.top = top;
        return top
    }
  
    // useEffect to listen for the scroll event
    useEffect(() => {
      const handleScroll = () => {  
        adjustTopProfile();
      };
      
      if (profile) adjustTopProfile()
      window.addEventListener('scroll', handleScroll);
      
      // Clean up event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, [profile]);

    const openProfile = () => {
        
        setProfile(!profile)
        if(profile){
            adjustTopProfile()
        }
    }
    return (
        <>
            <div className="antesHeader" style={{ color: "#000000" }}>
                <h1>Descubre nuestras ofertas</h1>
            </div>
            <header>
                <div>
                <div className="headerIzq">
                    <Link to="/"><img loading="lazy" src="/logo.png" alt="" /></Link>
                </div>

                <div className="indice headerCen desaparecer">
                    <Link to="/"><p>Inicio</p></Link>
                    <p  onMouseOver={() => openExtraInfo("Libros")} >Libros</p>
                    <p onMouseOver={() => openExtraInfo("Autores")} >Autores</p>
                    <p>Contacto</p>
                </div>
                </div>
                <div style={{display:"flex", justifyContent:"center"}}>
                <div className="headerDer">
                    <div className="input">
                    <input 
                    type="text" 
                    ref={queryInput} 
                    name="query" 
                    autoComplete="off"  
                    className="search" 
                    placeholder="Buscar" 
                    onChange={handleSearchInput}
                    onKeyDown={(event)=> (event.key==="Enter") ? submitInputValue() : <></>}
                    /> 
                    <button type="submit" className="icon" onClick={submitInputValue}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} fill={"none"}>
                            <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    
                    </button>
                    </div>
                    <div className="resultsContainer" style={{}}>
                    {results.slice(0,4).map((result, index) => (
                        <div className="result" key={index} onClick={()=> window.location.href = `${window.location.origin}/libros/${result.id}`}>
                            <img loading="lazy" src={result.image} alt={result.name} className="result-photo" />
                            <div className="result-info">
                            <h3>{reduceText(result.name,30)}</h3>
                            <a 
                                href={`${window.location.origin}/buscar?q=${cambiarEspacioAGuiones(result.name)}`} 
                                rel="noopener noreferrer"
                            >
                            <div className="see-more">

                                Ver más
                            
                            </div>
                            </a>
                            </div>
                        </div>
                        ))}

                    </div>

                    
                    
                </div>
                    <div className="heart"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}>
                            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="profile" onClick={openProfile} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                        <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    </div>
                </div>
               
                {/* Conditional rendering for arrayInfo */}


            </header>
            {profile && <>
            <div className="profileContainer" onMouseLeave={()=>{setProfile(!profile)}}  ref={profileContainer}>
                {(!user) ? <>
                <Link to="/login">
                <div className="profileElement">
                    <span>Inicio de sesión</span>
                </div>
                </Link>
                </>:<>
                <Link to="/account">
                <div className="profileElement">
                    <span>Cuenta</span>
                </div>
                </Link>
                <Link to="mislibros">
                <div className="profileElement">
                    Mis Libros
                </div>
                </Link>
                </>}
            </div>
            </>}
            {(window.innerWidth >= 1280 && arrayInfo) ? (
            <div className="extraInfoContainer" onMouseLeave={() => setArrayInfo(null)} >
            
                <>
                <div className="recomendaciones">
                    <h2>Recomendaciones</h2>
                    <hr/>
                    {arrayInfo["recomendaciones"].map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                <div className="mas-vendidos">
                <h2>Más vendidos</h2>
                <hr/>
                    {arrayInfo["mas-vendidos"].map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                <div className="generos">
                    <h2>Géneros</h2>
                    <hr/>
                    {arrayInfo["generos"].map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                <div className="mas-buscados">
                    <h2>Más Buscados</h2>
                    <hr/>
                    {arrayInfo["mas-buscados"].map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                </>
           
            </div>
            ) : null}
            {/*<div className="inhamburger" onMouseLeave={abrirMenu}>
                 Hamburger menu content 

            </div>*/}
        </>
    );
}
