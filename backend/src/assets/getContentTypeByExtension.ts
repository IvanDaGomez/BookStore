import { exp } from '@tensorflow/tfjs'
import { extname } from 'path'

function getContentTypeByExtension (filename: string): string {
  const ext = extname(filename).toLowerCase()
  switch (ext) {
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.webp':
      return 'image/webp'
    default:
      return 'application/octet-stream'
  }
}

export { getContentTypeByExtension }
