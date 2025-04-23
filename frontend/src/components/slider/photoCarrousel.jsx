/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react'
import { getWidth } from '../../assets/getWidth.js'
import './photoCarrousel.css'
export const Carousel = ({ data }) => {
  const [slide, setSlide] = useState(0)
  const [width] = useState(getWidth())
  const viewRef = useRef(null)
  
  const nextSlide = () => {
    if (slide === data.length - 1) {
      // Si es la ultima mandar a 0 la traslación
      viewRef.current.style.transform = `translateX(0px)`
      setSlide(0)
    }
    else {
      // Si no es la ultima, entonces trasladar a las izquierda(por lo tanto sale lo de la derecha)
      viewRef.current.style.transform = `translateX(-${width * (slide + 1)}px)`
      setSlide(slide + 1)
    }
  }

  const prevSlide = () => {
    if (slide === 0) {
      // Si es la primera, enviar a la última que sería el ancho x la cantidad de elementos
      viewRef.current.style.transform = `translateX(-${width * (data.length - 1)}px)`
      setSlide(data.length - 1)
    }
    else {
      // Si no es la primera reducir por 1 el ancho x 100vw
      viewRef.current.style.transform = `translateX(-${width * (slide - 1)}px)`
      setSlide(slide - 1)
    }
  }
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 3000) 
    return () => clearInterval(interval)

  }, [slide])
  return (
    <div className='carousel'>
      {/* Flecha izquierda */}
      <div className='arrow arrow-left' onClick={prevSlide}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={32} height={32} color='#fff' fill='none'><path d='M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
      </div>
      {/* Contenido */}
      <div className="view" ref={viewRef} style={{ width: `${data.length * width}px` }}>

        {data.map((item, idx) => {
          return (
            <div className='slide' style={{ backgroundImage: `url(${item.photo})`, width: width }} key={idx}></div>
          )
        })}
      </div>
      {/* Flecha derecha */}
      <div className='arrow arrow-right' onClick={nextSlide} style={{ transform: (document.body.scrollHeight > document.body.clientHeight) ? 'translateX(-2rem)' : 'none' }}>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={32} height={32} color='#fff' fill='none'><path d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
      </div>
      {/* Puntitos de abajo */}
      <span className='indicators'>
        {data.map((_, idx) => {
          return (
            <button
              key={idx}
              className={
                slide === idx ? 'indicator' : 'indicator indicator-inactive'
              }
              onClick={() => setSlide(idx)}
            />
          )
        })}
      </span>
    </div>
  )
}
