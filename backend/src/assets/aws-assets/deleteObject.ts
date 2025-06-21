import { s3 } from '../config.js'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'

const deleteFileFromS3 = async (key: string) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
      Key: key // por ejemplo: "uploads/12345-miarchivo.png"
    })

    await s3.send(command)
    if (process.env.NODE_ENV === 'development') {
      console.log('Archivo eliminado de S3:', key)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error al eliminar archivo de S3:', error)
    }
  }
}
export { deleteFileFromS3 }
