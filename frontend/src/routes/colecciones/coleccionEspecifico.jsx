/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import SideInfo from '../../components/sideInfo.jsx'
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import { useEffect, useState, useRef, useContext } from 'react'
import { cambiarGuionesAEspacio } from '../../assets/agregarMas.js'
import { MakeCard, MakeCollectionCard, MakeOneFrCard, MakeUserCard } from '../../assets/makeCard.jsx'

import { ToastContainer } from 'react-toastify'
import { UserContext } from '../../context/userContext.jsx'
import '../search/search.css'

import NumberPagesSeparator from '../search/numberPagesSeparator.jsx'
import Filters from '../search/filters.jsx'
import SelectButton from '../search/selectButton.jsx'
import axios from 'axios'
import './coleccionEspecifico.css'
import { renderProfilePhoto } from '../../assets/renderProfilePhoto.js'
import { BACKEND_URL } from '../../assets/config.js'
export default function Search () {
  const { user, setUser } = useContext(UserContext)

  const params = useParams()

  const collectionId = params.collectionId
  const [collection, setCollection] = useState(null)
  const [results, setResults] = useState([])
  useEffect(()=> {
    async function fetchCollection () {
      try {
        const url = `${BACKEND_URL}/api/collections/getCollectionById/${collectionId}`
        const response = await axios.get(url, { withCredentials: true })
        setCollection(response.data)
        const booksUrl = `${BACKEND_URL}/api/books/idList/${response.data.libros_ids.join(',')}`
        const booksResponse = await axios.get(booksUrl, { withCredentials: true })
        if (response.data.error) {
          console.error('Error en el servidor:', response.data.error)
          return
        }
        setResults(booksResponse.data)
      } catch (error) {
        console.error('Error fetching collection:', error)
      }
    }
    fetchCollection()
  },[collectionId])
 
  const [currentPage, setCurrentPage] = useState(1)
  const [alignment, setAlignment] = useState(localStorage.getItem('alignment') || 'one')

  const renderizarResultados = () => {
    return results.slice((currentPage - 1) * 24, currentPage * 24)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])


  function updateQuery(sk) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('sk', sk); // Agrega o actualiza la query 'sk'
    window.location.href = currentUrl.toString(); // Redirige a la nueva URL
  }

  const renderCard = (item, index) => {
    if (!item || !item?.id) return
    if (alignment === 'many') {
      return <MakeCard key={index} element={item} user={user ?? null}/> // Tarjeta de libros
    }
    else return <MakeOneFrCard  key={index} element={item} user={user ?? null}/> // Tarjeta de usuarios
  
  }
  const [sortFilter] = useState({
    name: 'Ordenar por',
    values: ['Menor Precio', 'Mayor Precio', 'Alfabético', 'Fecha de Publicación']
  })
  const handleSort = (e) =>{
    document.querySelectorAll('.choosen').forEach((el) => {
      el.classList.remove('choosen')
    })
    switch (e.target.innerText) {
      case 'Menor Precio':
        setResults((prevResults) => [...prevResults].sort((a, b) => a.precio - b.precio))
        break
      case 'Mayor Precio':
        setResults((prevResults) => [...prevResults].sort((a, b) => b.precio - a.precio))
        break
      case 'Alfabético':
        setResults((prevResults) => [...prevResults].sort((a, b) => a.titulo.localeCompare(b.titulo)))
        break
      case 'Fecha de Publicación':
        console.log('results', results)
        setResults((prevResults) => [...prevResults].sort((a, b) => 
          new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion)))
        break
    }
    e.target.classList.add('choosen')
  }
  return (
    <>
      <Header />
      {/* <div><h1>Resultados</h1></div> */}
      {/* <hr className='noMargen' /> */}
      <div className="collectionSpecificTitle"
      style={{backgroundImage: `url(${ collection && renderProfilePhoto(collection.foto)})`}}
      >
      <h1>{collection && collection.nombre}</h1>
      </div>
      <div className='resultadosContainer'>
        <div className='separar'>

            <h2>{results.length} resultados</h2>
            <div className='flex'>
              <div className='layout'><svg
                onClick={() => {setAlignment('one');localStorage.setItem('alignment', 'one')}} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'><path d='M20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28248 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28248 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M21.5 8.5L2.5 8.5' stroke='currentColor' strokeWidth='1.5' /><path d='M21.5 15.5L2.5 15.5' stroke='currentColor' strokeWidth='1.5' />
              </svg>
              </div>
              <div className='layout'><svg
                onClick={() => {setAlignment('many');localStorage.setItem('alignment', 'many')}} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'><path d='M2 18C2 16.4596 2 15.6893 2.34673 15.1235C2.54074 14.8069 2.80693 14.5407 3.12353 14.3467C3.68934 14 4.45956 14 6 14C7.54044 14 8.31066 14 8.87647 14.3467C9.19307 14.5407 9.45926 14.8069 9.65327 15.1235C10 15.6893 10 16.4596 10 18C10 19.5404 10 20.3107 9.65327 20.8765C9.45926 21.1931 9.19307 21.4593 8.87647 21.6533C8.31066 22 7.54044 22 6 22C4.45956 22 3.68934 22 3.12353 21.6533C2.80693 21.4593 2.54074 21.1931 2.34673 20.8765C2 20.3107 2 19.5404 2 18Z' stroke='currentColor' strokeWidth='1.5' /><path d='M14 18C14 16.4596 14 15.6893 14.3467 15.1235C14.5407 14.8069 14.8069 14.5407 15.1235 14.3467C15.6893 14 16.4596 14 18 14C19.5404 14 20.3107 14 20.8765 14.3467C21.1931 14.5407 21.4593 14.8069 21.6533 15.1235C22 15.6893 22 16.4596 22 18C22 19.5404 22 20.3107 21.6533 20.8765C21.4593 21.1931 21.1931 21.4593 20.8765 21.6533C20.3107 22 19.5404 22 18 22C16.4596 22 15.6893 22 15.1235 21.6533C14.8069 21.4593 14.5407 21.1931 14.3467 20.8765C14 20.3107 14 19.5404 14 18Z' stroke='currentColor' strokeWidth='1.5' /><path d='M2 6C2 4.45956 2 3.68934 2.34673 3.12353C2.54074 2.80693 2.80693 2.54074 3.12353 2.34673C3.68934 2 4.45956 2 6 2C7.54044 2 8.31066 2 8.87647 2.34673C9.19307 2.54074 9.45926 2.80693 9.65327 3.12353C10 3.68934 10 4.45956 10 6C10 7.54044 10 8.31066 9.65327 8.87647C9.45926 9.19307 9.19307 9.45926 8.87647 9.65327C8.31066 10 7.54044 10 6 10C4.45956 10 3.68934 10 3.12353 9.65327C2.80693 9.45926 2.54074 9.19307 2.34673 8.87647C2 8.31066 2 7.54044 2 6Z' stroke='currentColor' strokeWidth='1.5' /><path d='M14 6C14 4.45956 14 3.68934 14.3467 3.12353C14.5407 2.80693 14.8069 2.54074 15.1235 2.34673C15.6893 2 16.4596 2 18 2C19.5404 2 20.3107 2 20.8765 2.34673C21.1931 2.54074 21.4593 2.80693 21.6533 3.12353C22 3.68934 22 4.45956 22 6C22 7.54044 22 8.31066 21.6533 8.87647C21.4593 9.19307 21.1931 9.45926 20.8765 9.65327C20.3107 10 19.5404 10 18 10C16.4596 10 15.6893 10 15.1235 9.65327C14.8069 9.45926 14.5407 9.19307 14.3467 8.87647C14 8.31066 14 7.54044 14 6Z' stroke='currentColor' strokeWidth='1.5' />
              </svg>
              </div>
              {/* <div className="layout"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}><path d="M20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M8.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /><path d="M15.5 2.5V21.5" stroke="currentColor" strokeWidth="1.5" /></svg></div> */}
              <div className='flex' >Ordenar por <SelectButton callback={handleSort} filter={sortFilter} index={1} /></div>{/*Index 100 to make it below the other selectbuttons */}
          </div>
        </div>
        
        <NumberPagesSeparator results={results} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <div className='resultados sectionsContainer booksFyp'>
          {renderizarResultados()
          .map((element, index) => renderCard(element, index))
          .sort((a, b) => {
            if (a.props.element.disponibilidad === 'Disponible' && b.props.element.disponibilidad !== 'Disponible') {
              return -1; // a va antes
            } else if (a.props.element.disponibilidad !== 'Disponible' && b.props.element.disponibilidad === 'Disponible') {
              return 1; // b va antes
            }
            return 0; // mantén el orden original
          }) 
          }{/* Sort by disponibilidad */}
        </div>
        <NumberPagesSeparator results={results} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>

      <ToastContainer position='top-center' autoClose={5000} hideProgressBar={false} pauseOnHover={false} closeOnClick theme='light'/>
      <SideInfo />
      <Footer />
    </>
  )
}
