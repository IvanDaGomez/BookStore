/* eslint-disable react/prop-types */
function Fase2({ form, setForm, setFase }) {
    const handleNext = () => setFase(3); // Avanzar a la siguiente fase
  
    const handleChange = (e) => {
      setForm({ ...form, delivery: { ...form.delivery, [e.target.name]: e.target.value } });
    };
  
    return (
      <div>
        <h2>Información de Entrega</h2>
        <input name="address" placeholder="Dirección" onChange={handleChange} />
        <input name="city" placeholder="Ciudad" onChange={handleChange} />
        <button onClick={() => setFase(1)}>Atrás</button>
        <button onClick={handleNext}>Siguiente</button>
      </div>
    );
  }
  export default Fase2;
  