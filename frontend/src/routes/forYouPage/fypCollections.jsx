import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header'
import SideInfo from '../../components/sideInfo'
import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { MakeCollectionCard } from '../../assets/makeCard'
import { UserContext } from '../../context/userContext'

export default function Fyp () {
  const { user } = useContext(UserContext)

  const [collections, setCollections] = useState([])
  useEffect(() => {
    async function fetchFYP () {
      try {
        const url = 'http://localhost:3030/api/collections/fyp?l=24'
        const response = await axios.get(url, { withCredentials: true })
        setCollections(response.data)
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
          const lastCollection = collections[collections.length - 1]
          const url = `http://localhost:3030/api/collections/fyp?l=24&last=${lastCollection._id}`
          axios.get(url, { withCredentials: true })
            .then((response) => {
              // If the  materialcollection is already in the list, don't add it again
            // const newCollections = response.data.filter(collection => 
            //   !collections.some(existingCollection => existingCollection._id === collection._id) // Check if collection is already in the list
            // )
            //  setCollections((prevCollections) => [...prevCollections, ...newCollections])
            setCollections((prevCollections) => [...prevCollections, ...response.data])
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
  }, [collections])
  return (
    <>
      <Header />
      <div className='collectionsFyp'>
          {(collections.length)
            ? collections.map((element, index) => (
            <MakeCollectionCard element={element} index={index} key={index} user={user ?? ''} wordLimit={40} /> 
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
