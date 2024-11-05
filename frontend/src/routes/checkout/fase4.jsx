/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
function Fase4({ user }) {
    return (
      <div className="checkoutContainer">
        <h1><small>Gracias por tu compra, {user.nombre}!</small></h1>
        <Link to='/'><button>Volver al Inicio</button></Link>
      </div>
    );
  }
  export default Fase4;
  