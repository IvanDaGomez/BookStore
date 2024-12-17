/* eslint-disable react/prop-types */

import UseCajones from './useCajones'
import { useState, useEffect } from 'react'

import titleCase from '../../assets/toTitleCase'
import { edad, edicion, estado, formato, generos, idiomas, tapa } from '../../assets/categorias'
export default function Fase2 ({ form, setForm, fase, setFase }) {
  const [errors, setErrors] = useState([])

  // Lista de categorías sin asterisco
  const categorias = {
    estado,
    genero: generos.sort((a, b) => a.localeCompare(b)),
    formato,
    edicion,
    idioma: idiomas.sort((a, b) => {
      const priority = ['Inglés', 'Español']
      if (priority.includes(a) || priority.includes(b)) {
        return 1
      }
      return a.localeCompare(b)
    }),
    tapa,
    edad
  }
  // Lista de categorías que son requeridas
  const categoriasRequeridas = ['estado', 'genero', 'formato']

  const [categoriaSelected, setCategoriaSelected] = useState(
    Object.keys(categorias).reduce((acc, key) => {
      acc[key] = categoriasRequeridas.includes(key) ? ' ' : '' // Valor inicial vacío solo para campos requeridos
      return acc
    }, {})
  )

  const handleAtras = () => {
    // Update form data
    setForm({
      ...form,
      ...categoriaSelected
    })

    // Proceed to the next phase
    localStorage.setItem('form', JSON.stringify(form))
  }
  // Handle category selection
  const handleCategoriaChange = (categoria, valorSeleccionado, index) => {
    const nombre = Object.keys(categorias).find(key => categorias[key] === categoria)
    setCategoriaSelected((prev) => ({
      ...prev,
      [nombre]: valorSeleccionado
    }))
    toggleCajon(index)
  }

  // Handle the visibility of cajones
  const [cajonesVisibles, setCajonesVisibles] = useState({})

  const toggleCajon = (index) => {
    setCajonesVisibles((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }))
  }

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validation: Check if required fields are filled
    const noLlenados = categoriasRequeridas.filter(
      (categoria) => categoriaSelected[categoria] === ' '
    )

    if (noLlenados.length !== 0) {
      setErrors(['Hay unos campos requeridos que no has llenado'])
      return
    } else {
      setErrors([])
    }

    // Update form data
    setForm({
      ...form,
      ...categoriaSelected
    })

    // Proceed to the next phase
    localStorage.setItem('form', JSON.stringify(form))
    setFase(fase + 1)
  }
  useEffect(() => {
    const categorias = Object.keys(categoriaSelected)
    const valores = Object.entries(form).reduce((acc, [key, value]) => {
      // Verifica si la categoría está incluida en las categorías seleccionadas
      if (categorias.includes(key)) {
        acc[key] = value // Añade el valor al acumulador
      }
      return acc
    }, {})
    setCategoriaSelected({
      ...categoriaSelected,
      ...valores
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form])
  return (
    <>
      <form className='fase2' onSubmit={handleSubmit}>
        <div className='cajones'>
          {Object.keys(categorias).map((categoria, index) => (
            <div className='cajonWrapper' key={index}>

              {/* Desarrollar */}
              {/* <input type="text" /> */}

              <div className='cajon' onClick={() => toggleCajon(index)}>
                {titleCase(categoria)}
                {categoriaSelected[categoria] === ' ' && categoriasRequeridas.includes(categoria) ? <span>Requerido</span> : <span>{categoriaSelected[categoria]}</span>}
              </div>
              <div
                className='cajonesExtra'
                style={{
                  height: cajonesVisibles[index]
                    ? `min(${categorias[categoria].length <= 5 ? 20 * categorias[categoria].length + 'px' : '120px'})`
                    : '0',
                  overflowY: cajonesVisibles[index] ? 'auto' : 'hidden'
                }}
              >
                <UseCajones
                  categoria={categorias[categoria]}
                  index={index}

                  callback={handleCategoriaChange}
                />
              </div>
            </div>
          ))}
        </div>
        {errors.length !== 0 && <div className='error'>{errors[0]}</div>}
        <div className='center'>
          <button className='atras' onClick={() => { handleAtras(); setFase(fase - 1) }}>
            Atrás
          </button>
          <input type='submit' value='Continuar' />
        </div>
      </form>
    </>
  )
}
