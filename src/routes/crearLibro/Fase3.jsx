/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { validarPublicar3 } from "../../assets/validarPublicar";
export default function Fase3({ form, setForm, fase, setFase }){


    const [errors, setErrors] = useState([]);
    const [keywords, setKeywords] = useState([])
    async function handleSubmit(e) {
      e.preventDefault();
  
      const { autor, precio, oferta } = e.target;
      
      // Remover el formato de precio y oferta (eliminar "$" y los puntos)
      const cleanPrecio = parseInt(precio.value.replace(/\./g, "").replace("$", ""), 10); // Mantiene solo números y el punto decimal
      const cleanOferta = parseInt(oferta.value.replace(/\./g, "").replace("$", ""), 10); // Similar al precio
  
      const fallos = validarPublicar3({
        autor: autor.value,
        precio: cleanPrecio, // Usamos el valor sin formatear
        keywords: keywords,
        oferta: cleanOferta // Usamos el valor sin formatear
      }) || [];
  
      if (fallos.length !== 0) {
        setErrors(fallos);
        return;
      }
  
      setErrors([]);
      setForm({
        ...form,
        autor: autor.value,
        precio: cleanPrecio, // Guardar sin formatear
        keywords: keywords,
        oferta: cleanOferta // Guardar sin formatear
      });
      
      
      
      //const timeNow = new Date();
      //const user = Cookies.get("user")
      /*setForm({...form,
        "fechaPublicacion": new Date().toISOString(),
        "vendedor": user
      })*/
      setForm({})
      setFase(1)
      localStorage.removeItem("form");
      localStorage.removeItem("fase");
      window.location.href = `${window.location.origin}/libros/crear/exito`
      // Luego de hacer setForm, puedes enviar los datos a la API:
      const enviarForm = async () => {


        try {
          const response = await fetch('https://api.tuservidor.com/endpoint', {
            method: 'POST',  // Especificas que es una solicitud POST
            headers: {
              'Content-Type': 'application/json'  // Asegura que la API interprete los datos como JSON
            },
            body: JSON.stringify(form)  // Convierte el objeto form a JSON antes de enviarlo
          });

          if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
          }

          /*localStorage.removeItem("form");
          localStorage.removeItem("fase");
          window.location.href = `${window.location.origin}/libros/crear/exito`*/
          
        } catch (error) {
          console.error("Error al enviar los datos:", error);  // Maneja cualquier error que ocurra
        }
      };
      
      //enviarForm()

  }
  useEffect(()=>{
    console.log(form);
  },[form])
  
    /*handleAtras();*/

    //Icono de $ y formateo a 1.000 

    //Muestra solo "$" si no hay valor
    const formatPrecio = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, ""); // Eliminar caracteres que no sean números
      
        if (value) {
          // Convertir a número y formatear
          let formattedValue = parseFloat(value).toLocaleString("es");
          e.target.value = "$ " + formattedValue; // Actualizar con el símbolo de $
        } else {
          e.target.value = "$"; // Mostrar solo el símbolo $ si no hay valor
        }
        
      };

    
    function setKeyword(event){
        if (event.key !== "Enter") return
 
        event.preventDefault();
        if (event.target.value){
            
           setKeywords([...keywords, event.target.value])
           event.target.value = ""
        }
    }
    function handleDeleteKeyword(index) {
        setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index));
    }

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
          event.preventDefault(); // Previene el envío del formulario
        }
      };
      useEffect(() => {
        // Solo formatear si form.precio es un número válido
        const precioElement = document.querySelector("#precio");
        if (form.precio && !isNaN(form.precio)) {
          precioElement.value = "$ " + parseFloat(form.precio).toLocaleString("es");
        } else {
          precioElement.value = "$ 0";  // Valor por defecto si form.precio no es válido
        }
      
        const ofertaElement = document.querySelector("#oferta");
        if (form.oferta && !isNaN(form.oferta)) {
          ofertaElement.value = "$ " + parseFloat(form.oferta).toLocaleString("es");
        } else {
          ofertaElement.value = "$ 0";  // Valor por defecto si form.oferta no es válido
        }
      
        document.querySelector("#autor").value = form.autor || "";
        setKeywords(form.keywords || []);
      }, [form.precio, form.autor, form.keywords, form.oferta]);
    return(<>
        <div className="fase3">
            <form action="" onSubmit={handleSubmit} noValidate>

            <div className="inputCrear">
          <label htmlFor="autor">Autor *</label>
          <input
            id="autor"
            type="text"
            name="autor"
            placeholder="Autor de tu libro"
            required
            onKeyDown={handleKeyPress}
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="keywords">Palabras clave (hasta 5)</label>
          <input
            id="keywords"
            type="text"
            name="keywords"
            placeholder="Presiona Enter para agregar la palabra"
            onKeyDown={setKeyword}

            
          />
          {(keywords.length !== 0) ? 
          <div className="keywordWrapper">
            {keywords.map((key, index)=>(
                    <div key={index} className="keyword">
                    {key}
                    <svg onClick={()=>handleDeleteKeyword(index)}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                        <path d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    </div>
                ))}
          </div>:<></>
          }
        </div>
        <div className="inputCrear" >
          <label htmlFor="precio">Precio *</label>
          {/*value={formattedValue}*/}
          <input
            id="precio"
            type="text"
            name="precio"
            placeholder="$"
            onChange={formatPrecio}
            onKeyDown={handleKeyPress}
            required
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="oferta">Precio de oferta</label>
          <input
            id="oferta"
            type="text"
            name="oferta"
            placeholder="Está bien si no quieres poner nada aquí :("
            
            onChange={formatPrecio}
            onKeyDown={handleKeyPress}
          />
        </div>

        {errors.length !== 0 && <div className="error">{errors[0]}</div>}
            <div className="center">
          <button className="atras" onClick={() =>setFase(fase - 1)}>
            Atrás
          </button>
          <input type="submit" value="Continuar" onSubmit={handleSubmit}/>
        </div>
            </form>
        </div>
            
    
    </>)
}