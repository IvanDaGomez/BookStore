import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header'
import SideInfo from '../../components/sideInfo'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCard } from '../../assets/makeCard'
import { UserContext } from '../../context/userContext'
import './fyp.css'
import { BACKEND_URL } from '../../assets/config.js'
export default function Fyp () {
  const { user } = useContext(UserContext)

  const [books, setBooks] = useState([])
  useEffect(() => {
    async function fetchFYP () {
      try {
        const url = `${BACKEND_URL}/api/books/fyp?l=24`
        const response = await axios.get(url, { withCredentials: true })
        setBooks(response.data)
      } catch (error) {
        console.error('Error:', error)
      }
    }
    fetchFYP()
  }, [])

  useEffect(() => {
    const infiniteLoader = document.querySelector('#infiniteLoader')
    const options = {
      root: document.querySelector("#scrollArea"),
      rootMargin: "0px",
      threshold: 1.0,
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lastBook = books[books.length - 1]
          const url = `${BACKEND_URL}/api/books/fyp?l=24&last=${lastBook.id}`
          axios.get(url, { withCredentials: true })
            .then((response) => {
              // If the  materialbook is already in the list, don't add it again
            // const newBooks = response.data.filter(book => 
            //   !books.some(existingBook => existingBook.id === book.id) // Check if book is already in the list
            // )
            //  setBooks((prevBooks) => [...prevBooks, ...newBooks])
            setBooks((prevBooks) => [...prevBooks, ...response.data])
            })
            .catch((error) => {
              console.error('Error:', error)
            })
        }
      })
    }
    , options)
    if (infiniteLoader) {
      observer.observe(infiniteLoader)
    }
    return () => {
      if (infiniteLoader) {
        observer.unobserve(infiniteLoader)
      }
    }
  }, [books])
  return (
    <>
      <Header />
      <div className='booksFyp'>
          {(books.length)
            ? books.map((element, index) => (
            <MakeCard element={element} index={index} key={index} user={user ?? ''} wordLimit={40} /> 
          )):
          Array.from({ length: 24 }).map((_, index) => (
            <div className='sectionElement placeholder' key={index} >
              <div className='imageElementContainer'/>
              <div className='sectionElementTextDiv'/>
              <div className='textPlaceholder'/>
              <div className='textPlaceholder'/>

              </div>
          ))} 
        {/* Infinite loader */}
        <div id='infiniteLoader' className='infiniteLoader'/>
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
