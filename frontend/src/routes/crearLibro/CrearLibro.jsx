import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Fase1 from "./Fase1";
import Fase2 from "./Fase2";
import Fase3 from "./Fase3";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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

  const [searchParams] = useSearchParams(); // Get the search parameters

  // Extract values for 'vendedor' and 'libro'
  const vendedor = searchParams.get('vendedor'); // Retrieves the value of 'vendedor'
  const libro = searchParams.get('libro');       // Retrieves the value of 'libro'
  const actualizar = vendedor && libro && user && vendedor === user._id && user.librosIds.includes(libro)
  // Fetch book data if libroId is present
  useEffect(() => {
    const fetchBook = async () => {
      if (actualizar) {
        try {
          const response = await fetch(`http://localhost:3030/api/books/${libro}`, {
            method: 'GET',
            credentials: 'include',
          });
  
          if (!response.ok) {
            window.location.href = "/libros/crear";
            return; // Exit the function if the response isn't OK
          }
  
          const data = await response.json();
  
          // Fetch image blobs in parallel
          const imageBlobs = await Promise.all(
            data.images.map(async (image) => {
              const imageResponse = await fetch(`http://localhost:3030/uploads/${image}`);
              if (!imageResponse.ok) {
                throw new Error(`Failed to fetch image at ${image}`);
              }
              const blob = await imageResponse.blob();
              return { url: URL.createObjectURL(blob), type: 'image/png' }; // Create a URL for the blob
            })
          );
  
          // Update the form state with the data and image blobs
          setForm({ 
        titulo: data.titulo,
        autor: data.autor,
        precio: data.precio,
        oferta: data.oferta,
        keywords: data.keywords,
        descripcion: data.descripcion,
        estado: data.estado,
        genero: data.genero,
        edicion: data.edicion,
        idioma: data.idioma,
        tapa: data.tapa,
        edad: data.edad,
        images: imageBlobs,
        formato: data.formato});
            
        } catch (error) {
          console.error('Error fetching book data:', error);
        }
      }else{
        setForm({})
      }
    };
  
    fetchBook();
  }, [libro, actualizar]);
  

  const steps = ["Imágenes y Titulo", "Categorías", "Precio"];

   
  useEffect(() => {
    if (fase === 4 && user && user._id && user.nombre) {
        const enviarForm = async () => {
            const formData = new FormData(); // Crear una nueva instancia de FormData

            async function urlToBlob(blobUrl) {
              const response = await fetch(blobUrl);
              const blob = await response.blob();
              return blob;
            }
        
            const blobPromises = form.images.map(image => urlToBlob(image.url));

            // Esperar a que todas las promesas se resuelvan
            const blobs = await Promise.all(blobPromises);
        // Iterar sobre las imágenes en formato Blob y agregarlas al FormData
        blobs.forEach((blob, index) => {
            // Añadir cada imagen como archivo al FormData, dándole un nombre único
            formData.append('images', blob, `image-${index}.png`); 
        });

        // Añadir los demás campos del formulario al FormData
        for (let [key, value] of Object.entries(form)) {
            if (key !== 'images') {
                formData.append(key, value);
            }
        }

            const timeNow = new Date().toISOString();
            // Agregar campos adicionales al FormData
            formData.append("fechaPublicacion", `${timeNow}`);
            formData.append("actualizadoEn", `${timeNow}`);
            formData.append("idVendedor", user._id);
            formData.append("vendedor", user.nombre);
            formData.append("disponibilidad", "Disponible");
            formData.append("ubicacion", 'Buscar');
            
            for (let pair of formData.entries()) {
              console.log(pair[0] + ': ' + pair[1]); // Logs key-value pairs
            }
            try {
                
              const URL = (!actualizar) ? 'http://localhost:3030/api/books': `http://localhost:3030/api/books/${libro}` ;
                const response = await fetch(URL, {
                    method: (!actualizar) ? 'POST': 'PUT',
                    body: formData,  // Enviar el FormData directamente
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error('Error en la solicitud: ' + response.status);
                }

                const data = await response.json();
                if (data.error) {
                    console.error(data.error);
                    return;
                }
                
                setForm({}); // Restablecer el formulario
                localStorage.removeItem("form");
                setFase(1);
                localStorage.removeItem("fase");

                window.location.href = `/popUp/exitoCreandoLibro`;

            } catch (error) {
                console.error("Error al enviar los datos:", error);
            }
        };

        if (fase === 4) enviarForm();
    }
}, [fase, form, user, actualizar, libro]);




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
        <h1>{actualizar ? <>Actualiza</>:<>Publica</>} tu libro</h1>

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
