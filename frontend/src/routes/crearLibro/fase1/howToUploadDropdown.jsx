import { useEffect, useState } from "react"

export default function HowToUploadDropdown () {
  const [dropdown, setDropdown] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.style.overflowY = dropdown ? 'hidden' : 'scroll'
  }, [dropdown])
  return (<>
  <p className='uploadHint letraAcento' onClick={() => setDropdown(!dropdown)}>¿Como subir tu libro?</p>
  {dropdown && 
            <div className='dropdownBackground' >
            <div className='dropdown'>
              <div className='flex'>
                <h2>Recomendaciones para subir un libro</h2>
                <svg
                  xmlns='http://www.w3.org/2000/svg' onClick={() => {
                    setDropdown(!dropdown)
                  }} viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'
                >
                  <path d='M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
              </div>
              <p>Toma tu foto con buena luz y colócala en fondo blanco</p>
              <img src='/subir.png' alt='¿Como subir tus libros?' />
            </div>
  
          </div>}

  </>)
}