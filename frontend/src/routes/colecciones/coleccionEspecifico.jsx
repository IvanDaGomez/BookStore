import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer'
import Header from '../../components/header'
import SideInfo from '../../components/sideInfo'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import axios from 'axios'
import { MakeCard } from '../../assets/makeCard'
import { UserContext } from '../../context/userContext.jsx'

export default function ColeccionEspecificoPage () {
  const { user, loading } = useContext(UserContext)
  const [books, setBooks] = useState([])
  const { collectionId } = useParams()
  useEffect(() => {
    async function fetchCollection () {
      if (!collectionId) return
      const url = 'http://localhost:3030/api/collections/getBooksByCollection' + collectionId
      try {
        const response = axios.get(url)
        if (response.data) {
          setBooks((await response).data.data)
        }
      } catch {
        console.error('Error')
      }
    }
    fetchCollection()
  }, [collectionId])
  if (loading) {
    return <p>Cargando...</p>
  }
  return (
    <>
      <Header />
      {console.log('User:', user)}
      <div className='coleccionesContainer'>
        {books.map((book, index) => (<MakeCard key={index} element={book} index={index} user={user || ''} />))}
      </div>
      <Footer />
      <SideInfo />
      <ToastContainer position='top-center' autoClose={5000} hideProgressBar={false} pauseOnHover={false} closeOnClick theme='light' />
    </>
  )
}
