import fs from 'node:fs/promises'
export async function getTrends (n = 20) {
  try {
    const file = await fs.readFile('./models/trends.json', 'utf-8')
    const data = JSON.parse(file)

    const trends = []

    for (const [key, score] of Object.entries(data.palabrasClave || {})) {
      trends.push({ nombre: key, puntuacion: score })
    }

    for (const [key, score] of Object.entries(data.librosBuscados || {})) {
      trends.push({ nombre: key, puntuacion: score * 1.2 })
    }

    for (const [key, score] of Object.entries(data.librosAbiertos || {})) {
      trends.push({ nombre: key, puntuacion: score * 1.5 })
    }

    // Ordenar por puntuación y devolver solo los nombres
    return trends
      .sort((a, b) => b.puntuacion - a.puntuacion)
      .slice(0, n)
      .map(item => item.nombre)
  } catch (error) {
    console.error('Error al obtener tendencias:', error)
    return []
  }
}
