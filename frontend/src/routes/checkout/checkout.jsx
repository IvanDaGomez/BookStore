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
import { ToastContainer, toast } from 'react-toastify';
function Checkout() {

  const [user, setUser] = useState(null)
  const [preferenceId, setPreferenceId] = useState(null);
      // Fetch del usuario primero que todo
      useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:3030/api/users/userSession', {
                    method: 'POST',
                    credentials: 'include',
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                } else {
                    window.location.href = '/popUp/noUser';
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                window.location.href = '/popUp/noUser';
            }
        }
        fetchUser();
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
                const response = await fetch('http://localhost:3030/api/books/getPreferenceId', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...libro,
                        title: libro.titulo,
                        price: libro.oferta ? libro.oferta : libro.precio,
                    }),
                    credentials: 'include',
                });
                const data = await response.json();
                if (data.error) {
                    console.error(data.error);
                } else {
                    setPreferenceId(data.id);
                }
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
      case 5:
        return <Fase4 form={form} setForm={setForm} setFase={setFase} user={user}/>;
      default:
        return <Fase1 form={form} setForm={setForm} setFase={setFase} />;
    }
  };
  



  const steps = ['Información del producto', 'Tu datos de envío', 'Pago', 'Confirmación']
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
