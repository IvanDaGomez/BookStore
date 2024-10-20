import sharp from 'sharp'

async function helperImg (filePath, filename, group, size = 300) {
  try {
    await sharp(filePath)
      .resize(size)
      .toFile(`./optimized/${group}/${filename}.png`)
  } catch (error) {
    console.error(`Error processing ${filename}:`, error)
  }
}

export { helperImg }
