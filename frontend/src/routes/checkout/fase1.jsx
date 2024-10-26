/* eslint-disable react/prop-types */
function Fase1({ form, setForm, setFase }) {
    const handleNext = () => setFase(2); // Avanzar a la siguiente fase
  
    return (
      <div>
        <h2>Carrito de Compras</h2>
        {/* Muestra los productos del carrito */}
        {form.cart.map((item, index) => (
          <div key={index}>
            <p>{item.name}</p>
            <p>Cantidad: {item.amount}</p>
            <p>Precio: ${item.price}</p>
          </div>
        ))}
        <button onClick={handleNext}>Siguiente</button>
      </div>
    );
  }
  export default Fase1;
  