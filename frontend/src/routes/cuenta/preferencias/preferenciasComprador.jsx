/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react'

const PreferenciasComprador = ({ user }) => {
  const [settings, setSettings] = useState({
    idioma: 'Español',
    generosFavoritos: {
      Fantasía: true,
      CienciaFicción: false,
      Romance: true,
      Historia: false
    },
    sugerencias: { activar: true, email: false }
  })

  const handleToggle = (category, key) => {
    if (typeof settings[category] === 'object') {
      setSettings((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [key]: !prev[category][key]
        }
      }))
    }
  }

  const handleSelectChange = (event) => {
    setSettings((prev) => ({
      ...prev,
      idioma: event.target.value
    }))
  }

  return (
    <>
    <div className='preferences container'>
      <h1>Preferencias del Comprador</h1>
      <p>Personaliza tu experiencia para disfrutar al máximo de nuestra biblioteca de libros.</p>

      {/* Idioma preferido */}
      <div className='preference-section'>
        <h2>Idioma preferido</h2>
        <select value={settings.idioma} onChange={handleSelectChange}>
          <option value='Español'>Español</option>
          <option value='Inglés'>Inglés</option>
          <option value='Francés'>Francés</option>
          <option value='Alemán'>Alemán</option>
        </select>
      </div>

      {/* Géneros favoritos */}
      <div className='preference-section'>
        <h2>Géneros favoritos</h2>
        <ul>
          {Object.entries(settings.generosFavoritos).map(([genre, isSelected]) => (
            <li key={genre}>
              <label>
                <input
                  type='checkbox'
                  checked={isSelected}
                  onChange={() => handleToggle('generosFavoritos', genre)}
                />
                {genre}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Sugerencias personalizadas */}
      <div className='preference-section'>
        <h2>Sugerencias personalizadas</h2>
        <table className='settings-table'>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Activar</th>
              <th>Recibir por correo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Sugerencias de libros</td>
              <td>
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={settings.sugerencias.activar}
                    onChange={() => handleToggle('sugerencias', 'activar')}
                  />
                  <div className='slider' />
                </label>
              </td>
              <td>
                <label className='switch'>
                  <input
                    type='checkbox'
                    checked={settings.sugerencias.email}
                    onChange={() => handleToggle('sugerencias', 'email')}
                  />
                  <div className='slider' />
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>

  )
}

export default PreferenciasComprador
