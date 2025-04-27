/* eslint-disable react/prop-types */
import { useState } from 'react'

import useGetIpAddress from './useGetIpAddress'
import { handleSubmit } from './handleSubmitFase2'
import Fase2Form from './fase2Form'

function Fase2 ({ form, setForm, setFase }) {
  const handleNext = () => setFase(3) // Avanzar a la siguiente fase

  const [errors, setErrors] = useState([])

  const ip_address = useGetIpAddress() 


  return (
    <div className=''>
      <form onSubmit={(e)=>handleSubmit({
          e,
          setErrors,
          setForm,
          handleNext,
          ip_address
      })} noValidate>
        <Fase2Form form={form} errors={errors}/>

        {errors.length > 0 && <div className='error'>{errors[0]}</div>}
        {/* PRECIO DE ENVÍO */}
        <div className='buttons'>
          <button onClick={() => setFase(1)}>Atrás</button>
          <button type='submit'>Siguiente</button>
        </div>
      </form>
    </div>
  )
}

export default Fase2
