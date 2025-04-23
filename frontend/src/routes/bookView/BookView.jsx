import { useParams } from 'react-router'
import { useState, useEffect, useContext } from 'react'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import Footer from '../../components/footer'
import ErrorPage from '../../components/errorPage/errorPage.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UserContext } from '../../context/userContext.jsx'
import './bookView.css'
import useFetchActualBook from './useFetchActualBook.js'
import useHandleHashChange from './handleHashChange.js'
import ImagesCell from './imagesCell.jsx'
import SagaLibros from './sagaLibros.jsx'
import RelatedBooks from './relatedBooks.jsx'
import InfoContainer from './infoContainer.jsx'
import BuyContainer from './buyContainer.jsx'
import QuestionsBookView from './questionsBookView.jsx'
export default function BookView () {
  const { bookId } = useParams()
  
  const [actualImage, setActualImage] = useState('')
  const { libro, loading, error } = useFetchActualBook(bookId, setActualImage)
 

  const { user } = useContext(UserContext)

  useEffect(()=>{
    if (window.location.href.includes('#')) {
      window.location.hash = '#comments'
    }
  },[])


  useHandleHashChange()

  if (loading) {
    return <><Header/><Footer/></>
  }
  if (error) {
    return <ErrorPage />
  }


  return (
    <>

      <Header />
      <div className='bookViewContainer'>
        {/* <div className='anuncio' /> */}
        <div className='libroContenedor'>
          <ImagesCell
          libro={libro}
          setActualImage={setActualImage}
          actualImage={actualImage}
          />

          <InfoContainer libro={libro}/>

          <BuyContainer libro={libro} user={user}/>

        </div>
        <div className='extraBookViewContainer'>

          <QuestionsBookView libro={libro}/>
          <SagaLibros
          libro={libro}
          user={user}
          />
          <div className='description'>
            <h1>Descripción</h1>
            <p>{libro.descripcion}</p>
          </div>

          <RelatedBooks
          libro={libro}
          user={user}
          />
        </div>
      </div>
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
      <SideInfo />
      <Footer />
    </>
  )
}
