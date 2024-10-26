function Fase4({ form, setFase }) {
    return (
      <div>
        <h2>Confirmación</h2>
        <p>Gracias por tu compra, {form.delivery.address}!</p>
        <button onClick={() => setFase(1)}>Volver al Inicio</button>
      </div>
    );
  }
  export default Fase4;
  