/* eslint-disable react/prop-types */
export default function InfoContainer({ libro }) {
  // Function to calculate the difference in weeks between two dates
  function diffWeeks(dt2, dt1) {
    const millisecondsInAWeek = 60 * 60 * 24 * 7 * 1000;
    const diffInMilliseconds = Math.abs(dt2 - dt1);
    return Math.round(diffInMilliseconds / millisecondsInAWeek);
  }

  // Check if the book is new (published within the last 2 weeks)
  const isNew = diffWeeks(new Date(libro.fechaPublicacion), new Date()) <= 2;

  // Format the publication date
  const formattedFechaPublicacion = libro.fechaPublicacion
    ? new Date(libro.fechaPublicacion).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  // Generate additional information about the book
  const additionalInfo = [
    libro.autor && `Autor: ${libro.autor}`,
    libro.genero && `Género: ${libro.genero}`,
    libro.isbn && `ISBN: ${libro.isbn}`,
    libro.estado && `Estado: ${libro.estado}`,
    libro.edicion && `Edición: ${libro.edicion}`,
    libro.tapa && `Tapa: ${libro.tapa}`,
    libro.idioma && `Idioma: ${libro.idioma}`,
    libro.ubicacion && `Ubicación: ${libro?.ubicacion?.ciudad || 'No encontrada'}`,
    formattedFechaPublicacion && `Publicado: ${formattedFechaPublicacion}`,
    libro.edad && `Edad recomendada: ${libro.edad}`,
  ].filter(Boolean);

  return (
    <div className="infoContainer">
      {/* Display "Nuevo" if the book is new */}
      {isNew && <div className="informacion">Nuevo</div>}

      {/* Display the book title */}
      <h2>{libro.titulo}</h2>

      {/* Display the price and offer if available */}
      {libro.oferta ? (
        <>
          <h3>
            <s>${libro.precio.toLocaleString('es-CO')}</s>
          </h3>
          <h2 className="accent">${libro.oferta.toLocaleString('es-CO')}</h2>
        </>
      ) : (
        <h2 className="accent">${libro.precio.toLocaleString('es-CO')}</h2>
      )}

      {/* Display additional information */}
      {additionalInfo.map((item, index) => (
        <p key={index}>{item}</p>
      ))}
    </div>
  );
}