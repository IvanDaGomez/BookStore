import sharp from 'sharp'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { existsSync, mkdirSync } from 'fs'
import { ImageType } from '../types/objects'

const __dirname = dirname(fileURLToPath(import.meta.url))
// Función para asegurarse de que la carpeta "uploads" existe

// Función para crear el collage
async function crearCollage (imagenes: ImageType[], outputFileName: string): Promise<string> {
  const size = 200 // Tamaño del collage
  const uploadsPath = join(__dirname, '../', 'uploads')
  const outputPath = join(uploadsPath, outputFileName) // Ruta del archivo generado

  // Asegurarse de que la carpeta uploads existe

  const collage = sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 255, g: 255, b: 255 } // Fondo blanco
    }
  })

  const composiciones = imagenes.slice(0, 4).map((imagen, index) => ({
    input: imagen, // Ruta o buffer de la imagen
    top: Math.floor(index / 2) * (size / 2), // Posición y
    left: (index % 2) * (size / 2) // Posición x
  }))

  // Crear el collage y guardarlo en la carpeta uploads
  await collage
    .composite(composiciones)
    .resize(size, size)
    .toFile(outputPath) // Guarda el archivo

  return outputPath // Devuelve la ruta del archivo generado
}
export { crearCollage }
