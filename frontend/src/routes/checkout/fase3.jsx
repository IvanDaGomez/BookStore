function Fase3({ form, setForm, setFase }) {
    const handleNext = () => setFase(4); // Avanzar a la fase de confirmación
  
    const handleChange = (e) => {
      setForm({ ...form, payment: { ...form.payment, [e.target.name]: e.target.value } });
    };
  
    return (
      <div>
        <input name="cardName" placeholder="Nombre en la Tarjeta" onChange={handleChange} />
        <input name="cardNumber" placeholder="Número de Tarjeta" onChange={handleChange} />
        <button onClick={() => setFase(2)}>Atrás</button>
        <button onClick={handleNext}>Siguiente</button>
      </div>
    );
  }
  export default Fase3;
  