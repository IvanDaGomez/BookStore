import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
import { changeToArray } from './changeToArray.js'
export const calculateMatchScore = (book, queryWords, query) => {
  const queryWordsArray = changeToArray(queryWords)
  const valueElements = Object.values(book)
  const stringValueWords = []

  let score = 0
  const tolerance = query.length > 3 ? 2 : 0 // Tolerancia de letras equivocadas

  valueElements.forEach((element) => {
    if (typeof element === 'string') {
      stringValueWords.push(...changeToArray(element))
    } else if (Array.isArray(element)) {
      element.forEach((word) => {
        stringValueWords.push(...changeToArray(word))
      })
    }
  })

  const matchedWords = new Set() // Usamos un Set para evitar duplicados

  for (const queryWord of queryWordsArray) {
    stringValueWords.forEach(word => {
      const distance = levenshteinDistance(word.toLowerCase(), queryWord.toLowerCase())
      if (distance <= tolerance && !matchedWords.has(word)) {
        score += 1 // Incrementa el score si la distancia está dentro del umbral de tolerancia
        matchedWords.add(word) // Agrega la palabra al Set
      }
    })
  }

  return score
}
