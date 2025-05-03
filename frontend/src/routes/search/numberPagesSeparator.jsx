/* eslint-disable react/prop-types */
import { useState } from "react"

export default function NumberPagesSeparator ({ results, currentPage, setCurrentPage }){
  const [pageCount] = useState(Math.ceil(results.length / 24))


    const reducirPagina = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    }
  
    const aumentarPagina = () => {
      if (currentPage < pageCount) {
        setCurrentPage(currentPage + 1)
      }
    }
  return (<>
  {pageCount > 1 &&
  <div className='numberPages separador'>
      <p>
        <span onClick={reducirPagina} style={{ filter: (currentPage === 1) ? 'opacity(0.2)' : 'none' }}>{'< '}</span>
        {Array.from({ length: pageCount }, (_, i) => (
          <span key={i} onClick={() => setCurrentPage(i + 1)} style={{ fontWeight: (i + 1 === currentPage) ? '700' : '' }}>{i + 1}  </span>
        ))}
        <span onClick={aumentarPagina} style={{ filter: (currentPage === pageCount) ? 'opacity(0.2)' : 'none' }}>{' >'}</span>
      </p>
  </div>
  }
  </>)
}