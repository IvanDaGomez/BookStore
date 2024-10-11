import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Fase1 from "./Fase1";
import Fase2 from "./Fase2";
import Fase3 from "./Fase3";
import { useState, useEffect } from "react";
import UseStep from "../../components/UseStep";

export default function CrearLibro() {
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
