export function handleSetPregunta (str) {
    const inputPregunta = document.querySelector('.inputPregunta')

    if (str === 'costo') {
      inputPregunta.value = '¿Cuál es el costo del producto?'
    } else if (str === 'devolucion') {
      inputPregunta.value = '¿Cómo puedo hacer una devolución?'
    } else if (str === 'metodoPago') {
      inputPregunta.value = '¿Qué métodos de pago aceptan?'
    } else if (str === 'estadoProducto') {
      inputPregunta.value = '¿En qué estado se encuentra el producto?'
    }
  }