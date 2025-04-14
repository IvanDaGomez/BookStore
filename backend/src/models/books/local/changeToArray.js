export function changeToArray (element) {
  /*
  Converts a string of text or array into an array
  */
  if (typeof element === 'string' && element.trim() !== '') {
    return element.split(' ').filter(Boolean)
  }
  return element || [] // Devuelve un array vacío si el elemento es nulo o indefinido
}
