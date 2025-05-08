import { IEmailsModel } from '../../types/models'
import express from 'express'
import { ID } from '../../types/objects'
export class EmailsController {
  private EmailsModel: IEmailsModel
  constructor ({ EmailsModel }: { EmailsModel: IEmailsModel }) {
    this.EmailsModel = EmailsModel
  }

  getAllEmails = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const emails = await this.EmailsModel.getAllEmails()
      res.json(emails)
    } catch (err) {
      next(err)
    }
  }

  getEmailById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const emailId = req.params.email_id as ID | undefined
      if (!emailId) {
        return res.status(400).json({ error: 'ID de correo requerido' })
      }
      const email = await this.EmailsModel.getEmailById(emailId)

      res.json(email)
    } catch (err) {
      next(err)
    }
  }

  createEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const data = req.body as { email: string }

      if (!data.email) {
        return res
          .status(400)
          .json({ error: 'Datos inválidos: Se requiere correo' })
      }
      const email = await this.EmailsModel.createEmail(data)
      res.status(201).json(email)
    } catch (err) {
      next(err)
    }
  }

  deleteEmail = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const email = req.params.email as string | undefined

      if (!email) {
        return res.status(400).json({ error: 'ID de correo requerido' })
      }

      await this.EmailsModel.deleteEmail(email)

      res.status(200).json({ message: 'Correo eliminado con éxito' })
    } catch (err) {
      next(err)
    }
  }
}
