/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SideInfo from '../../components/sideInfo.jsx'
import Footer from '../../components/footer.jsx'
import Header from '../../components/header.jsx'
import { useEffect, useState, useRef, useContext } from 'react'
import { cambiarEspacioAGuiones, cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { MakeCard, MakeCollectionCard, MakeOneFrCard, MakeUserCard } from '../../assets/makeCard.jsx'
import useBotonSelect from '../../assets/botonSelect.jsx'
import DoubleSlider from '../../components/DoubleSlider.jsx'
import { ToastContainer } from 'react-toastify'
import { edad, estado, generos, idiomas, tapa, ubicaciones } from '../../assets/categorias.js'
import { UserContext } from '../../context/userContext.jsx'
export default function Search () {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)

  const [params] = useSearchParams()

  const queryParams = {
    categoria: params.get('categoria'),
    estado: params.get('estado'),
    ubicacion: params.get('bicacion'),
    edad: params.get('edad'),
    tapa: params.get('tapa'),
    fechaPublicacion: params.get('fechaPublicacion'),
    idioma: params.get('idioma')
  }
  const query = cambiarGuionesAEspacio(params.get('q'))
  const sk = cambiarGuionesAEspacio(params.get('sk') || 'books')
  // Si no hay q devolver a la pestaña de inicio
  useEffect(() => {
    if (!query) window.location.href = window.location.origin
  }, [query])

  const [results, setResults] = useState([])

  // Fetch de la query
  useEffect(() => {
    async function fetchResults () {
      try {
        // Verificamos que la query no esté vacía o sea solo espacios
        // Si hay un filtro no empleamos esta funcion
        if (query && query.trim() && Object.values(queryParams).every(val => !val)) {
          const validKinds = ['books', 'collections', 'users'];
          const searchKind = validKinds.includes(sk) ? sk : 'books';
          const response = await fetch(`http://localhost:3030/api/${searchKind}/query?q=${query}`, {
            method: 'GET',
            credentials: 'include' // Enviar las cookies
          })

          if (response.ok) {
            const data = await response.json()
            setResults(data) // Establece los resultados en el estado
          } else {
            console.error('Failed to fetch book data:', response.statusText)
          }
        }
      } catch (error) {
        console.error('Error fetching book data:', error)
      }
    }

    fetchResults() // Llama a la función para obtener los resultados
  }, [query]) // Ejecuta cada vez que 'query' cambie

  useEffect(() => {
    async function fetchFilters () {
      // Return early if no valid query or filter parameters are available
      if (!query || Object.values(queryParams).every(val => !val)) return

      // Create the URL search parameters object
      const searchParams = new URLSearchParams()
      searchParams.append('q', query)

      // Add valid filters to searchParams
      Object.entries(queryParams).forEach(([param, value]) => {
        if (value) { // Only add filters with a truthy value
          searchParams.append(param, value)
        }
      })
      const validKinds = ['books', 'collections', 'users'];
      const searchKind = validKinds.includes(sk) ? sk : 'books';
      // Construct the full URL
      const url = `http://localhost:3030/api/${searchKind}/query/filters?${searchParams.toString()}`

      try {
        const response = await fetch(url)
        const data = await response.json()

        if (data.error) {
          console.error(data.error)
          return
        }

        setResults(data.books || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchFilters()
  }, [params, query]) // Ensure `queryParams` is also included in the dependencies

  const [currentPage, setCurrentPage] = useState(1)
  const [grid, setGrid] = useState(localStorage.getItem('grid') || '1fr 1fr 1fr 1fr')
  const pageCount = Math.ceil(results.length / 24)

  const optionalSpace = (results.length % 2 === 1) ? <div /> : <></>

  const reducirPagina = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const aumentarPagina = () => {
    if (currentPage < pageCount) {
      setCurrentPage(currentPage + 1)
    }
  }

  const renderizarResultados = () => {
    return results.slice((currentPage - 1) * 24, currentPage * 24)
  }

  useEffect(() => {
    const updateGrid = () => {
      if (grid.split(' ').length !== 1) setGrid((window.innerWidth >= 834) ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)')
      else setGrid('1fr')
    }
    updateGrid() // Initial check
    window.addEventListener('resize', updateGrid)
    return () => window.removeEventListener('resize', updateGrid)
  }, [grid])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  // filtros

  const [filtros, setFiltros] = useState({})
  const [filtersOpen, setFiltersOpen] = useState(true)

  // Handle filter changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFiltros((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  // Add filter to query
  const agregarAQuery = (formas, forma, results, setResults) => {
    if (forma !== formas[0]) {
      const categoria = formas[0]
      setResults((prevResults) => ({
        ...prevResults,
        [categoria]: cambiarEspacioAGuiones(forma)
      }))
    } else {
      console.error('Forma seleccionada no existe en el objeto formas.')
    }
  }

  // Apply filters and redirect
  const aplicarFiltros = () => {
    console.log(filtros)
    // Construye el query string de filtros
    const filtersQuery = Object.entries(filtros)
      .filter(([_, value]) => value) // Solo incluye filtros con valores no vacíos
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    // Construye la query principal
    const baseQuery = cambiarEspacioAGuiones(query || '')
    const fullQuery = `q=${baseQuery}${filtersQuery ? `&${filtersQuery}` : ''}`

    // Navega a la nueva URL
    navigate(`/buscar?${fullQuery}`)
  }

  // Sorting options
  const ordenarFormas = {
    Seleccionar: true,
    'Menor Precio': (a, b) => a.precio - b.precio,
    'Mayor Precio': (a, b) => b.precio - a.precio
  }

  // Sort selected projects
  const selectedProyectos = (formas, forma, results, setResults) => {
    if (formas[forma]) {
      const sortedData = [...results].sort(formas[forma])
      setResults(sortedData)
    }
  }

  // Props for sorting dropdown
  const selectedOrdenarProps = {
    formas: ordenarFormas,
    results,
    setResults,
    ancho: '150px',
    callback: selectedProyectos
  }

  // Language filter setup
  const idioma = [
    'Idioma',
    ...idiomas.sort((a, b) => {
      const priority = ['Inglés', 'Español']
      if (priority.includes(a) || priority.includes(b)) return 1
      return a.localeCompare(b)
    })
  ]

  // Filter props configuration
  const configuracionFiltros = (ancho) => ({
    results: filtros,
    setResults: setFiltros,
    ancho,
    callback: agregarAQuery
  })

  // Filter categories setup
  const filterCategories = {
    idioma: { formas: idioma, ...configuracionFiltros('15vw') },
    ubicacion: { formas: ['ubicacion', ...ubicaciones], ...configuracionFiltros('15vw') },
    categoria: { formas: ['genero', ...generos.sort((a, b) => a.localeCompare(b))], ...configuracionFiltros('15vw') },
    estado: { formas: ['estado', ...estado], ...configuracionFiltros('15vw') },
    edad: { formas: ['edad', ...edad], ...configuracionFiltros('15vw') },
    fechaPublicacion: {
      formas: [
        'Fecha de publicación',
        'Menos de un mes',
        'Menos de un año'
      ],
      ...configuracionFiltros('15vw')
    },
    tapa: { formas: ['tapa', ...tapa], ...configuracionFiltros('15vw') }
  }

  // Handle filter toggle
  const handleOpenFilters = () => {
    const arrow = document.querySelector('.flecha')
    const resultadosYMasFiltros = document.querySelector('.resultadosYMasFiltros')
    const masFiltros = document.querySelector('.masFiltros')
    const phoneBreakPoint = window.innerWidth >= 600

    if (filtersOpen) {
      // Close filters
      arrow.style.left = '-7rem'
      masFiltros.style.transform = 'translateX(-20vw)'
      arrow.querySelector('svg').style.transform = 'rotate(0deg)'
      if (phoneBreakPoint) {
        resultadosYMasFiltros.style.transform = 'translateX(calc(-20vw + 10vw))'
        resultadosYMasFiltros.style.width = '100vw'
      }
    } else {
      // Open filters
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

  // Initialize filters on mount
  useEffect(() => {
    handleOpenFilters()
  }, [])
  function updateQuery(sk) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('sk', sk); // Agrega o actualiza la query 'sk'
    window.location.href = currentUrl.toString(); // Redirige a la nueva URL
  }

  const renderCard = (item, index) => {
    if (!user || !item || !item?._id) return
    console.log(user._id)
    console.log(item._id)
    switch (sk) {
      case 'books': {
        if (grid.split(' ').length !== 1) {
          return <MakeCard key={index} element={item} user={user || {}}/> // Tarjeta de libros
        }
        else return <MakeOneFrCard key={index} element={item} user={user || {}}/> // Tarjeta de usuarios
      }
      case 'collections':
        return <MakeCollectionCard key={index} element={item} user={user || {}}/> // Tarjeta de colecciones
      case 'users': 
        return <MakeUserCard  key={index} element={item} user={user || {}} setUser={setUser}/>
      default:
        return <MakeCard key={index} element={item} user={user || ''}/> // Tarjeta de libros
    }
  }
  return (
    <>
      <Header />
      <div><h1>Resultados</h1></div>
      <div className='flecha' onClick={handleOpenFilters}>
        Filtrar
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={25} height={25} color='#000000' fill='none'>
          <path d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </div>
      <hr className='noMargen' />

      <div className='resultadosContainer'>

        <div className='masFiltros'>

          <h3>Filtrar por:</h3>
          <div>{useBotonSelect(filterCategories.categoria)}</div>
          <div>{useBotonSelect(filterCategories.estado)}</div>
          <div>{useBotonSelect(filterCategories.ubicacion)}</div>

          <div>{useBotonSelect(filterCategories.edad)}</div>
          <div>{useBotonSelect(filterCategories.tapa)}</div>
          <div>{useBotonSelect(filterCategories.fechaPublicacion)}</div>
          <div>{useBotonSelect(filterCategories.idioma)}</div>
          <button className='aplicarFiltros' onClick={aplicarFiltros}>Aplicar</button>
        </div>

        <div className='resultadosYMasFiltros'>
              <div className='setSearchKind'>
        <div onClick={()=>updateQuery('users')}>Usuarios</div>
        <div onClick={()=>updateQuery('books')}>Libros</div>
        <div onClick={()=>updateQuery('collections')}>Colecciones</div>
      </div>
          <div className='separar'>
            <h2>{results.length} resultados</h2>
            <div className='flex'>
              { sk === 'books' && <div className='layout'><svg
                onClick={() => {
                  setGrid('1fr')
                  localStorage.setItem('grid', '1fr')
                }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'><path d='M20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28248 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28248 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M21.5 8.5L2.5 8.5' stroke='currentColor' strokeWidth='1.5' /><path d='M21.5 15.5L2.5 15.5' stroke='currentColor' strokeWidth='1.5' />
              </svg>
              </div>}
              <div className='layout'><svg
                onClick={() => {
                  setGrid('1fr 1fr 1fr 1fr')
                  localStorage.setItem('grid', '1fr 1fr 1fr 1fr')
                }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'
                                      ><path d='M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z' stroke='currentColor' strokeWidth='1.5' /><path d='M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z' stroke='currentColor' strokeWidth='1.5' /><path d='M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z' stroke='currentColor' strokeWidth='1.5' /><path d='M14 6C14 4.45956 14 3.68934 14.3467 3.12353C14.5407 2.80693 14.8069 2.54074 15.1235 2.34673C15.6893 2 16.4596 2 18 2C19.5404 2 20.3107 2 20.8765 2.34673C21.1931 2.54074 21.4593 2.80693 21.6533 3.12353C22 3.68934 22 4.45956 22 6C22 7.54044 22 8.31066 21.6533 8.87647C21.4593 9.19307 21.1931 9.45926 20.8765 9.65327C20.3107 10 19.5404 10 18 10C16.4596 10 15.6893 10 15.1235 9.65327C14.8069 9.45926 14.5407 9.19307 14.3467 8.87647C14 8.31066 14 7.54044 14 6Z' stroke='currentColor' strokeWidth='1.5' />
              </svg>
              </div>
              {/* <div className="layout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}><path d="M20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /><path d="M15.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /></svg></div> */}
              <div className='flex'>Ordenar por{useBotonSelect(selectedOrdenarProps)}</div>
            </div>
          </div>

          <div className='numberPages separador' style={{ display: (pageCount === 1) ? 'none' : 'flex' }}>
            {results.length === 0
              ? <h2>No hay resultados</h2>

              : <p>
                <span onClick={reducirPagina} style={{ filter: (currentPage === 1) ? 'opacity(0.2)' : 'none' }}>{'< '}</span>
                {Array.from({ length: pageCount }, (_, i) => (
                  <span key={i} onClick={() => setCurrentPage(i + 1)} style={{ fontWeight: (i + 1 === currentPage) ? '700' : '' }}>{i + 1}  </span>
                ))}
                <span onClick={aumentarPagina} style={{ filter: (currentPage === pageCount) ? 'opacity(0.2)' : 'none' }}>{' >'}</span>
                </p>}
          </div>
          <div className='resultados sectionsContainer' style={{ display: 'grid', gridTemplateColumns: grid }}>

            {renderizarResultados().map((element, index) => renderCard(element, index)/*(grid.split(' ').length !== 1)
              ? user ? <MakeCard element={element} index={index} user={user} /> : <MakeCard element={element} index={index} />
              : user ? <MakeOneFrCard element={element} index={index} user={user} /> : <MakeOneFrCard element={element} index={index} />*/)}
            {optionalSpace}
          </div>
          <div className='numberPages separador' style={{ display: (pageCount === 1) ? 'none' : 'flex' }}>
            {results.length !== 0 &&
              <p>
                <span onClick={reducirPagina} style={{ filter: (currentPage === 1) ? 'opacity(0.2)' : 'none' }}>{'< '}</span>
                {Array.from({ length: pageCount }, (_, i) => (
                  <span key={i} onClick={() => setCurrentPage(i + 1)} style={{ fontWeight: (i + 1 === currentPage) ? '700' : '' }}>{i + 1}  </span>
                ))}
                <span onClick={aumentarPagina} style={{ filter: (currentPage === pageCount) ? 'opacity(0.2)' : 'none' }}>{' >'}</span>
              </p>}
          </div>
        </div>
      </div>
      <ToastContainer position='top-center' autoClose={5000} hideProgressBar={false} pauseOnHover={false} closeOnClick theme='light'/>
      <SideInfo />
      <Footer />
    </>
  )
}
