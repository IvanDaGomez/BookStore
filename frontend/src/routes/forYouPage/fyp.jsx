import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header'
import SideInfo from '../../components/sideInfo'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCard, MakeOneFrCard } from '../../assets/makeCard'
import { UserContext } from '../../context/userContext'

export default function Fyp () {
  const { user } = useContext(UserContext)

  const [books, setBooks] = useState([])
  const [grid, setGrid] = useState(/* localStorage.getItem("grid")|| */'1fr')
  useEffect(() => {
    async function fetchFYP () {
      try {
        const url = 'http://localhost:3030/api/books/fyp?l=24'
        const response = await axios.get(url, { withCredentials: true })
        setBooks(response.data)
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
