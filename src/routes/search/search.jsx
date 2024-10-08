/* eslint-disable no-unused-vars */
import { useSearchParams } from "react-router-dom"
import SideInfo from "../../components/sideInfo"
import Footer from "../../components/footer"
import Header from "../../components/header"
import { useEffect, useState, useRef } from "react"
import { cambiarEspacioAGuiones, cambiarGuionesAEspacio } from "../../assets/agregarMas"
import { makeCard } from "../../assets/makeCard.jsx"
export default function Search(){

    // eslint-disable-next-line no-unused-vars
    const [params, setParams] = useSearchParams()
    const query = cambiarGuionesAEspacio(params.get("q"))

    //Si no hay q devolver a la pestaña de inicio
    useEffect(()=>{
        if (!query) window.location.href = window.location.origin
    },[query])

    const [results, setResults] = useState([])
    const fetchResults = async () => {
        try {
            const response = await fetch("/results.json");
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            
            const info = await response.json(); 
            
            if (info !== undefined) {
                setResults(info);
            } 
            else {
                //Decir que no se ha podido encontrar ninguna coincidencia
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };
    useEffect(()=>{
        fetchResults()
    },[])


    const [currentPage, setCurrentPage] = useState(1);
    const [grid, setGrid] = useState("repeat(2, 1fr)");
    const pageCount = Math.ceil(results.length / 24);
    const [isGrid, setIsGrid] = useState(true)
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
        if (isGrid) setGrid((window.innerWidth >= 834) ? "repeat(4, 1fr)" : "repeat(3, 1fr)");
        else setGrid("1fr") 
    };
    
    updateGrid(); // Initial check

    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
    }, [isGrid]);

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);
    
    //filtros

    const [filtros, setFiltros] = useState({
        precio: params.get("precio") || '',                // Filtro de precio
        categoria: params.get("categoria") || '',          // Filtro de categoría
        estado: params.get("estado") || '',                // Filtro de estado
        edicion: params.get("edicion") || '',              // Filtro de edición
        edad: params.get("edad") || '',                    // Filtro de edad
        tapa: params.get("tapa") || '',                    // Filtro de tapa
        fechaPublicacion: params.get("fechaPublicacion") || '', // Filtro de fecha de publicación
        valoracion: params.get("valoracion") || '',       // Filtro de valoración (agrega según necesidad)
    });
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
              width={24}
              height={24}
              fill={"#fff"}
              style={{ cursor: 'pointer', margin: "0 5px" }}
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
              width={24}
              height={24}
              fill={"yellow"}
              style={{ cursor: 'pointer', margin: "0 5px" }}
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
    "Mayor Precio": (a, b) => b.precio - a.precio,    // Ordenar de mayor a menor precio
    "Orden Alfabético": (a, b) => a.name.localeCompare(b.name) // Ordenar alfabéticamente por nombre
  };
  
  // Estado inicial para la opción de ordenación seleccionada
  const [ordenar, setOrdenar] = useState(Object.keys(ordenarFormas)[0]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Función para manejar la selección de una forma de ordenación
  const handleSelect = (forma) => {
    setOrdenar(forma);   // Actualiza el estado con la nueva forma de ordenación seleccionada
    setIsOpen(false);    // Cierra el desplegable de selección
    ordenarProyectos(forma);  // Llama a la función para ordenar los datos
  };
  
  // Función para ordenar según la forma seleccionada (Menor Precio o Mayor Precio)
  const ordenarProyectos = (forma) => {
    // Aquí iría la lógica para aplicar la ordenación a los datos.
    // En este caso, se puede usar cualquier conjunto de datos donde apliques la ordenación, como un arreglo de productos.
    const sortedData = [...results].sort(ordenarFormas[forma]);
    setResults(sortedData);  // Asume que hay un estado llamado `data` que contiene los datos que se quieren ordenar
  };
  
  // Icono para desplegar el menú de selección de ordenación
  const arrowDown = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={30} height={30} color={"#fff"} fill={"none"}>
      <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
    
  const resultadosContainer = useRef();

  useEffect(()=>{
    const sectionElements = resultadosContainer.current.querySelectorAll(".sectionElement");
        
    if (window.getComputedStyle(resultadosContainer.current).gridTemplateColumns.split(" ").length === 1) {

        sectionElements.forEach(element => {
        
          element.style.flexDirection = "row";
          element.style.justifyContent = "start"
          const imageContainer = element.querySelector(".imageElementContainer")
          imageContainer.style.height = "100%"
          imageContainer.style.width = "auto"
        });
        

      }
    else{
        sectionElements.forEach(element => {
            element.style.flexDirection = "column";
          });
    }
  },[grid]);
    return(
        <>
        <Header />
        <div><h1>Tus resultados sobre: {query}</h1></div>
        <div className="misFiltros" >
            <div className="ubicacion" ><h6>Tu ubicación</h6>Bucaramanga, Santander, Colombia</div>
            
            <div className="idioma"><h6>Idioma</h6>Español</div>
            <div className="precio" ><h6>Precio</h6>0$-10.000%</div>
            <div className="aplicarFiltros" onClick={aplicarFiltros} >Aplicar</div>
        </div>
        <hr />
        <div className="resultadosContainer">
        
    <div className="masFiltros">
      <h4>Filtrar por</h4>
      
      <div>
        <select value={filtros.categoria || params.get("categoria")} name="categoria" onChange={handleChange}>
          <option value="">Categoría</option>
          <option value="novela">Novela</option>
          <option value="ciencia-ficcion">Ciencia Ficción</option>
          <option value="infantil">Infantil</option>
          <option value="escolar">Escolar</option>
          <option value="literatura">Literatura</option>
          <option value="biografias">Biografías</option>
          <option value="profesional">Profesional</option>
          <option value="idiomas">Idiomas</option>
          <option value="poesía">Poesía</option>
          <option value="misterio">Misterio</option>
          <option value="historia">Historia</option>
        </select>
      </div>

      <div>
        <select name="estado" value={filtros.estado || params.get("estado")} onChange={handleChange}>
          <option value="">Estado</option>
          <option value="nuevo-sellado">Nuevo Sellado</option>
          <option value="un-solo-uso">Un Solo Uso</option>
          <option value="levemente-usado">Levemente Usado</option>
          <option value="con-detalles">Con Detalles</option>
        </select>
      </div>

      <div>
        <input
          type="text"
          name="edicion"
          value={filtros.edicion || params.get("edicion")}
          onChange={handleChange}
          placeholder="Edición"
        />
      </div>

      <div>
      <select name="edad" value={filtros.edad || params.get("edad")} onChange={handleChange}>
          <option value="">Edad</option>
          <option value="niños">Niños</option>
          <option value="jovenes">Jóvenes</option>
          <option value="adultos">Adultos</option>
        </select>
      </div>

      <div className="flex">
            <label>Valoración: </label>
            {cincoEstrellas.map((star, index) => (
                    <div key={index} onClick={() => handleStars(index)}>
                        {star}
                    </div>
                ))}
        </div>
        
      <div>
        <select name="tapa" value={filtros.tapa || params.get("tapa")} onChange={handleChange}>
          <option value="">Tapa dura o blanda</option>
          <option value="dura">Tapa dura</option>
          <option value="blanda">Tapa blanda</option>
        </select>
      </div>

      <div>
        <select name="fechaPublicacion" value={filtros.fechaPublicacion || params.get("fechaPublicacion")} onChange={handleChange}>
            <option value="">Fecha de Publicación</option>
            <option value="-day">Menos de un día</option>
            <option value="-week">Menos de una semana</option>
            <option value="-month">Menos de un mes</option>
            <option value="-year">Menos de un año</option>
        </select>
      </div>
      <button className="aplicarFiltros" onClick={aplicarFiltros}>Aplicar</button>
    </div>
            <div className="resultadosYMasFiltros">
                
                <div className="separar">
                    <h3>{results.length} resultados</h3>
                    <div className="flex" >
                        <div className="layout"><svg onClick={()=> setGrid("1fr")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}><path d="M20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28248 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28248 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M21.5 8.5L2.5 8.5" stroke="currentColor" strokeWidth="1.5" /><path d="M21.5 15.5L2.5 15.5" stroke="currentColor" strokeWidth="1.5" /></svg></div>
                        <div className="layout"><svg onClick={()=> setGrid("1fr 1fr 1fr 1fr")} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}><path d="M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z" stroke="currentColor" strokeWidth="1.5" /><path d="M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z" stroke="currentColor" strokeWidth="1.5" /><path d="M14 6C14 4.45956 14 3.68934 14.3467 3.12353C14.5407 2.80693 14.8069 2.54074 15.1235 2.34673C15.6893 2 16.4596 2 18 2C19.5404 2 20.3107 2 20.8765 2.34673C21.1931 2.54074 21.4593 2.80693 21.6533 3.12353C22 3.68934 22 4.45956 22 6C22 7.54044 22 8.31066 21.6533 8.87647C21.4593 9.19307 21.1931 9.45926 20.8765 9.65327C20.3107 10 19.5404 10 18 10C16.4596 10 15.6893 10 15.1235 9.65327C14.8069 9.45926 14.5407 9.19307 14.3467 8.87647C14 8.31066 14 7.54044 14 6Z" stroke="currentColor" strokeWidth="1.5" /></svg></div>
                        {/*<div className="layout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}><path d="M20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /><path d="M15.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /></svg></div>*/}
                        <div className="flex">
                            Ordenar por
                        
                            <div className="accProjects ordenarPor flex">
                                <div className="select">
                                    {/* Mostrar la opción seleccionada */}
                                    <div className="selected" onClick={() => setIsOpen(!isOpen)}>
                                        {ordenar ? <>{ordenar} {arrowDown}</> : <>Ordenar {arrowDown}</>}
                                    </div>

                                    {/* Desplegar el menú de opciones cuando esté abierto */}
                                    {isOpen && (
                                    <div className="optionsContainer" onMouseLeave={() => setIsOpen(!isOpen)}>
                                        <div className="options">
                                        {/* Mostrar las opciones de ordenación */}
                                        {Object.keys(ordenarFormas).map((forma, index) => (
                                            <div key={index} className="option" onClick={() => handleSelect(forma)}>
                                            {forma}
                                            </div>
                                        ))}
                                        </div>
                                    </div>
                                    )}
                                </div>
                            </div>

                    </div>
                    </div>
                </div>
                <div className="numberPages separador" style={{display: (pageCount === 1)  ? "none":"flex"}}>
                            <p>
                                <span onClick={reducirPagina} style={{filter: (currentPage === 1) ?"opacity(0.2)":"none"}}>{"< "}</span>
                                {Array.from({ length: pageCount }, (_, i) => (
                                <span key={i} onClick={() => setCurrentPage(i + 1)} style={{fontWeight: (i + 1 === currentPage)? "700": ""}}>{i + 1}  </span>
                                ))}
                                <span onClick={aumentarPagina} style={{filter: (currentPage === pageCount) ?"opacity(0.2)":"none"}}>{" >"}</span>
                            </p>
                        </div>
                <div className="resultados sectionsContainer" style={{ display: 'grid', gridTemplateColumns: grid }} ref={resultadosContainer}>
                
                    {renderizarResultados().map((element, index)=> makeCard(element, index))}
                {optionalSpace}
                </div>
                <div className="numberPages separador" style={{display: (pageCount === 1)  ? "none":"flex"}}>
                <p>
                    <span onClick={reducirPagina} style={{filter: (currentPage === 1) ?"opacity(0.2)":"none"}}>{"< "}</span>
                    {Array.from({ length: pageCount }, (_, i) => (
                    <span key={i} onClick={() => setCurrentPage(i + 1)} style={{fontWeight: (i + 1 === currentPage)? "700": ""}}>{i + 1}  </span>
                    ))}
                    <span  onClick={aumentarPagina} style={{filter: (currentPage === pageCount) ?"opacity(0.2)":"none"}}>{" >"}</span>
                </p>
                </div>
            </div>
        </div>
        <SideInfo />
        <Footer />
        </>
    )
}