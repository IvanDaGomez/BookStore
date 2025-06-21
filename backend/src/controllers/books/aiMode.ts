import express from 'express'
import { sendOpenAIRequest } from './sendOpenAIRequest.js'
import fs from 'node:fs/promises'
import { __dirname, s3 } from '../../assets/config.js'
import { Express } from 'express-serve-static-core'
import { deleteFileFromS3 } from '../../assets/aws-assets/deleteObject.js'
export const AIMode = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<express.Response | void> => {
  try {
    /**
       * @description This function handles the AI mode for book creation.
        Steps:
        1. Receives the photo of the book cover and is uploaded with multer.
        2. The filepath is then used with the OpenAI API to get the book info.
        3. The image is then deleted from the server as it is not needed anymore.
        4. The book info is then returned to the client.
    */

    const file = req.file as Express.MulterS3.File | undefined
    console.log('Received file:', file)
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }
    const path = file.filename || file.location
    const endpoint = path.split('amazonaws.com')[1] // Extract the path after the S3 bucket URL
    const imagePath = process.env.IMAGES_URL + endpoint // Construct the full image URL
    //const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path}`
    console.log('Image path:', imagePath)
    const data = await sendOpenAIRequest(imagePath)
    if (!data) {
      return res.status(500).json({ error: 'No data received from OpenAI' })
    }
    // Delete the file after processing
    // Note: The file is stored in S3, so we need to delete it from there
    // if local file = __dirname + '/uploads/' + path
    await deleteFileFromS3(path)
    return res.json(data)
  } catch (err) {
    next(err)
  }
}
