import { useState } from 'react';

/* eslint-disable react/prop-types */
export default function UseCajones({ categoria, index, callback }) {
  const [filterText, setFilterText] = useState("");

  // Filter the categories based on the input
  const filteredCategoria = categoria.filter((item) =>
    item.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelectCategoría = (item) => {
    callback(categoria, item, index);
  };

  return (
    <>
      {/* Input field for filtering */}
      {categoria.length >= 8 &&
      <input
        type="text"
        placeholder="Filtrar"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="filterInput"
      />
      }
      {filteredCategoria.map((item, idx) => (
        <div
          className="cajonCategoria"
          key={idx}
          onClick={() => handleSelectCategoría(item)}
        >
          {item}
        </div>
      ))}
    </>
  );
}
