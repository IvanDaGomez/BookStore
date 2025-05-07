import { useEffect, useState } from "react";
import { options } from "../../assets/options";
import useGetDepartments from "../search/location/useGetDepartments";
import useGetCities from "../search/location/useGetCities";

export default function Fase2Form (form, errors = null) {
  const [departamento, setDepartamento] = useState('')
  const departamentos = useGetDepartments()
  const cities = useGetCities(departamento)
    useEffect(() => {
      // Actualizamos los valores de los campos con los datos de form
      document.querySelector('#nombres').value = form.first_name || ''
      document.querySelector('#apellidos').value = form.last_name || ''
      document.querySelector('#extension').value = form.phone?.area_code || ''
      document.querySelector('#telefono').value = form.phone?.number || ''
      document.querySelector('#zip').value = form.address?.zip_code || ''
      document.querySelector('#direccion').value = form.address?.street_name || ''
      document.querySelector('#apto').value = form.address?.street_name?.split(',')[1]?.trim() || ''
      document.querySelector('#barrio').value = form.address?.neighborhood || ''
      document.querySelector('#departamento').value = form.address?.department || ''
      document.querySelector('#numero_calle').value = form.address?.street_number || ''
      document.querySelector('#ciudad').value = form.address?.city || ''
    }, [form, errors]) // Cuando form cambia, actualizamos los valores del formulario
  return (<>
  <div className='inputCrear'>
          <label htmlFor='nombres'>Nombres *</label>
          <input id='nombres' type='text' name='nombres' required maxLength={32} />
        </div>

        <div className='inputCrear'>
          <label htmlFor='apellidos'>Apellidos *</label>
          <input id='apellidos' type='text' name='apellidos' required maxLength={32} />
        </div>

        <div className='inputCrear'>
          <label htmlFor='telefono'>Teléfono *</label>
          <div>
            <select name='extension' id='extension'>
              {options.map((option, index) => (
                <option key={index} value={option.code}>+ {option.code}</option>
              ))}
            </select>
            <input id='telefono' type='number' name='telefono' required maxLength={10} />
          </div>
        </div>

        <div className='inputCrear'>
          <label htmlFor='departamento'>Departamento *</label>
      <select name='departamento' id='departamento' required
        onChange={(e) => {
          setDepartamento(e.target.value)
          document.querySelector('#ciudad').value = ''
        }}
      >
            <option value=''>Seleccione un departamento</option>
            {departamentos.map((departamento, index) => (
              <option key={index} value={departamento}>{departamento}</option>
            ))}
          </select>
        </div>

        <div className='inputCrear'>
          <label htmlFor='ciudad'>Ciudad *</label>
          <select name="ciudad" id="ciudad">
            {cities.length === 0 ? 
            <option value="">Seleccione un departamento</option>
            :
            <option value="">Seleccione la ciudad</option>}
            {cities.map((ciudad, index) => (
              <option key={index} value={ciudad}>{ciudad}</option>
            ))}
          </select>
        </div>

        <div className='inputCrear'>
          <label htmlFor='zip'>Código postal *</label>
          <input id='zip' type='text' name='zip' required maxLength={6} pattern='[0-9]{6}' />
        </div>

        <div className='inputCrear'>
          <label htmlFor='barrio'>Barrio *</label>
          <input id='barrio' type='text' name='barrio' required maxLength={18} />
        </div>

        <div className='inputCrear'>
          <label htmlFor='direccion'>Dirección *</label>
          <input id='direccion' type='text' name='direccion' required maxLength={50} />
        </div>

        <div className='inputCrear'>
          <label htmlFor='numero_calle'>Número de la calle *</label>
          <input id='numero_calle' type='text' name='numero_calle' required maxLength={5} />
        </div>

        <div className='inputCrear'>
          <label htmlFor='apto'>Piso/Torre/Apto/Edificio (opcional)</label>
          <input id='apto' type='text' name='apto' maxLength={18} />
        </div>
  </>)
}