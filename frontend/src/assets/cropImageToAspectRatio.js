// Función para recortar la imagen con aspect ratio 2/3
const cropImageToAspectRatio = (file, aspectRatio) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        let width, height, sx, sy, sw, sh

        // Si la imagen es más ancha que alta
        if (img.width / img.height > aspectRatio) {
          width = img.height * aspectRatio
          height = img.height
          sx = (img.width - width) / 2 // Recortar desde el centro horizontalmente
          sy = 0
          sw = width
          sh = height
        } else {
          width = img.width
          height = img.width / aspectRatio
          sx = 0
          sy = (img.height - height) / 2 // Recortar desde el centro verticalmente
          sw = width
          sh = height
        }

        canvas.width = width
        canvas.height = height

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height)
        // La URL no es permanente
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Error al crear blob de imagen'))
            }
          },
          file.type
        )
      }
    }
    reader.onerror = (err) => reject(err)
  })
}
export { cropImageToAspectRatio }
