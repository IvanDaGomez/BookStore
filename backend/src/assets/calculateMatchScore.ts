import { levenshteinDistance } from './levenshteinDistance.js'
import { changeToArray } from './changeToArray.js'
const FIELD_WEIGHTS: Record<string, number> = {
  titulo: 5,
  autor: 3,
  keywords: 2,
  descripcion: 1,
  genero: 1,
  idioma: 1,
  edad: 1,
  edicion: 1,
  isbn: 2
  // Puedes ajustar según tu contexto
}

export const calculateMatchScore = (
  infoObject: object,
  queryWords: string[],
  query: string
): number => {
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
  const tolerance: number = query.length > 3 ? 2 : 0

  let totalScore = 0
  const matchedWords = new Set<string>()

  for (const [key, value] of Object.entries(infoObject)) {
    const weight = FIELD_WEIGHTS[key as string] ?? 0.5 // Campos no especificados valen poco

    const wordsToMatch: string[] = []

    if (typeof value === 'string') {
      wordsToMatch.push(...changeToArray(value))
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') {
          wordsToMatch.push(...changeToArray(item))
        }
      }
    }

    for (const queryWord of queryWordsArray) {
      for (const word of wordsToMatch) {
        const distance = levenshteinDistance(
          word.toLowerCase(),
          queryWord.toLowerCase()
        )
        if (distance <= tolerance && !matchedWords.has(word)) {
          totalScore += weight
          matchedWords.add(word)
        }
      }
    }
  }

  return totalScore
}
