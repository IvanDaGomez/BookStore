import { useState } from 'react';
import Fase1 from './fase1';
import Fase2 from './fase2';
import Fase3 from './fase3';
import Fase4 from './fase4';
import UseStep from '../../components/UseStep';
import Header from '../../components/header';
import Footer from '../../components/footer';
import SideInfo from '../../components/sideInfo';
function Checkout() {
  const [fase, setFase] = useState(1);  // Estado para la fase actual
  const [form, setForm] = useState({
    // Estado para almacenar los datos del formulario
    cart: [],
    delivery: {},
    payment: {},
    confirmation: {},
  });

  const renderFase = () => {
    switch (fase) {
      case 1:
        return <Fase1 form={form} setForm={setForm} setFase={setFase} />;
      case 2:
        return <Fase2 form={form} setForm={setForm} setFase={setFase} />;
      case 3:
        return <Fase3 form={form} setForm={setForm} setFase={setFase} />;
      case 4:
        return <Fase4 form={form} setForm={setForm} setFase={setFase} />;
      default:
        return <Fase1 form={form} setForm={setForm} setFase={setFase} />;
    }
  };

  const steps = ['información producto', 'Envío', 'Pago', 'Confirmación']
  return (
    <>
    <Header />
    <div className="checkout-container">
      <h1>Proceso de Compra</h1>
      <UseStep currentStep={fase} titulos={steps}  />
      
      {renderFase()}
    </div>
    <Footer/>
    <SideInfo/>
    </>
  );
}

export default Checkout;
