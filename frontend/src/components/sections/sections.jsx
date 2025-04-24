import { useContext, useState } from 'react'
import { MakeCard, MakeCardPlaceHolder } from '../../assets/makeCard'

import { UserContext } from '../../context/userContext'
import useFetchBooksByQuery from '../../assets/useFetchBooksByQuery'
import './sections.css'
import { Link } from 'react-router-dom'
import { cambiarEspacioAGuiones } from '../../assets/agregarMas'
// eslint-disable-next-line react/prop-types
export default function Sections ({ filter, backgroundColor, description }) {

  const { user } = useContext(UserContext)
  const [libros] = useFetchBooksByQuery(filter)

  return (
    <>
      <div className='sectionsBigContainer' style={{ backgroundColor}}>

        <h1>{filter}</h1>
        <h2>{description}</h2>
        <div className='sectionsContainer'>
          {libros && libros.length !== 0 ? libros.map((element, index) => 
          <MakeCard key={index} element={element} index={index} user={user ?? null} /> 
          )
          :<MakeCardPlaceHolder l={6} />}
          
            <div className='viewMore'>
              <Link to={`/buscar?q=${cambiarEspacioAGuiones(filter)}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" /><path d="M16 12L8 12M16 12C16 12.7002 14.0057 14.0085 13.5 14.5M16 12C16 11.2998 14.0057 9.99153 13.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span>Ver más</span>
              </Link>
            </div>

        </div>
      </div>
    </>
  )
}
