/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCollectionCard } from '../../assets/makeCard'
export default function Colecciones ({ user }) {
  const [colecciones, setColecciones] = useState([])
  const [openNewCollection, setOpenNewCollection] = useState(false)
  useEffect(() => {
    async function fetchColecciones () {
      try {
        if (!user) return
        const url = 'http://localhost:3030/api/users/getCollectionsByUser/' + user._id
        const response = axios.get(url)
        if (response.data) {
          setColecciones(response.data.colecciones)
        }
      } catch {
        console.error('Error')
      }
    }
    fetchColecciones()
  }, [user])
  return (
    <>
      <button className='newCollection' onClick={() => setOpenNewCollection(!openNewCollection)}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
          <path d='M12 8V16M16 12L8 12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          <path d='M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z' stroke='currentColor' strokeWidth='1.5' />
        </svg>Crear nueva colección
      </button>
      {colecciones.length !== 0 && colecciones.map((coleccion, index) => (
        <MakeCollectionCard key={index} element={coleccion} index={index} user={user || ''} />
      ))}
    </>
  )
}
