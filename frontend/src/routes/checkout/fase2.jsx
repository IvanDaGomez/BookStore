/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { options } from '../../assets/options'
import { departamentos } from './departamentos'

function Fase2 ({ form, setForm, setFase }) {
  const handleNext = () => setFase(3) // Avanzar a la siguiente fase

  const [errors, setErrors] = useState([])
  const [departamento, setDepartamento] = useState(form.address?.department || '') // Usamos un estado para el select
  const handleSubmit = (e) => {
    e.preventDefault()
    try {
      // Validate
      const {
        nombres,
        apellidos,
        extension,
        telefono,
        departamento,
        ciudad,
        zip,
        direccion,
        apto,
        barrio,
        numero_calle
      } = e.target

      const validateForm = () => {
        const newErrors = []
        if (!nombres.value.trim()) newErrors.push('El campo "Nombres" es obligatorio.')
        if (!apellidos.value.trim()) newErrors.push('El campo "Apellidos" es obligatorio.')
        if (!telefono.value.trim() || telefono.value.length !== 10) newErrors.push('El teléfono debe tener 10 dígitos.')
        if (!departamento.value.trim()) newErrors.push('El campo "Departamento" es obligatorio.')
        if (!ciudad.value.trim()) newErrors.push('El campo "Ciudad" es obligatorio.')
        if (!zip.value.trim() || zip.value.length < 4) newErrors.push('El código postal no es válido.')
        if (!direccion.value.trim()) newErrors.push('El campo "Dirección" es obligatorio.')
        if (!barrio.value.trim()) newErrors.push('El campo "Barrio" es obligatorio.')

        setErrors(newErrors)
        return newErrors.length === 0 // Valido si no hay errores.
      }

      const valid = validateForm()
      if (!valid) {
        return
      }

      setForm({
        first_name: nombres.value,
        last_name: apellidos.value,
        address: {
          zip_code: zip.value,
          street_name: `${direccion.value}${apto.value ? `, ${apto.value}` : ''}`,
          street_number: numero_calle.value,
          neighborhood: barrio.value,
          city: ciudad.value,
          department: departamento.value
        },
        phone: {
          area_code: extension.value,
          number: telefono.value
        },
        additional_info: {
          ip_address
        }
      })

      handleNext() // Avanzar a la siguiente fase
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const [ip_address, setIp_address] = useState(null)

  const getIPAddress = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIp_address(data.ip) // Returns the public IP address
    } catch (error) {
      console.error('Error fetching IP address:', error)
      return null
    }
  }

  useEffect(() => {
    getIPAddress()
  }, [])

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
  }, [form]) // Cuando form cambia, actualizamos los valores del formulario

  return (
    <div className=''>
      <form onSubmit={handleSubmit} noValidate>
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
          <select name='departamento' id='departamento' value={departamento} onChange={(e) => setDepartamento(e.target.value)} required>
            <option value=''>Seleccione un departamento</option>
            {departamentos.map((departamento, index) => (
              <option key={index} value={departamento}>{departamento}</option>
            ))}
          </select>
        </div>

        <div className='inputCrear'>
          <label htmlFor='ciudad'>Ciudad *</label>
          <input id='ciudad' type='text' name='ciudad' required maxLength={18} />
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

        {errors.length > 0 && <div className='error'>{errors[0]}</div>}
        {/* PRECIO DE ENVÍO */}
        <div>
          <button onClick={() => setFase(1)}>Atrás</button>
          <button type='submit'>Siguiente</button>
        </div>
      </form>
    </div>
  )
}

export default Fase2
