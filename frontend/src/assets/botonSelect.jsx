import { useState } from "react";

export default function useBotonSelect({ formas, results , setResults, ancho, callback }) {


  // Estado inicial para la opción de ordenación seleccionada
  const [selected, setSelected] = useState(Object.keys(formas)[0]);
  const [isOpen, setIsOpen] = useState(false);

  // Función para manejar la selección de una forma de ordenación
  const handleSelect = (forma) => {
    setSelected(forma); // Actualiza el estado con la nueva forma de ordenación seleccionada
    setIsOpen(false); // Cierra el desplegable de selección

    // Llama al callback con la forma seleccionada, results y setResults
    if (callback) {
      callback(formas, forma, results, setResults);
    }
  };

  // Icono para desplegar el menú de selección de ordenación
  const arrowDown = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#fff"} fill={"none"}>
      <path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className="select" style={{ width: ancho }} onClick={() => setIsOpen(!isOpen)}>
      {/* Mostrar la opción seleccionada */}
      <div className="selected" style={{ width: ancho }} >
        {selected ? <>{selected} {arrowDown}</> : <>Selected {arrowDown}</>}
      </div>

      {/* Desplegar el menú de opciones cuando esté abierto */}
      {isOpen && (
        <div className="optionsContainer" style={{ width: ancho }} onMouseLeave={() => setIsOpen(false)}>
          <div className="options" style={{ width: ancho }}>
            {/* Mostrar las opciones de ordenación */}
            {Object.keys(formas).map((forma, index) => (
              <div key={index} className="option" style={{ width: ancho }} onClick={() => handleSelect(forma)}>
                {forma}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
