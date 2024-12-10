import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { reduceText } from "../assets/reduceText";
import { cambiarEspacioAGuiones } from "../assets/agregarMas";
import { SimpleNotification } from "../assets/formatNotificationMessage";
import axios from 'axios'
import { renderProfilePhoto } from "../assets/renderProfilePhoto.js";
//import useFetchUser from "../assets/useFetchUser";
export default function Header() {
    //const user = useFetchUser('http://localhost:3030/api/users/userSession')

    const navigate = useNavigate()
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const url = 'http://localhost:3030/api/users/userSession'
                const response = await axios.post(url, null, {
                    withCredentials: true
                })
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUser(); // Llama a la función para obtener el usuario
    }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente


// Fetch notificaciones

    const [notifications, setNotifications] = useState(null)
    const [notificationOpen, setNotificationOpen] = useState(false)
    useEffect(()=>{
        async function fetchNotifications() {
            if (!user) return 
            const url = 'http://localhost:3030/api/notifications/getNotificationsByUser/' + user._id
            const response = await axios.get(url)
            setNotifications(response.data)
        }
        fetchNotifications()
    },[user])

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
    const [arrayInfo, setArrayInfo] = useState([]);

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
            console.warn(`Key "${str}" no se encontró.`);
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
    
        // Función para obtener los resultados de búsqueda
        async function fetchResults() {
            try {
                // Verificamos que la query no esté vacía o sea solo espacios
                if (queryInput.current.value && queryInput.current.value.trim()) {
                    const url = `http://localhost:3030/api/books/query?q=${queryInput.current.value}`
                    const response = await axios.get(url, {withCredentials: true});
                    return response.data
                }
            } catch (error) {
                console.error('Error fetching book data:', error);
                return []; // Retorna un array vacío en caso de error
            }
        }
    
        // Llama a la función para obtener los resultados
        fetchResults().then(bookResults => {
            // Convertir `bookResults` a un array antes de aplicar `slice`
            if (Array.isArray(bookResults)) {
                setResults(bookResults.slice(0, 5)); // Obtener los primeros 5 resultados
            }
        });
    }
    

    // Submits the input value when the search button is clicked
    function submitInputValue() {
        if (!queryInput.current.value) return;

        navigate(`/buscar?q=${cambiarEspacioAGuiones(queryInput.current.value)}`)
        queryInput.current.value = "";
    }

    // Funcionalidad del perfil
    const [profile, setProfile] = useState(false)


    const profileContainer = useRef(null);

    const openProfile = () => {
        setProfile(prevProfile => {
            const newProfileState = !prevProfile;
            return newProfileState;
        });
    };
    const color = '#42376E'
    return (
        <>
            <header>
                <div className="flex-between">
                <Link to="/">
                <div className="headerIzq">
                    <img loading="lazy" src="/logo.png" alt="" />
                   <h1 style={{fontFamily: 'Gentium Book Plus'}} >  Meridian</h1>
                </div>
                </Link>

                <div className="indice headerCen desaparecer">
                    <Link to="/"><p>Inicio</p></Link>
                    <Link to='/para-ti'><p>Para ti</p></Link>
                    <p  onMouseOver={() => openExtraInfo("Libros")} >Libros</p>
                    <p onMouseOver={() => openExtraInfo("Autores")} >Autores</p>
                    
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} fill={"none"}>
                            <path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                    
                    </button>
                    </div>
                    <div className="resultsContainer" >
                    {results.slice(0,4).map((result, index) => (
                        <Link to={`/libros/${result._id}`} key={index} >
                        <div className="result" >
                            <img loading="lazy" src={`http://localhost:3030/uploads/${result.images[0]}`} alt={result.titulo} className="result-photo" />
                            <div className="result-info">
                            <div>
                                <h2>{reduceText(result.titulo,50)}</h2>
                            </div>
                            <Link
                                to={`/buscar?q=${cambiarEspacioAGuiones(result.titulo)}`} 
                                rel="noopener noreferrer"
                            >
                            <div className="see-more">Similares</div>
                            </Link>
                            </div>
                        </div>
                        </Link>
                        ))}

                    </div>

                    
                    
                </div>
                    {user && <><div className="notification" onClick={()=>{
                        setNotificationOpen(!notificationOpen)
                    }}>
                        {/* Notification icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                            <path d="M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {notifications && notifications.filter((noti) => noti.read === false).length !== 0 &&
                            <div className="notificationIconCount">
                                {notifications.filter((noti) => noti.read === false).length}
                            </div>
                        }
                    </div> 
                    <Link to={`/favoritos/${user._id}`} style={{all:'inherit'}}>
                    <div className="heart"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}>
                            <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {(user && user.favoritos.length !== 0) && 
                        <div className="heartIconCount">
                            {user.favoritos.length}
                        </div>
                    }
                    </div></Link></>}
                    <div className="profile" onClick={openProfile} >
                        {!(user && user.fotoPerfil) ?
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                        <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                        : <img src={renderProfilePhoto({ user })} alt="Foto" />
                        }
                    </div>
                </div>
           </header>
            {profile && <>
            <div className="profileContainer" onMouseLeave={()=>{setProfile(!profile)}}  ref={profileContainer}>
                {(!user) ? <>
                <Link to="/login">
                <div className="profileElement">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={color} fill={"none"}>
                        <path d="M10 3L9.33744 3.23384C6.75867 4.144 5.46928 4.59908 4.73464 5.63742C4 6.67576 4 8.0431 4 10.7778V13.2222C4 15.9569 4 17.3242 4.73464 18.3626C5.46928 19.4009 6.75867 19.856 9.33744 20.7662L10 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M10 12L20 12M10 12C10 11.2998 11.9943 9.99153 12.5 9.5M10 12C10 12.7002 11.9943 14.0085 12.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg><span>Inicio de sesión</span>
                </div>
                </Link>
                </>:<>
                
                <Link to='/cuenta'>
                <div className="profileElement">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={color} fill={"none"}>
                        <path d="M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                    <span>Cuenta</span>
                </div>
                </Link>
                <Link to="/libros/crear">
                <div className="profileElement">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={color} fill={"none"}>
                        <path d="M20.5 16.9286V10C20.5 6.22876 20.5 4.34315 19.3284 3.17157C18.1569 2 16.2712 2 12.5 2H11.5C7.72876 2 5.84315 2 4.67157 3.17157C3.5 4.34315 3.5 6.22876 3.5 10V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M9 8.67347L10.409 7.18691C11.159 6.39564 11.534 6 12 6C12.466 6 12.841 6.39564 13.591 7.18692L15 8.67347M12 6.08723L12 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M20.5 17H6C4.61929 17 3.5 18.1193 3.5 19.5C3.5 20.8807 4.61929 22 6 22H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M20.5 17C19.1193 17 18 18.1193 18 19.5C18 20.8807 19.1193 22 20.5 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span>Publica tu libro</span>
                </div>
                </Link>
                <Link to={`/usuarios/${user._id}`}>
                <div className="profileElement">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={color} fill={"none"}>
                        <path d="M20.5 16.9286V10C20.5 6.22876 20.5 4.34315 19.3284 3.17157C18.1569 2 16.2712 2 12.5 2H11.5C7.72876 2 5.84315 2 4.67157 3.17157C3.5 4.34315 3.5 6.22876 3.5 10V19.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M20.5 17H6C4.61929 17 3.5 18.1193 3.5 19.5C3.5 20.8807 4.61929 22 6 22H20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M20.5 22C19.1193 22 18 20.8807 18 19.5C18 18.1193 19.1193 17 20.5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M15 7L9 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 11L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Mis Libros</span>
                </div>
                </Link>
                <Link to="/mensajes">
                <div className="profileElement">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={color} fill={"none"}>
                        <path d="M8.5 14.5H15.5M8.5 9.5H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    <span>Mis mensajes</span>
                </div>
                </Link>
                <div className="profileElement" onClick={async ()=>{
                    await axios.post('http://localhost:3030/api/users/logout', null, {withCredentials: true})
                    window.location.reload();
                }}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"#000000"} fill={"none"}>
                        <path d="M11 3L10.3374 3.23384C7.75867 4.144 6.46928 4.59908 5.73464 5.63742C5 6.67576 5 8.0431 5 10.7778V13.2222C5 15.9569 5 17.3242 5.73464 18.3626C6.46928 19.4009 7.75867 19.856 10.3374 20.7662L11 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <path d="M21 12L11 12M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Cerrar Sesión</span>
                </div>
                </>}
            </div>
            </>}
            {(window.innerWidth >= 700 && Object.keys(arrayInfo).length !== 0) ? (
            <div className="extraInfoContainer" onMouseLeave={() => setArrayInfo([])} >
                <div className="recomendaciones">
                    <h2>Recomendaciones</h2>
                    <hr/>
                    {arrayInfo.recomendaciones.map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                <div className="mas-vendidos">
                <h2>Más vendidos</h2>
                <hr/>
                    {arrayInfo.masVendidos.map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                <div className="generos">
                    <h2>Géneros</h2>
                    <hr/>
                    {arrayInfo.buscadoRecientemente.map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                <div className="mas-buscados">
                    <h2>Más Buscados</h2>
                    <hr/>
                    {arrayInfo.masBuscados.map((element, index) => (<Link key={index} to={`/buscar?q=${cambiarEspacioAGuiones(element)}`}><p>{element}</p></Link>))}
                </div>
                
           
            </div>
            ) : <></>}
            {(notifications && user && notificationOpen) && <div className="notificationsContainer" onMouseLeave={()=>
                setNotificationOpen(!notificationOpen)
            }>
                {notifications.slice(notifications.length - 4, notifications.length).map((notification, index) => (
                    <Link to={`/notificaciones/${notification._id}`} key={index}>
                        <div className="notificationElement">
                            {SimpleNotification(notification)}
                        </div>
                    </Link>
                )).reverse()}
                {notifications.length === 0 && 'No tienes notificaciones'}
            </div>}
            {/*<div className="inhamburger" onMouseLeave={abrirMenu}>
                 Hamburger menu content 

            </div>*/}
        </>
    );
}
