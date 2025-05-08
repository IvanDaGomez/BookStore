/* eslint-disable react/prop-types */
import { useState } from 'react';
import UseCajones from './UseCajones';
import titleCase from '../../assets/toTitleCase';
const CajonesFull = ({ 
  categorias, 
  categoriasRequeridas, 
  categoriaSelected, 
  onCategoriaChange
}) => {
  const [cajonesVisibles, setCajonesVisibles] = useState({});

  const toggleCajon = (index) => {
    setCajonesVisibles((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <div className='cajones'>
      {Object.keys(categorias).map((categoria, index) => (
        <div className='cajonWrapper' key={index}>
          <div className='cajon' onClick={() => toggleCajon(index)}>
            {titleCase(categoria)}
            {categoriaSelected[categoria] === ' ' && categoriasRequeridas.includes(categoria) ? (
              <span>Requerido</span>
            ) : (
              <span>{categoriaSelected[categoria]}</span>
            )}
          </div>
          <div
            className='cajonesExtra'
            style={{
              height: cajonesVisibles[index]
                ? `min(${categorias[categoria].length <= 5 ? 20 * categorias[categoria].length + 'px' : '120px'})`
                : '0',
              overflowY: cajonesVisibles[index] ? 'auto' : 'hidden',
            }}
          >
            <UseCajones
              categoria={categorias[categoria]}
              index={index}
              callback={(valorSeleccionado) => onCategoriaChange(categoria, valorSeleccionado, index)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CajonesFull;
