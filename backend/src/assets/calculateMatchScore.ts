import { levenshteinDistance } from './levenshteinDistance.js'
import { changeToArray } from './changeToArray.js'
export const calculateMatchScore = (infoObject: object, queryWords: string[], query: string): number => {
  /**
   * Calcula el puntaje de coincidencia entre un objeto y una consulta.
   * El puntaje se basa en la distancia de Levenshtein entre las palabras de la consulta y los valores del objeto.
   * Query se usa para determinar la tolerancia de letras equivocadas.
   * @param {object} infoObject - El objeto a comparar.
   * @param {string[]} queryWords - Las palabras de la consulta.
   * @param {string} query - La consulta completa.
   * @returns {number} - El puntaje de coincidencia.
   * @example
   * const infoObject = { name: 'John Doe', age: 30, hobbies: ['reading', 'gaming'] };
   * const queryWords = ['John', 'Doe'];
   * const query = 'John Doe';
   * const score = calculateMatchScore(infoObject, queryWords, query);
   * console.log(score); // Output: 2
   */
  
  const queryWordsArray = changeToArray(queryWords)
  const valueElements = Object.values(infoObject)
  const stringValueWords: string[] = []

  let score: number = 0
  const tolerance: number = query.length > 3 ? 2 : 0 // Tolerancia de letras equivocadas

  valueElements.forEach((element) => {
    if (typeof element === 'string') {
      stringValueWords.push(...changeToArray(element))
    } else if (Array.isArray(element)) {
      element.forEach((word) => {
        stringValueWords.push(...changeToArray(word))
      })
    }
  })

  const matchedWords: Set<string> = new Set() // Usamos un Set para evitar duplicados

  for (const queryWord of queryWordsArray) {
    stringValueWords.forEach(word => {
      const distance: number = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
      if (distance <= tolerance && !matchedWords.has(word)) {
        score += 1 // Incrementa el score si la distancia está dentro del umbral de tolerancia
        matchedWords.add(word) // Agrega la palabra al Set
      }
    })
  }

  return score
}
