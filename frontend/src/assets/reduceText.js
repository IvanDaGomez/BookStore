function reduceText (texto, maxTexto) {
  if (texto.length <= maxTexto) return texto
  const recortado = texto.substring(0, maxTexto)
  return texto.substring(0, recortado.lastIndexOf(' ')) + '...'
}
function reduceTextByFirstWord (texto) {
  return texto.split(' ')[0]
}
export { reduceText, reduceTextByFirstWord }
