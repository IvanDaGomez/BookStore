import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer'
import Header from '../../components/header'
import SideInfo from '../../components/sideInfo'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCard, MakeOneFrCard } from '../../assets/makeCard'

export default function Fyp () {
  const [user, setUser] = useState(null)

  useEffect(() => {
    async function fetchUser () {
      try {
        const response = await fetch('http://localhost:3030/api/users/userSession', {
          method: 'POST',
          credentials: 'include' // Asegúrate de enviar las cookies
        })
        if (response.ok) {
          const data = await response.json()
          setUser(data.user) // Establece el usuario en el estado
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    };

    fetchUser() // Llama a la función para obtener el usuario
  }, []) // Dependencias vacías para ejecutar solo una vez al montar el componente

  const [books, setBooks] = useState([])
  const [grid, setGrid] = useState(/* localStorage.getItem("grid")|| */'1fr')
  useEffect(() => {
    async function fetchFYP () {
      try {
        const url = 'http://localhost:3030/api/books/fyp?l=24'
        const response = await axios.get(url, { withCredentials: true })

        if (response.data.ok) {
          setBooks(response.data.books)
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchFYP()
  }, [])
  return (
    <>
      <Header />
      <div className='booksFyp'>

        <div className='resultados sectionsContainer' style={{ display: 'grid', gridTemplateColumns: grid }}>

          {books.length && books.map((element, index) => (grid.split(' ').length !== 1)
            ? user ? <MakeCard element={element} index={index} user={user} /> : <MakeCard element={element} index={index} />
            : user ? <MakeOneFrCard element={element} index={index} user={user} /> : <MakeOneFrCard element={element} index={index} />)}
        </div>
        {/* Infinite loader */}
      </div>

      <Footer />
      <SideInfo />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
    </>
  )
}
