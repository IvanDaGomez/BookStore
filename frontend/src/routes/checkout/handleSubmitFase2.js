

export const handleSubmit = ({
  e,
  setErrors,
  setForm,
  handleNext,
  ip_address
}) => {
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