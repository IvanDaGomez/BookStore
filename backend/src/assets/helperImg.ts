import sharp from 'sharp'

async function helperImg (filePath: string, filename: string, group: string, size: number = 300): Promise<void> {
  try {
    await sharp(filePath)
      .resize(size)
      .toFile(`./optimized/${group}/${filename}.png`)
  } catch (error) {
    throw new Error(`Error procesando imagen ${filename}: ${error}`)
  }
}

export { helperImg }
