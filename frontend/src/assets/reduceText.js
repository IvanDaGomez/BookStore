function reduceText(texto, maxTexto) {
  if (texto.length <= maxTexto) return texto
  const recortado = texto.substring(0, maxTexto)
  let word = texto.substring(0, recortado.lastIndexOf(' '))
  if ([',', '.', ';'].includes(word[word.length - 1]) ) {
    word = word.substring(0, word.length - 1)
  }
  return word + '...'
}
function reduceTextByFirstWord (texto) {
  return texto.split(' ')[0]
}
export { reduceText, reduceTextByFirstWord }
