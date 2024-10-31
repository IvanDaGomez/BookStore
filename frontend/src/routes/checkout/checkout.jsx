import { useState } from 'react';
import Fase1 from './fase1';
import Fase2 from './fase2';
import Fase3 from './fase3';
import Fase4 from './fase4';
import UseStep from '../../components/UseStep';
import Header from '../../components/header';
import Footer from '../../components/footer';
import SideInfo from '../../components/sideInfo';
import { useParams } from 'react-router';
import { useEffect } from 'react';
function Checkout() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { bookId } = useParams()
  // Fetch book
  const [ libro, setLibro ] = useState(null)
   useEffect(() => {
        async function fetchLibro(id) {
            const url = `http://localhost:3030/api/books/${id}`
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    credentials: "include"
                });
                if (!response.ok) {
                    window.location.href = '/popUp/libroNoEncontrado'
                }
                const book = await response.json();
                setLibro(book || {}); // Asegurar que el libro existe o dejar vacío

                
            } catch (error) {
                setLibro({});
                console.error("Error fetching book data:", error);
            }
        }

        fetchLibro(bookId);
    }, [bookId]);

  const [fase, setFase] = useState(1);  // Estado para la fase actual
  const [form, setForm] = useState({
    // Estado para almacenar los datos del formulario
    _id: bookId,
    envío: {},
    pago: {},
    confirmacion: {},
  });

  const renderFase = () => {
    switch (fase) {
      case 1:
        return <Fase1 form={form} setForm={setForm} setFase={setFase}  libro={libro}/>;
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

  const steps = ['Información del producto', 'Envío', 'Pago', 'Confirmación']
  return (
    <>
    <Header />
    <div className="checkout-container">
      <h1>{steps[fase - 1]}</h1>
      <UseStep currentStep={fase} titulos={steps}  />
      
      {libro && renderFase()}
    </div>
    <Footer/>
    <SideInfo/>
    </>
  );
}

export default Checkout;
