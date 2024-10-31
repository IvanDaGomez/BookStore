/* eslint-disable react/prop-types */
function Fase2({ form, setForm, setFase }) {
    const handleNext = () => setFase(3); // Avanzar a la siguiente fase
  
    const handleChange = (e) => {
      setForm({ ...form, delivery: { ...form.delivery, [e.target.name]: e.target.value } });
    };
  
    return (
      <div>
        <div className="checkoutContainer">
          <input name="city" placeholder="Ciudad" onChange={handleChange} />
          <div>
            <button onClick={() => setFase(1)}>Atrás</button>
            <button onClick={handleNext}>Siguiente</button>
          </div>
        </div>
      </div>
    );
  }
  export default Fase2;
  