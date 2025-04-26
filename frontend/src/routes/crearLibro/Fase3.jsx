/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { validarPublicar3 } from '../../assets/validarPublicar'
import { calculateComission } from '../../assets/calculateComission'
import { formatPrice } from '../../assets/formatPrice'
export default function Fase3 ({ form, setForm, fase, setFase, meanPrice }) {
  const [errors, setErrors] = useState([])
  const [keywords, setKeywords] = useState([])

  async function handleSubmit (e) {
    e.preventDefault()

    const { precio, oferta } = e.target

    // Remover el formato de precio y oferta (eliminar "$" y los puntos)
    const cleanPrecio = parseInt(precio.value.replace(/\./g, '').replace('$', ''), 10)
    const cleanOferta = oferta.value ? parseInt(oferta.value.replace(/\./g, '').replace('$', ''), 10) : undefined // Asegúrate de que esté definido

    const fallos = validarPublicar3({

      precio: cleanPrecio,
      keywords,
      oferta: cleanOferta // Usamos el valor sin formatear
    }) || []

    if (fallos.length !== 0) {
      setErrors(fallos)
      return
    }

    setErrors([])
    setForm({
      ...form,

      precio: cleanPrecio,
      keywords,
      oferta: cleanOferta // Guardar sin formatear
    })
    setFase(4)
  }

  /* handleAtras(); */

  // Icono de $ y formateo a 1.000

  // Muestra solo "$" si no hay valor
  const formatPrecio = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '') // Eliminar caracteres que no sean números

    if (value) {
      // Convertir a número y formatear
      const formattedValue = parseFloat(value).toLocaleString('es')
      e.target.value = '$ ' + formattedValue // Actualizar con el símbolo de $
    } else {
      e.target.value = '$' // Mostrar solo el símbolo $ si no hay valor
    }
  }

  function setKeyword (event) {
    if (event.key !== 'Enter') return

    event.preventDefault()
    // Si hay 4 palabras clave me deja añadir una más
    if (event.target.value && keywords.length <= 4) {
      setKeywords([...keywords, event.target.value])
      event.target.value = ''
    }
  }
  function handleDeleteKeyword (index) {
    setKeywords((prevKeywords) => prevKeywords.filter((_, i) => i !== index))
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Previene el envío del formulario
    }
  }
  useEffect(() => {
    // Solo formatear si form.precio es un número válido
    const precioElement = document.querySelector('#precio')
    if (form.precio && !isNaN(form.precio)) {
      precioElement.value = '$ ' + parseFloat(form.precio).toLocaleString('es')
    } else {
      precioElement.value = '$ 0' // Valor por defecto si form.precio no es válido
    }

    const ofertaElement = document.querySelector('#oferta')
    if (form.oferta && !isNaN(form.oferta)) {
      ofertaElement.value = '$ ' + parseFloat(form.oferta).toLocaleString('es')
    } else {
      ofertaElement.value = '$ 0' // Valor por defecto si form.oferta no es válido
    }

    setKeywords(form.keywords || [])
  }, [form.precio, form.keywords, form.oferta])
  return (
    <>
      <form action='' onSubmit={handleSubmit} noValidate>

        <div className='inputCrear'>
          <label htmlFor='keywords'>Palabras clave (hasta 5)</label>
          <input
            id='keywords'
            type='text'
            name='keywords'
            placeholder='Presiona Enter para agregar la palabra'
            onKeyDown={setKeyword}
          />
          {(keywords.length !== 0)
            ? <div className='keywordWrapper'>
              {keywords.map((key, index) => (
                <div key={index} className='keyword'>
                  {key}
                  <svg onClick={() => handleDeleteKeyword(index)} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
                    <path d='M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                </div>
              ))}
              </div>
            : <></>}
        </div>
        {/* -------------------------------------ESTE LIBRO ES PARTE DE UNA COLECCION */}
        <div className='inputCrear'>
          <label htmlFor='precio'>Precio *</label>
          {/* value={formattedValue} */}
          <input
            id='precio'
            type='text'
            name='precio'
            placeholder='$'
            onChange={formatPrecio}
            onKeyDown={handleKeyPress}
            required
          />
        </div>
        <div className='inputCrear'>
          <label htmlFor='oferta'>Precio de oferta</label>
          <input
            id='oferta'
            type='text'
            name='oferta'
            placeholder='Está bien si no quieres poner nada aquí :('

            onChange={formatPrecio}
            onKeyDown={handleKeyPress}
          />
        </div>
        {(!isNaN(meanPrice)) && <label>El precio promedio de este libro en internet es de: $ {meanPrice} pesos</label>}
        {console.log(form.precio)}
        {form.precio && <p>Comisión estimada: {formatPrice(calculateComission(form.precio))}</p>}
        {errors.length !== 0 && <div className='error'>{errors[0]}</div>}
        <div className='center'>
          <div className='atras' onClick={() => setFase(fase - 1)}>
            Atrás
          </div>
          <input type='submit' value='Enviar' />
        </div>
      </form>

    </>
  )
}
