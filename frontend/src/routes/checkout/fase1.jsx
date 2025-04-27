
/* eslint-disable react/prop-types */
function Fase1 ({ setFase }) {
  const handleNext = () => setFase(2) // Avanzar a la siguiente fase

  return (
    <div>
      {/* Muestra los productos del carrito */}
      {/* MakeCheckoutCard */}

      <button onClick={handleNext}>Siguiente</button>
    </div>
  )
}
export default Fase1
