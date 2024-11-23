/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { options } from "../../assets/options";
function Fase2({ form, setForm, setFase, user }) {

    const handleNext = () => setFase(3); // Avanzar a la siguiente fase
  
    const handleChange = (e) => {
      setForm({ ...form, delivery: { ...form.delivery, [e.target.name]: e.target.value } });
    };
    const handleSubmit = () => {

    }
    useEffect(()=>{
      if (user) {
        document.querySelector('#nombre').value = user.nombre || ''
      }
    },[user])
    return (
      <div className="">
        <div className="inputCrear">
          <label htmlFor="nombre">Nombre completo *</label>
          <input

            id="nombre"
            type="text"
            name="nombre"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="telefono">Teléfono *</label>
          <div>
          {/*Flag API no sirve <img src={`https://flagsapi.com/${option.isoCode}/flat/64.png`} alt="" /> */}
          <select name="extension" id="extension">
            {options.map((option, index)=>(
              <option key={index} name={option.code}>+ {option.code}</option>
            ))}
            
          </select>
          <input

            id="telefono"
            type="number"
            name="telefono"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
          </div>
          
        <div className="inputCrear">
          <label htmlFor="departamento">Departamento *</label>
          <input

            id="departamento"
            type="text"
            name="departamento"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="ciudad">Ciudad *</label>
          <input

            id="ciudad"
            type="text"
            name="ciudad"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="barrio">Barrio *</label>
          <input

            id="barrio"
            type="text"
            name="barrio"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="direccion">Dirección *</label>
          <input

            id="direccion"
            type="text"
            name="direccion"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="apto">Piso/Torre/Apto/Edificio (opcional)</label>
          <input

            id="apto"
            type="text"
            name="apto"
            placeholder=""
            required
            onChange={handleChange}
            
          />
        </div>
          <div>
            <button onClick={() => setFase(1)}>Atrás</button>
            <button onClick={handleNext}>Siguiente</button>
          </div>
        </div>
    );
  }
  export default Fase2;
  