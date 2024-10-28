import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
import ErrorPage from "../../components/errorPage";
import { makeCard, makeSmallCard } from "../../assets/makeCard";
import { cambiarEspacioAGuiones } from "../../assets/agregarMas";
import { toast, ToastContainer } from "react-toastify"

import 'react-toastify/dist/ReactToastify.css';
import { handleFavoritos } from "../../assets/handleFavoritos";

export default function BookView() {
    const { bookId } = useParams();
    const [libro, setLibro] = useState(null); // Inicialmente null
    const [loading, setLoading] = useState(true); // Estado de carga
    const [actualImage, setActualImage] = useState("");
    const [isZoomed, setIsZoomed] = useState(false);
    const [librosRelacionadosVendedor, setLibrosRelacionadosVendedor] = useState([])
    const [librosRelacionados, setLibrosRelacionados] = useState([])
    const actualImageRef = useRef(null);
    const [user, setUser] = useState(null);

useEffect(() => {
    async function fetchUser() {
        
        try {
            const response = await fetch('http://localhost:3030/api/users/userSession', {
                method: 'POST',
                credentials: 'include',  // Asegúrate de enviar las cookies
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Establece el usuario en el estado
            }
            else {
                setUser({
                    _id: ''
                })
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    fetchUser(); // Llama a la función para obtener el usuario
}, []); // Dependencias vacías para ejecutar solo una vez al montar el componente

    useEffect(() => {
        window.scrollTo(0, 0);
      }, [bookId]);
    useEffect(() => {
        async function fetchLibro(id) {
            const url = `http://localhost:3030/api/books/${id}`
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: "include"
                });
                if (!response.ok) {
                    window.location.href = '/popUp/libroNoEncontrado'
                }
                const book = await response.json();
                setLibro(book || {}); // Asegurar que el libro existe o dejar vacío
                const imageUrl = book.images[0]
                ? `http://localhost:3030/uploads/${book.images[0]}` // Ruta completa hacia las imagenes
                : "";
                setActualImage(imageUrl);
            } catch (error) {
                setLibro({});
                console.error("Error fetching book data:", error);
            } finally {
                setLoading(false); // Marcar que la carga ha finalizado
            }
        }

        fetchLibro(bookId);
    }, [bookId]);

    useEffect(()=>{
        async function fetchLibroRelacionadoVendedor() {
            let libros = []
            if (libro) {
                
                const urlUsers = 'http://localhost:3030/api/users/'
                const data = await fetch(urlUsers + libro.idVendedor).then(res=> res.json())
                if (data.error){
                    console.error(data.error)
                    return
                }

                const librosIds = data.librosIds

                // Conseguir los libros del usuario
                const urlLibros = 'http://localhost:3030/api/books/'
                for (let i=0; i < librosIds.length; i++){
                    const data = await fetch(urlLibros + librosIds[i]).then(res=>res.json())
                    if (data.error){
                        console.error(data.error)
                        continue
                    }
                    
                    libros.push(data)
                }
                               
                setLibrosRelacionadosVendedor(libros)
            }
        }
        fetchLibroRelacionadoVendedor()

    },[libro])
    useEffect(()=>{
        async function fetchLibroRelacionado() {
            if (libro) {
                
                // Conseguir los libros del usuario
                const urlLibros = `http://localhost:3030/api/books/query?q=${cambiarEspacioAGuiones(libro.titulo)}&l=12`
                
                const data = await fetch(urlLibros).then(res=>res.json())
                
                if (data.error){
                    console.error(data.error)
                    return;
                }
                
                setLibrosRelacionados(data)
            }
        }
        fetchLibroRelacionado()
        

    },[libro])
    if (loading) {
        return (
            <>
                <Header />
                <Footer />
                <SideInfo />
            </>
        );
    }

    if (!libro || Object.keys(libro).length === 0) {
        return <ErrorPage />;
    }

    const zoomConst = 3; // Aumento del zoom

    const handleZoom = () => {
        const imagenDentro = actualImageRef.current.querySelector("img");
        if (isZoomed) {
            setIsZoomed(false);
            imagenDentro.style.transform = `none`;
        } else {
            setIsZoomed(true);
            imagenDentro.style.transform = `scale(${zoomConst})`;
            
        }
    };

    const moverMouse = (e, amountOfZoom = zoomConst) => {
        if (!isZoomed) return;

        const rect = actualImageRef.current.getBoundingClientRect();
        const imagenDentro = actualImageRef.current.querySelector("img");

        // Obtener el tamaño original y zoomf
        const originalWidth = imagenDentro.offsetWidth;
        const originalHeight = imagenDentro.offsetHeight;
        const imgWidth = originalWidth * amountOfZoom;
        const imgHeight = originalHeight * amountOfZoom;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Porcentajes relativos al contenedor
        const porcentajeX = x / rect.width;
        const porcentajeY = y / rect.height;

        // Movimiento máximo permitido
        const maxMoveX = Math.max(0, imgWidth - rect.width);
        const maxMoveY = Math.max(0, imgHeight - rect.height);

        // Calcular desplazamiento manteniendo la imagen dentro del contenedor
        const moverX = Math.min(Math.max(porcentajeX * maxMoveX, 0), maxMoveX);
        const moverY = Math.min(Math.max(porcentajeY * maxMoveY, 0), maxMoveY);

        imagenDentro.style.transformOrigin = `${porcentajeX * 100}% ${porcentajeY * 100}%`;
        imagenDentro.style.transform = `scale(${amountOfZoom}) translate(-${moverX/ Math.pow(amountOfZoom, 9)}px, -${moverY/Math.pow(amountOfZoom, 9)}px)`;
    };

    function diff_weeks(dt2, dt1) 
    {
    // Calculate the difference in milliseconds between dt2 and dt1
    let diff =(dt2.getTime() - dt1.getTime()) / 1000;
    // Convert the difference from milliseconds to weeks by dividing it by the number of milliseconds in a week
    diff /= (60 * 60 * 24 * 7);
    // Return the absolute value of the rounded difference as the result
    return Math.abs(Math.round(diff));
    }

    function handleSetPregunta(str) {
        const inputPregunta = document.querySelector('.inputPregunta');
        
        if (str === 'costo') {
            inputPregunta.value = '¿Cuál es el costo del producto?';
        } else if (str === 'devolucion') {
            inputPregunta.value = '¿Cómo puedo hacer una devolución?';
        } else if (str === 'metodoPago') {
            inputPregunta.value = '¿Qué métodos de pago aceptan?';
        } else if (str === 'estadoProducto') {
            inputPregunta.value = '¿En qué estado se encuentra el producto?'
        }
    }

    async function handleSubmitPregunta() {
        const inputPregunta = document.querySelector('.inputPregunta');

        if (!inputPregunta.value){
            return;
        }
        if (libro){
            const url = `http://localhost:3030/api/books/${libro._id}`;
                    
            try {
                const response = await fetch(url, {
                    method: 'PUT' ,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mensaje: inputPregunta.value,
                        tipo: 'pregunta'
                        
                    }),
                    credentials: 'include'
                });
        
        
                if (!response.ok) {
                    // Actualizar el estado de errores usando setErrors
                    return; // Salir de la función si hay un error
                }
                inputPregunta.value = ''
                toast('Pregunta enviada exitosamente')
                
            } catch (error) {
                console.error('Error al enviar la solicitud:', error);
                // También puedes agregar el error de catch a los errore
            }
        }
    }
    return (
        <>
            <Header />
            <div className="anuncio"></div>
            <div className="libroContenedor">
                <div className="imagesContainer">
                    <div className="imagesVariable">
                    {libro.images && 
                        libro.images.map((image, index) => (
                            <div 
                                className="imageElement" 
                                key={index} 
                                onClick={() => {
                                    // Construir la URL completa para cada imagen
                                    const imageUrl = image ? `http://localhost:3030/uploads/${image}` : "";
                                    setActualImage(imageUrl); // Establecer la URL de la imagen actual
                                }}
                            >
                                <img 
                                    loading="lazy" 
                                    src={`http://localhost:3030/uploads/${image}`} // Usar la URL completa para mostrar la imagen
                                    alt={libro.title} 
                                    title={libro.title} 
                                />
                            </div>
                        ))}
                    </div>

                    <div
                        className="actualImage"
                        ref={actualImageRef}
                        style={{ cursor: !isZoomed ? "zoom-in" : "zoom-out" }}
                    >
                        {libro.images && libro.images.length > 0 && (
                            <img
                                src={actualImage}
                                alt={libro.titulo}
                                title={libro.titulo}
                                onMouseMove={moverMouse}
                                onClick={handleZoom}
                            />
                        )}
                    </div>
                </div>

                <div className="infoContainer">
                    {(diff_weeks(new Date(libro.fechaPublicacion), new Date()) <= 2 ) ? <div className="informacion">Nuevo</div>:<></>}
                    <h1>{libro.titulo}</h1>
                    {libro.oferta ? (
                        <>
                            <h3>
                                <s>${libro.precio.toLocaleString("es-CO")}</s>
                            </h3>
                            <h2>${libro.oferta.toLocaleString("es-CO")}</h2>
                        </>
                    ) : (
                        <h2>${libro.precio.toLocaleString("es-CO")}</h2>
                    )}
                    {[
                        libro.autor && `Autor: ${libro.autor}`,
                        libro.genero && `Género: ${libro.genero}`,
                        libro.estado && `Estado: ${libro.estado}`,
                        libro.edicion && `Edición: ${libro.edicion}`,
                        libro.tapa && `Tapa: ${libro.tapa}`,
                        libro.idioma && `Idioma: ${libro.idioma}`,
                        libro.ubicacion && `Ubicación: ${libro.ubicacion}`,
                        libro.fechaPublicacion && `Publicado: ${new Date(libro.fechaPublicacion)
                        .toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}`,
                        libro.edad && `Edad recomendada: ${libro.edad}`,
                    ]
                        .filter(Boolean)
                        .map((item, index) => (
                            <p key={index}>{item}</p>
                        ))}

                </div>

                <div className="comprarContainer">
                    <h2>Envío a nivel nacional</h2>
                    
                    <hr />
                    {(libro.disponibilidad == "Disponible") ? <>
                    <h3>Disponible</h3>
                    
                    {libro && <Link to={`/checkout/${libro._id}`}><button >Comprar ahora</button></Link>}
                    </> : <></>}
                    {libro && <button onClick={(event) => handleFavoritos(event, libro._id, user._id )} className="botonInverso">Agregar a favoritos</button>}
                    <h3>Vendido por:</h3>
                    <Link to={`/usuarios/${libro.idVendedor}`}><span>{libro.vendedor}</span></Link>
                    <hr />
                    <div className="separarConFoto">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color={"#000000"} fill={"none"}>
                        <path d="M8.12901 11.1313L12.128 6.1907C12.4408 5.80431 13.027 6.0448 13.027 6.55951V10.3836C13.027 10.6919 13.2569 10.9419 13.5405 10.9419H15.4855C15.9274 10.9419 16.1629 11.5083 15.871 11.8689L11.872 16.8095C11.5592 17.1959 10.973 16.9554 10.973 16.4407V12.6167C10.973 12.3083 10.7431 12.0584 10.4595 12.0584H8.51449C8.07264 12.0584 7.83711 11.4919 8.12901 11.1313Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M21 11.1835V8.28041C21 6.64041 21 5.82041 20.5959 5.28541C20.1918 4.75042 19.2781 4.49068 17.4507 3.97122C16.2022 3.61632 15.1016 3.18875 14.2223 2.79841C13.0234 2.26622 12.424 2.00012 12 2.00012C11.576 2.00012 10.9766 2.26622 9.77771 2.79841C8.89839 3.18875 7.79784 3.61632 6.54933 3.97122C4.72193 4.49068 3.80822 4.75042 3.40411 5.28541C3 5.82041 3 6.64041 3 8.28041V11.1835C3 16.8086 8.06277 20.1836 10.594 21.5195C11.2011 21.8399 11.5046 22.0001 12 22.0001C12.4954 22.0001 12.7989 21.8399 13.406 21.5195C15.9372 20.1836 21 16.8086 21 11.1835Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <div>
                    <span style={{fontSize:"2rem"}}>Compra protegida, </span>recibe el producto que 
                    esperabas o te devolvemos tu dinero.
                    </div>
                    </div>
                    <hr />
                    <div className="informacionDelVendedor">
                    <h2>Productos de {libro.vendedor}: </h2>
                    
                    {librosRelacionadosVendedor && libro && (
                    <div className="smallCardContainer">
                        {librosRelacionadosVendedor
                        .filter(element=> element._id !== libro._id)
                        .map((element, index) => makeSmallCard(element, index))}
                    </div>
                    )}
                </div>
                </div>

            </div>
            <div className="extraBookViewContainer">
            
            <div className="comments">
                <div className="separar">
                <h2>Pregúntale al vendedor</h2>
                <h2>Preguntas realizadas</h2>
                </div>
                <div className="separar">
                <div>
                <div className="question-buttons">
                    <button className='botonInverso' onClick={()=>handleSetPregunta('costo')}>Costo y tiempo de envío</button>
                    <button className='botonInverso'onClick={()=>handleSetPregunta('devolucion')}>Devoluciones gratis</button>
                    <button className='botonInverso'onClick={()=>handleSetPregunta('metodoPago')}>Medios de pago</button>
                    <button className='botonInverso'onClick={()=>handleSetPregunta('estadoProducto')}>Estado del producto</button>
                </div>
               
                <div className="ask-section">
                    <textarea type="text" className="inputPregunta" placeholder="Escribe tu pregunta..." rows='2'/>
                    <button onClick={handleSubmitPregunta} className="ask-button">Preguntar</button>
                </div>
                </div>
                <div className="comentarios">
                    {/*Mensaje
                        [mensaje, respuesta]
                    */}
                    {libro && libro.mensajes && libro.mensajes.filter(mensaje=> mensaje[0] && mensaje[1]).length !== 0 ? libro.mensajes.filter(mensaje=> mensaje[0] && mensaje[1]).slice(0, 3).map((element, index) => (
                        <div className="mensajeContainer" key={index}>
                            <p className="mensaje">{element[0]}</p>
                            <p className="respuesta">{element[1]}</p>
                        </div>
                    )): <div className="mensajeContainer">
                        <p>No hay preguntas sobre este libro</p>
                    </div> }
                </div>
                </div>
                </div>
            <div className="description">
                
                <h2>Descripción</h2>
                <p>{libro.descripcion}</p>
            </div>

            
                {(librosRelacionados.filter(element=> element._id !== libro._id).length !==0  && libro) ? (
                    <div className="related">
                        <h2>Productos Relacionados</h2>
                        <div className="leftScrollContainer">
                        {librosRelacionados.filter(element=> element._id !== libro._id).map((element, index) => makeCard(element, index))}
                        </div>
                    </div>
            ): <></>}
            </div>
            <ToastContainer position="bottom-center"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
draggable
theme="light"
/>
            <SideInfo />
            <Footer />
        </>
    );
}
