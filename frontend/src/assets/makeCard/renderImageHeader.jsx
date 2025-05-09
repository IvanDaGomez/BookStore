/* eslint-disable react/prop-types */
export default function RenderImageHeader({ element }) {
  const isNew = new Date() - new Date(element.fecha_publicacion) < 15 * 24 * 60 * 60 * 1000; // 15 days in milliseconds
  const getLabelStyle = () => {
    if (element.disponibilidad === 'Vendido') return { background: 'red' };
    if (element.oferta) return { background: 'green' };
    if (isNew) return { background: '#4457ff' }; // Color for "New"
    if (element.estado === 'Nuevo') return { background: 'gray' }; // Color for "Perfect condition"
    return {};
  };

  const getLabelText = () => {
    if (element.disponibilidad === 'Vendido') return 'Vendido';
    if (element.oferta) {
      const discount = Math.ceil(((1 - element.oferta / element.precio) * 100).toFixed(2) / 5) * 5;
      return `${discount}% de descuento`;
    }
    if (isNew) return '¡Nuevo!';
    if (element.estado === 'Nuevo') return 'En perfecto estado';
    return null;
  };

  const labelStyle = getLabelStyle();
  const labelText = getLabelText();

  return (
    <>
      {labelText && (
        <div className="bookLabel" style={labelStyle}>
          {labelText}
        </div>
      )}
    </>
  );
}