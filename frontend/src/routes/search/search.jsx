/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useParams, useSearchParams } from "react-router-dom"
import SideInfo from "../../components/sideInfo.jsx"
import Footer from "../../components/footer.jsx"
import Header from "../../components/header.jsx"
import { useEffect, useState, useRef } from "react"
import { cambiarEspacioAGuiones, cambiarGuionesAEspacio } from "../../assets/agregarMas.js"
import { MakeCard, MakeOneFrCard } from "../../assets/makeCard.jsx"
import useBotonSelect from "../../assets/botonSelect.jsx"
import DoubleSlider from "../../components/DoubleSlider.jsx"
import { ToastContainer } from "react-toastify"
export default function Search(){

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
              
          } catch (error) {
              console.error('Error fetching user data:', error);
          }
      };
  
      fetchUser(); // Llama a la función para obtener el usuario
  }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente
    
    const [params] = useSearchParams()

    const queryParams = {
      categoria: params.get('Categoría'),
      estado: params.get('Estado'),
      ubicacion: params.get('Ubicación'),
      edad: params.get('Edad'),
      tapa: params.get('Tapa-dura-o-blanda'),
      fechaPublicacion: params.get('Fecha-de-publicación'),
      idioma: params.get('Idioma')
    };
    const query = cambiarGuionesAEspacio(params.get("q"))

    //Si no hay q devolver a la pestaña de inicio
    useEffect(()=>{
        if (!query) window.location.href = window.location.origin
    },[query])

    const [results, setResults] = useState([]);

    // Fetch de la query
    useEffect(() => {
      async function fetchResults() {
        try {
          // Verificamos que la query no esté vacía o sea solo espacios
          // Si hay un filtro no empleamos esta funcion
          if (query && query.trim() && Object.values(queryParams).every(val => !val)) {
            const response = await fetch(`http://localhost:3030/api/books/query?q=${query}`, {
              method: 'GET',
              credentials: 'include',  // Enviar las cookies
            });
    
            if (response.ok) {
              const data = await response.json();
              setResults(data); // Establece los resultados en el estado
            } else {
              console.error('Failed to fetch book data:', response.statusText);
            }
          }
        } catch (error) {
          console.error('Error fetching book data:', error);
        }
      }
    
      fetchResults(); // Llama a la función para obtener los resultados
    }, [query]); // Ejecuta cada vez que 'query' cambie
    

    const [currentPage, setCurrentPage] = useState(1);
    const [grid, setGrid] = useState(localStorage.getItem("grid")|| "1fr 1fr 1fr 1fr");
    const pageCount = Math.ceil(results.length / 24);
    
    const optionalSpace = (results.length % 2 === 1) ? <div></div> : <></>;

    const reducirPagina = () => {
    if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
    }
    };

    const aumentarPagina = () => {
    if (currentPage < pageCount) {
        setCurrentPage(currentPage + 1);
    }
    };

    const renderizarResultados = () => {
        return results.slice((currentPage - 1) * 24, currentPage * 24)
    }



    useEffect(() => {
    const updateGrid = () => {
        if (grid.split(" ").length !==1) {
          setGrid((window.innerWidth >= 834) ? "repeat(4, 1fr)" : "repeat(2, 1fr)");  
          
        }
        else {
          setGrid("1fr") 
          
        }
        
    };
    
    updateGrid(); // Initial check

    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
    }, [grid]);

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);
    
    //filtros

    const [filtros, setFiltros] = useState({});
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    

    function aplicarFiltros(){
      const keys = Object.keys(filtros)
      const values = Object.values(filtros)
      let filtersQuery = "";
      for (let i = 0; i < keys.length; i++) {
          filtersQuery += `&${keys[i]}=${encodeURIComponent(values[i])}`; // Construye la cadena de consulta
      }
      window.location.href = window.location.origin + "/buscar" + "?" + `q=${cambiarEspacioAGuiones(query)}` + cambiarEspacioAGuiones(filtersQuery)
      
    }
    useEffect(() => {
      async function fetchFilters() {
        // Return early if no valid query or filter parameters are available
        if (!query || Object.values(queryParams).every(val => !val)) return;
    
        // Create the URL search parameters object
        const searchParams = new URLSearchParams();
        searchParams.append('q', query);
    
        // Add valid filters to searchParams
        Object.entries(queryParams).forEach(([param, value]) => {
          if (value) { // Only add filters with a truthy value
            searchParams.append(param, value);
          }
        });
    
        // Construct the full URL
        const url = `http://localhost:3030/api/books/query/filters?${searchParams.toString()}`;
    
        try {
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.error) {
            console.error(data.error);
            return;
          }
    
          setResults(data.books || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    
      fetchFilters();
    }, [params, query]); // Ensure `queryParams` is also included in the dependencies
    
      const [stars, setStars] = useState(params.get("calificacion")); // State to track the selected rating

      const handleStars = (index) => {
        const newStars = index + 1; // Obtiene el nuevo valor de calificación
        setStars(newStars);
        setFiltros((prev) => ({ ...prev, calificacion: newStars })); // Actualiza el estado de filtros
        };
      const estrellaClara = (
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"#fff"}
              style={{ cursor: 'pointer', margin: "0 2px" }}
              onClick={() => handleStars(0)} // Handle click for clear star
          >
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
              />
          </svg>
      );
      
      const estrellaAmarilla = (
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill={"yellow"}
              style={{ cursor: 'pointer', margin: "0 2px" }}
              onClick={() => handleStars(1)} // Handle click for filled star
          >
              <path d="M13.7276 3.44418L15.4874 6.99288C15.7274 7.48687 16.3673 7.9607 16.9073 8.05143L20.0969 8.58575C22.1367 8.92853 22.6167 10.4206 21.1468 11.8925L18.6671 14.3927C18.2471 14.8161 18.0172 15.6327 18.1471 16.2175L18.8571 19.3125C19.417 21.7623 18.1271 22.71 15.9774 21.4296L12.9877 19.6452C12.4478 19.3226 11.5579 19.3226 11.0079 19.6452L8.01827 21.4296C5.8785 22.71 4.57865 21.7522 5.13859 19.3125L5.84851 16.2175C5.97849 15.6327 5.74852 14.8161 5.32856 14.3927L2.84884 11.8925C1.389 10.4206 1.85895 8.92853 3.89872 8.58575L7.08837 8.05143C7.61831 7.9607 8.25824 7.48687 8.49821 6.99288L10.258 3.44418C11.2179 1.51861 12.7777 1.51861 13.7276 3.44418Z" 
                  stroke="black" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
              />
          </svg>
      );
      
      const cincoEstrellas = Array(5).fill().map((_, index) => (
          index < stars ? estrellaAmarilla : estrellaClara
      ));


// Opciones de ordenación disponibles
const ordenarFormas = {
    "Seleccionar": true,
    "Menor Precio": (a, b) => a.precio - b.precio,   // Ordenar de menor a mayor precio
    "Mayor Precio": (a, b) => b.precio - a.precio    // Ordenar de mayor a menor precio

  };
  
  
  const selectedProyectos = (formas, forma, results, setResults) => {
    // Aquí se ejecuta la lógica de ordenación
    const sortedData = [...results].sort(formas[forma]);
    setResults(sortedData);
    
  };
  
  const selectedOrdenarProps ={   // Llama al hook aquí
    formas: ordenarFormas,
    results,
    setResults,
    ancho: "150px",
    callback: selectedProyectos // Pasa la función como callback
  };


  const idiomas = {
    "Idioma": "",
    "Español": "Español",
    "Ingles": "Ingles"
  }

  const agregarAQuery = (formas, forma, results, setResults) => {
    // Verificar si la forma seleccionada está en el objeto formas
    if (Object.prototype.hasOwnProperty.call(formas, forma)) {
      const categoria = Object.keys(formas)[0]; // El nombre de la categoría seleccionada (por ejemplo, "Español" o "Inglés")
      const valor = forma; // El valor asociado a esa categoría
  
      // Actualizamos el estado de filtros
      setResults((prevResults) => ({
        ...prevResults,  // Mantén los filtros anteriores
        [categoria]: cambiarEspacioAGuiones(valor) // Actualiza el filtro seleccionado en la categoría correspondiente
      }));
    } else {
      console.error("La forma seleccionada no existe en el objeto formas.");
    }
  };
  
  const idiomaProps = {
    formas: idiomas,
    results: filtros,
    setResults: setFiltros,
    ancho: "15vw",
    callback: agregarAQuery
  }
  const ubicaciones = {
    "Ubicación" : "",
    "Bucaramanga": "",
    "Santander":""
  }
  const configuracionFiltros = (ancho)=>{
    return {
      results:filtros,
      setResults:setFiltros,
      ancho,
      callback: agregarAQuery
    }
  }
  const ubicacionProps = {
    formas : ubicaciones,
    ...configuracionFiltros("15vw")
  }

  const categorias = {
    "Categoría": "",
    "novela": "Novela",
    "ciencia-ficcion": "Ciencia Ficción",
    "infantil": "Infantil",
    "escolar": "Escolar",
    "literatura": "Literatura",
    "biografias": "Biografías",
    "profesional": "Profesional",
    "idiomas": "Idiomas",
    "poesia": "Poesía",
    "misterio": "Misterio",
    "historia": "Historia"
  };
  const estados = {
    "Estado":"",
    "Nuevo": "",
    "Un solo uso":"",
    "Levemente usado":"",
    "Con detalles":""
    
  }
  const fechaPublicacion = {
    "Fecha de publicación":"",
    "Menos de un mes":"",
    "Menos de un año":""

  }
  const edades = {
    "Edad":"",
    "Niños": "",
    "Jóvenes":"",
    "Adultos":""
  }
  const tapa = {
    "Tapa dura o blanda":"",
    "Tapa dura":"",
    "Tapa blanda":""
  }
  const ancho = '200px'
  const categoriaProps = {
    formas: categorias,
    ...configuracionFiltros(ancho)
  }
  const estadoProps = {
    formas: estados,
    ...configuracionFiltros(ancho)
  }
  const edadProps = {
    formas:edades,
    ...configuracionFiltros(ancho)
  }
  const fechaPublicacionProps = {
    formas : fechaPublicacion,
    ...configuracionFiltros(ancho)
  }
  const tapaProps = {
    formas: tapa, 
    ...configuracionFiltros(ancho)
  }
  const [filtersOpen, setFiltersOpen] = useState(true)
  function handleOpenFilters() {
    const arrow = document.querySelector('.flecha')
    const resultadosYMasFiltros = document.querySelector('.resultadosYMasFiltros')
    const masFiltros = document.querySelector('.masFiltros')
    const phoneBreakPoint = window.innerWidth >= 600
    // if filters are open close them
    if (filtersOpen) {
      arrow.style.left = '-7rem'
      masFiltros.style.transform = 'translateX(-20vw)'
      arrow.querySelector('svg').style.transform = 'rotate(0deg)'
      if (phoneBreakPoint) {
        resultadosYMasFiltros.style.transform = 'translateX(calc(-20vw + 10vw))'
        resultadosYMasFiltros.style.width = '100vw'
      }
      
      
    }
    // open them
    else {
      arrow.style.left = 'calc(20vw - 7rem)'
      masFiltros.style.transform = 'translateX(0)'
      arrow.querySelector('svg').style.transform = 'rotate(180deg)'
      if (phoneBreakPoint) {
        resultadosYMasFiltros.style.transform = 'translateX(0)'
        resultadosYMasFiltros.style.width = '80vw'
      }
    }
    setFiltersOpen(!filtersOpen)
  }
  useEffect(()=>{
    handleOpenFilters()

  },[])
    return(
        <>
        <Header />
        <div><h1>Resultados</h1></div>
        <div className="flecha" onClick={handleOpenFilters}>
      Filtrar
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={25} height={25} color={"#000000"} fill={"none"}>
    <path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
      </div> 
        <hr className="noMargen"/>
        
        <div className="resultadosContainer">
        
    <div className="masFiltros">
    
      <h3>Filtrar por:</h3>
      <div>{useBotonSelect(categoriaProps)}</div>
      <div>{useBotonSelect(estadoProps)}</div>
      <div>{useBotonSelect(ubicacionProps)}</div>
      {/*<div><DoubleSlider min={0} max={1000000} width={"15vw"}/></div>*/}
      <div>{useBotonSelect(edadProps)}</div>
      <div>{useBotonSelect(tapaProps)}</div>
      <div>{useBotonSelect(fechaPublicacionProps)}</div>
      <div>{useBotonSelect(idiomaProps)}</div>
      <button className="aplicarFiltros" onClick={aplicarFiltros}>Aplicar</button>
    </div>
    
            <div className="resultadosYMasFiltros">
                
                <div className="separar">
                    <h2>{results.length} resultados</h2>
                    <div className="flex" >
                        <div className="layout"><svg onClick={()=> { 
                          setGrid("1fr"); 
                          localStorage.setItem("grid", "1fr")
                        }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}><path d="M20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28248 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28248 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21.5 8.5L2.5 8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M21.5 15.5L2.5 15.5" stroke="currentColor" strokeWidth="1.5" /></svg></div>
                        <div className="layout"><svg onClick={()=> { 
                          setGrid("1fr 1fr 1fr 1fr"); 
                          localStorage.setItem("grid", "1fr 1fr 1fr 1fr")
                          }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}><path d="M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z" stroke="currentColor" strokeWidth="1.5" /><path d="M14 6C14 4.45956 14 3.68934 14.3467 3.12353C14.5407 2.80693 14.8069 2.54074 15.1235 2.34673C15.6893 2 16.4596 2 18 2C19.5404 2 20.3107 2 20.8765 2.34673C21.1931 2.54074 21.4593 2.80693 21.6533 3.12353C22 3.68934 22 4.45956 22 6C22 7.54044 22 8.31066 21.6533 8.87647C21.4593 9.19307 21.1931 9.45926 20.8765 9.65327C20.3107 10 19.5404 10 18 10C16.4596 10 15.6893 10 15.1235 9.65327C14.8069 9.45926 14.5407 9.19307 14.3467 8.87647C14 8.31066 14 7.54044 14 6Z" stroke="currentColor" strokeWidth="1.5" /></svg></div>
                        {/*<div className="layout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}><path d="M20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /><path d="M15.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /></svg></div>*/}
                        <div className="flex">Ordenar por{useBotonSelect(selectedOrdenarProps)}</div>
                    </div>
                </div>
                
                <div className="numberPages separador" style={{display: (pageCount === 1)  ? "none":"flex"}}>
                {results.length === 0 ? <h2>No hay resultados</h2>:    
                
                            <p>
                                <span onClick={reducirPagina} style={{filter: (currentPage === 1) ?"opacity(0.2)":"none"}}>{"< "}</span>
                                {Array.from({ length: pageCount }, (_, i) => (
                                <span key={i} onClick={() => setCurrentPage(i + 1)} style={{fontWeight: (i + 1 === currentPage)? "700": ""}}>{i + 1}  </span>
                                ))}
                                <span onClick={aumentarPagina} style={{filter: (currentPage === pageCount) ?"opacity(0.2)":"none"}}>{" >"}</span>
                            </p>
  }
                        </div>
                <div className="resultados sectionsContainer" style={{ display: 'grid', gridTemplateColumns: grid }}>
                
                    {renderizarResultados().map((element, index)=> (grid.split(" ").length !==1) ? 
                    user ? <MakeCard element={element} index={index} user={user}/>: <MakeCard element={element} index={index}/>: 
                    user ? <MakeOneFrCard element={element} index={index} user={user}/>: <MakeOneFrCard element={element} index={index}/> )}
                {optionalSpace}
                </div>
                <div className="numberPages separador" style={{display: (pageCount === 1)  ? "none":"flex"}}>
                {results.length !== 0 &&
                  <p>
                      <span onClick={reducirPagina} style={{filter: (currentPage === 1) ?"opacity(0.2)":"none"}}>{"< "}</span>
                      {Array.from({ length: pageCount }, (_, i) => (
                      <span key={i} onClick={() => setCurrentPage(i + 1)} style={{fontWeight: (i + 1 === currentPage)? "700": ""}}>{i + 1}  </span>
                      ))}
                      <span  onClick={aumentarPagina} style={{filter: (currentPage === pageCount) ?"opacity(0.2)":"none"}}>{" >"}</span>
                  </p>
                }
                </div>
            </div>
        </div>
        <ToastContainer position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      pauseOnHover={false}
      closeOnClick
      theme="light"
      />
        <SideInfo />
        <Footer />
        </>
    )
}