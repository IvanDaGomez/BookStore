import fs from 'node:fs/promises'
export async function getTrends (n: number = 20): Promise<string[]> {
  try {
    const file = await fs.readFile('./models/trends.json', 'utf-8')
    const data: {
      [key: string]: number
    } = JSON.parse(file) // data debería ser un array de objetos con { nombre, puntuacion }

    // Ordenar por puntuación y devolver solo los nombres
    const completeInfo = Object.entries(data) // Convertimos { clave: valor } en [[clave, valor]]
      .map(([nombre, puntuacion]) => ({ nombre, puntuacion })) // Convertimos en un array de objetos
      .sort((a, b) => b.puntuacion - a.puntuacion) // Ordenamos por puntuación descendente
      .slice(0, n) // Limitamos los resultados
    return completeInfo.map((trend) => trend.nombre) // Devolvemos solo los nombres
  } catch (error) {
    return []
  }
}
