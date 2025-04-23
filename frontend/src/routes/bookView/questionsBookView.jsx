/* eslint-disable react/prop-types */
import { handleSetPregunta } from "./handleSetPregunta";
import { handleSubmitPregunta } from "./handleSubmitPregunta";

export default function QuestionsBookView({ libro }) {
  if (!libro) return <></>
  return(<>
  <div className='comments' id='comments'>
            <div className='separar'>
              <h1>Pregúntale al vendedor</h1>
              <h1>Preguntas realizadas</h1>
            </div>
            <div className='separar'>
              <div>
                <div className='question-buttons'>
                  <button className='botonInverso' onClick={() => handleSetPregunta('costo')}>Costo y tiempo de envío</button>
                  <button className='botonInverso' onClick={() => handleSetPregunta('devolucion')}>Devoluciones gratis</button>
                  <button className='botonInverso' onClick={() => handleSetPregunta('metodoPago')}>Medios de pago</button>
                  <button className='botonInverso' onClick={() => handleSetPregunta('estadoProducto')}>Estado del producto</button>
                </div>

                <div className='ask-section'>
                  <textarea type='text' className='inputPregunta' placeholder='Escribe tu pregunta...' rows='2' />
                  <button onClick={handleSubmitPregunta} className='ask-button'>Preguntar</button>
                </div>
              </div>
              <div className='comentarios'>
                {/* Mensaje
                          [mensaje, respuesta]
                      */}

                {libro && libro.mensajes && libro.mensajes.filter(mensaje => mensaje[0] && mensaje[1]).length !== 0
                  ? libro.mensajes.filter(mensaje => mensaje[0] && mensaje[1]).map((element, index) => (
                    <div className='mensajeContainer' key={index}>
                      <p className='mensaje'>{element[0]}</p>
                      <p className='respuesta'>{element[1]}</p>
                    </div>
                  ))
                  : <div className='mensajeContainer'>
                    <p>No hay preguntas sobre este libro</p>
                  </div>}
              </div>
            </div>
          </div>
  </>)
}