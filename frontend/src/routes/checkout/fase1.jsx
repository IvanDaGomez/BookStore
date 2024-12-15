import { useEffect } from 'react'
import { MakeOneFrCard } from '../../assets/makeCard'
/* eslint-disable react/prop-types */
function Fase1 ({ form, setForm, setFase, libro }) {
  const handleNext = () => setFase(2) // Avanzar a la siguiente fase

  return (
    <div>
      {/* Muestra los productos del carrito */}
      {/* MakeCheckoutCard */}
      <MakeOneFrCard element={libro} index={0} />

      <button onClick={handleNext}>Siguiente</button>
    </div>
  )
}
export default Fase1
