/* eslint-disable react/prop-types */
import { reduceText } from "../reduceText";

export default function RenderMidText({ element, wordLimit }) {
  const renderAuthorAndGenre = () => {
    return [element.autor && reduceText(element.autor, 20), element.genero && reduceText(element.genero, 15)]
      .filter(Boolean) // Filters out null/undefined/false values
      .join(' | ');
  };

  const renderPriceSection = () => {
    if (element.oferta) {
      return (
        <>
          <h3 style={{ display: 'inline', marginRight: '10px' }}>
            <s>${element.precio.toLocaleString('es-CO')}</s>
          </h3>
          <h2 className="red" style={{ display: 'inline' }}>
            ${element.oferta.toLocaleString('es-CO')}
          </h2>
        </>
      );
    }
    return (
      <h2 className="red">
        ${element.precio.toLocaleString('es-CO')}
      </h2>
    );
  };

  return (
    <>
      <h2>{reduceText(element.titulo, wordLimit)}</h2>
      <div className="sectionElementTextDiv">
        <h3>{renderAuthorAndGenre()}</h3>
        <h3 style={{ color: 'var(--using4)' }}>{element.estado}</h3>
        <div className="precioSections">{renderPriceSection()}</div>
      </div>
    </>
  );
}