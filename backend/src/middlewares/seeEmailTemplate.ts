import express from 'express'
import { templates, DataType } from '../assets/email/htmlTemplates.js'
import { mockEmailData } from './mockEmailData.js'

export function seeEmailTemplate (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { template } = req.params
    if (!template) {
      throw new Error('Template name is required')
    }
    const templateFound = templates.find(t => t.name === template)

    if (!templateFound) {
      throw new Error('Template not found')
    }
    const templateContent = templateFound(
      mockEmailData as Required<DataType>,
      true
    )

    res.json({
      content: templateContent
    })
  } catch (error) {
    next(error)
  }
}
