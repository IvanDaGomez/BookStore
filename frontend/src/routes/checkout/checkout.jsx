import { useState } from 'react';
import Fase1 from './fase1';
import Fase2 from './fase2';
import Fase3 from './fase3';
import axios from 'axios';
import UseStep from '../../components/UseStep';
import Header from '../../components/header';
import Footer from '../../components/footer';
import SideInfo from '../../components/sideInfo';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
function Checkout() {

  const [user, setUser] = useState(null)
  const [preferenceId, setPreferenceId] = useState(null);
      // Fetch del usuario primero que todo
      useEffect(() => {
        async function fetchUser() {
            try {
                const url = 'http://localhost:3030/api/users/userSession'
                const response = await axios.post(url, null, {
                    withCredentials: true
                })
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                window.location.href = '/popUp/noUser'
            }
        };
        fetchUser();
    }, []);



  const { bookId } = useParams()
  // Fetch book
  const [ libro, setLibro ] = useState(null)

   useEffect(() => {
        async function fetchLibro(id) {
            const url = `http://localhost:3030/api/books/${id}`
            try {
                const response = await axios.get(url, {withCredentials: true});
                
                setLibro(response.data); // Asegurar que el libro existe o dejar vacío
                
            } catch (error) {
                console.error("Error fetching book data:", error);
                window.location.href = '/popUp/libroNoEncontrado'
            }
        }

        fetchLibro(bookId);
    }, [bookId]);

  const [fase, setFase] = useState(1);  // Estado para la fase actual
  const [form, setForm] = useState({
    // Estado para almacenar los datos del formulario
    _id: bookId,
    address: {},
    payment: {},
    confirmation: {},
  });

  // Fetch preferenceId only when `libro` changes
  useEffect(() => {
    // Wrap in an async function to avoid directly calling async in useEffect
    const fetchPreferenceId = async () => {
        if (libro) {
            try {
              const url = 'http://localhost:3030/api/books/getPreferenceId'
              const body = JSON.stringify({
                ...libro,
                title: libro.titulo,
                price: libro.oferta ? libro.oferta : libro.precio,
              })
                const response = await axios.post(url, body,{withCredentials: true});
                setPreferenceId(response.data.preferenceId)
            } catch (error) {
                console.error('Error fetching preference ID:', error);
            }
        }
    };

    fetchPreferenceId();
}, [libro]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [fase]);
  const renderFase = () => {
    switch (fase) {
      case 1:
        return <Fase1 form={form} setForm={setForm} setFase={setFase}  libro={libro}/>;
      case 2:
        return <Fase2 form={form} setForm={setForm} setFase={setFase} user={user}/>;
      case 3:
        return <Fase3 form={form} setForm={setForm} setFase={setFase} libro={libro} preferenceId={preferenceId}/>;
      default:
        return <Fase1 form={form} setForm={setForm} setFase={setFase} />;
    }
  };
  



  const steps = ['Información del producto', 'Tu datos de envío', 'Pago']
  return (
    <>
    <Header />
    <div className="checkout-container">
      <h1>{steps[fase - 1]}</h1>
      <UseStep currentStep={fase} titulos={steps}  />
      
      {libro && renderFase()}
    </div>
    <ToastContainer position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            pauseOnHover={false}
            closeOnClick
            theme="light"
            />
    <Footer/>
    <SideInfo/>
    </>
  );
}

export default Checkout;
