/* eslint-disable react/prop-types */
export default function InfoContainer({ libro }) {
  function diff_weeks (dt2, dt1) {
    // Calculate the difference in milliseconds between dt2 and dt1
    let diff = (dt2.getTime() - dt1.getTime()) / 1000
    // Convert the difference from milliseconds to weeks by dividing it by the number of milliseconds in a week
    diff /= (60 * 60 * 24 * 7)
    // Return the absolute value of the rounded difference as the result
    return Math.abs(Math.round(diff))
  }
  return(<>
  <div className='infoContainer'>
            {(diff_weeks(new Date(libro.fechaPublicacion), new Date()) <= 2) ? <div className='informacion'>Nuevo</div> : <></>}
            <h2>{libro.titulo}</h2>
            {libro.oferta
              ? (
                <>
                  <h3>
                    <s>${libro.precio.toLocaleString('es-CO')}</s>
                  </h3>
                  <h2>${libro.oferta.toLocaleString('es-CO')}</h2>
                </>
                )
              : (
                <h2>${libro.precio.toLocaleString('es-CO')}</h2>

                )}
            {[

              libro.autor && `Autor: ${libro.autor}`,
              libro.genero && `Género: ${libro.genero}`,
              libro.isbn && `ISBN: ${libro.isbn}`,
              libro.estado && `Estado: ${libro.estado}`,
              libro.edicion && `Edición: ${libro.edicion}`,
              libro.tapa && `Tapa: ${libro.tapa}`,
              libro.idioma && `Idioma: ${libro.idioma}`,
              libro.ubicacion && `Ubicación: ${libro?.ubicacion?.ciudad || 'No encontrada'}`,
              libro.fechaPublicacion && `Publicado: ${new Date(libro.fechaPublicacion)
                          .toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}`,
              libro.edad && `Edad recomendada: ${libro.edad}`
            ]
              .filter(Boolean)
              .map((item, index) => (
                <p key={index}>{item}</p>
              ))}

          </div>
  </>)
}