import { NextFunction, Request, Response } from 'express';
import path from 'node:path';
import fs from 'node:fs/promises';
import { __dirname } from '../assets/config.js';
async function statsHandler(req: Request, res: Response, next: NextFunction) {
  
try {
    const jsonFilePaths = ['transactions.json', 
      'books.json', 
      'users.json',
      'trends.json',]
    const csvFilePaths = ['transactions.csv']
    const data: any = {}
    for (const filePath of jsonFilePaths) {
      const fullFilePath = path.join(__dirname, 'data', filePath)
      const info = await fs.readFile(fullFilePath, 'utf-8')
      const jsonData = JSON.parse(info) 
      data[filePath.replace('.json', '')] = jsonData
    }
    for (const filePath of csvFilePaths) {
      const fullFilePath = path.join(__dirname, 'data', filePath)
      const info = await fs.readFile(fullFilePath, 'utf-8')
      const csvData = info.split('\n').map((row) => row.split(','))
      const jsonData = csvData.map((row) => {
        const obj: any = {}
        for (let i = 0; i < row.length; i++) {
          obj[csvData[0][i]] = row[i]
        }
        return obj
      })
      data[filePath] = jsonData
    }
    res.status(200).json(data)
} catch (error) {
  next(error)
}
}
export { statsHandler }