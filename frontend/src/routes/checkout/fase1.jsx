
/* eslint-disable react/prop-types */
function Fase1 ({ setFase }) {
  const handleNext = () => setFase(2) // Avanzar a la siguiente fase

  return (
    <div>
      <button onClick={handleNext}>Siguiente</button>
    </div>
  )
}
export default Fase1
