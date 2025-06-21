import { useEffect, useState } from "react"
import { cambiarEspacioAGuiones } from "../../assets/agregarMas"
import { useNavigate } from "react-router"
import { edad, edicion, estado, formato, generos, idiomas, tapa } from "../../assets/categorias"
import Filter from "./filter"
import PriceRange from "./priceRange/priceRange"
import LocationSelector from "./location/locationSelector"

// eslint-disable-next-line react/prop-types
export default function Filters ({ query, queryParams }) {
  const navigate = useNavigate()
  const [filtros, setFiltros] = useState({})
  const [inputValue, setInputValue] = useState(query);
  // Apply filters and redirect
  const aplicarFiltros = (e) => {
    e.preventDefault()
    // Construye el query string de filtros
    let filtersQuery = Object.entries(filtros)
      .filter(([, value]) => value) // Solo incluye filtros con valores no vacíos
      .map(([key, values]) => `${key}=${cambiarEspacioAGuiones(values.join(','))}`) // Convierte los valores a una cadena separada por comas
      .join('&')
    // Agrega el rango de precios al query string
    filtersQuery = filtersQuery + `&precio=${document.querySelector('.min.input-ranges').value},${document.querySelector('.max.input-ranges').value}`

    // Construye la query principal
    const baseQuery = cambiarEspacioAGuiones(inputValue || '')
    const fullQuery = `q=${baseQuery}${filtersQuery ? `&${filtersQuery}` : ''}`

    // Navega a la nueva URL
    navigate(`/buscar?${fullQuery}`)
  }
  useEffect(() => {
    setInputValue(query); // Update the state when query prop changes
  }, [query]);
  useEffect(() => {
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== undefined && queryParams[key] !== null
        && queryParams[key] !== '' && key !== 'q' && key !== 'precio' && key !== 'ubicacion') {
        setFiltros((prev) => ({
          ...prev,
          // eslint-disable-next-line react/prop-types
          [key]: queryParams[key].split(',').map((item) => item.trim())
        }))
      }
    })
  }, [queryParams])
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const [filters] = useState([
    {
      name: 'Categoria',
      param: 'categoria',
      values: generos
    },
    {
      name: 'Estado',
      param: 'estado',
      values: estado
    },
    {
      name: 'Edad',
      param: 'edad',
      values: edad
    },
    {
      name: 'Tapa',
      param: 'tapa',
      values: tapa
    },
    {
      name: 'Formato',
      param: 'formato',
      values: formato
    },
    {
      name: 'Edición',
      param: 'edicion',
      values: edicion
    },
    {
      name: 'Idioma',
      param: 'idioma',
      values: idiomas
    }
  ])
  function makeFullArray (obj) {
    const values = Object.values(obj)
    const fullArray = []
    for (let i = 0; i < values.length; i++) {
      console.log(values)
      fullArray.push(...values[i])
    }
    return fullArray
  }

  return (<>
  <div className="filtersContainer">
    
    <div className="inputs">
      <div className="querySelector">
      <input
          id="query"
          type="text"
          placeholder="Buscar"
          value={inputValue}
          onChange={handleChange}
        />
      </div>
      <LocationSelector setFiltros={setFiltros} filtros={filtros}/>
      <PriceRange 
      min={0} 
      max={999999}/>
      <button onClick={aplicarFiltros}>Buscar</button>
    </div>
    <h2>Filtros</h2>
    <div className="filtersToApply">
      {makeFullArray(filtros).map((filtro, index) => (
        <div key={index} className="filter"
        onClick={() => {
          // Eliminar el filtro de la lista
          const filterKey = Object.keys(filtros).find(key => filtros[key].includes(filtro))
          if (filterKey) {
            setFiltros((prev) => ({
              ...prev,
              [filterKey]: prev[filterKey].filter(item => item !== filtro)
            }))
          }
          // Eliminar el filtro elegido
          document.querySelectorAll('.choosen').forEach((element) => {
            element.classList.remove('choosen')
          })
        }}
        >
          <p>{filtro}</p>
          <span >X</span>
        </div>
      ))}
      {Object.keys(filtros).length > 0 && (
      <div className="remove" onClick={()=> {
        setFiltros({})
        document.querySelectorAll('.choosen').forEach((element) => {
          element.classList.remove('choosen')
        })
      }}>
        Eliminar todo
      </div>)}
    </div>
    <div className="filterOptions">
      {filters.map((filter, index) => (
        <Filter filter={filter} setFiltros={setFiltros} index={index} key={index}/>))
      }
    </div>
  </div>
  </>)
}