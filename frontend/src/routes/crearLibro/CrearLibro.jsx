import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Fase1 from "./Fase1";
import Fase2 from "./Fase2";
import Fase3 from "./Fase3";
import { useState, useEffect } from "react";
import UseStep from "../../components/UseStep";


export default function CrearLibro() {
      //const user = useFetchUser('http://localhost:3030/api/users/userSession')
      const [user, setUser] = useState();
      useEffect(() => {
          async function fetchUser() {
              try {
                  const response = await fetch('http://localhost:3030/api/users/userSession', {
                      method: 'POST',
                      credentials: 'include',  // Asegúrate de enviar las cookies
                  });
                  if (response.ok) {
                      const data = await response.json();
                      setUser(data.user); // Establece el usuario en el estado
                  } else {

                      window.location.href = '/popUp/noUser'
                  }
              } catch (error) {
                  console.error('Error fetching user data:', error);
              }
          };
      
          fetchUser(); // Llama a la función para obtener el usuario

      }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente
      
  const [form, setForm] = useState({});
  const [fase, setFase] = useState();
  // Recuperar datos de localStorage en el primer render
  useEffect(() => {
    const storedForm = localStorage.getItem("form");
    if (storedForm) {
      try {
        setForm(JSON.parse(storedForm));
      } catch (error) {
        console.error("Error parsing form from localStorage", error);
      }
    }

    const storedFase = localStorage.getItem("fase");
    if (storedFase) {
      setFase(parseInt(storedFase, 10)); // Asegurarse de que es un número entero
    }
    else setFase(1)
    
  }, []);

  // Guardar los cambios de fase y formulario en localStorage
  useEffect(() => {
    if (Object.keys(form).length !== 0) {
      localStorage.setItem("form", JSON.stringify(form));
    }
    if (fase !== null && !isNaN(fase)) {
      localStorage.setItem("fase", fase.toString());
    }
    
  }, [fase, form]);

  const steps = ["Imágenes y Titulo", "Categorías", "Precio"];
  useEffect(() => {
    if (fase === 4 && user && user._id && user.nombre) {
        const enviarForm = async () => {
            const formData = new FormData(); // Crear una nueva instancia de FormData

            for (let i = 0; i < document.querySelector('input[type="file"][multiple]').files.length; i++) {
                formData.append('images', document.querySelector('input[type="file"][multiple]').files[i]); // Asegúrate de que el nombre coincida con el campo en tu backend
            }

            const timeNow = new Date();
            // Agregar campos adicionales al FormData
            formData.append("fechaPublicacion", `${timeNow}`);
            formData.append("actualizadoEn", `${timeNow}`);
            formData.append("idVendedor", user._id);
            formData.append("vendedor", user.nombre);
            formData.append("disponibilidad", "Disponible");
            formData.append("ubicacion", 'Buscar');

            console.log('FormData:', [...formData.entries()]); // Muestra todos los campos y sus valores
            
            
            try {
                const URL = 'http://localhost:3030/api/books';
                const response = await fetch(URL, {
                    method: 'POST',
                    body: formData,  // Enviar el FormData directamente
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }

                const data = await response.json();
                if (data.error) {
                    console.log(data.error);
                    return;
                }

                setForm({}); // Restablecer el formulario
                localStorage.removeItem("form");
                setFase(1);
                localStorage.removeItem("fase");

                window.location.href = `/popUp/exito`;

            } catch (error) {
                console.error("Error al enviar los datos:", error);
            }
        };

        enviarForm();
    }
}, [fase, form, user]);


  return (
    <>
      <Header />
      
      <div className="crearLibroDiv">
        <div className="warning">
          Solo aceptamos libros en buen estado. <span>Publicar réplicas o falsificaciones </span>
          es motivo de expulsión inmediata de Meridian.
        </div>
        <div className="info">
          No todos los campos son requeridos, pero ten en cuenta que entre más completa esté tu publicación más rápido podrá venderse.
        </div>
        <h1>Publica tu libro</h1>

        <UseStep currentStep={fase} titulos={steps}  />
        {fase === 1 ? (
          <Fase1 form={form} setForm={setForm} fase={fase} setFase={setFase} />
        ) : fase === 2 ? (
          <Fase2 form={form} setForm={setForm} fase={fase} setFase={setFase} />
        ) : (
          <Fase3 form={form} setForm={setForm} fase={fase} setFase={setFase} />
        )}
      </div>
      <Footer />
      <SideInfo />
    </>
  );
}
