import express from "express";
import { sendOpenAIRequest } from "./sendOpenAIRequest.js";
import fs from 'node:fs/promises'
import { __dirname } from "../../assets/config.js";
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
      const file = req.file as Express.Multer.File | undefined
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' })
      }
      const path = file.filename
      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${path}`
      const data = await sendOpenAIRequest(imageUrl, path)
      if (!data) {
        return res.status(500).json({ error: 'No data received from OpenAI' })
      }
      // Delete the file after processing
      const filePath = __dirname + `/uploads/${path}`
      await fs.rm(filePath)
      return res.json(data)
    } catch (err) {
      next(err)
    }
}