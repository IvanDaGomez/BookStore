export class EmailsController {
    constructor({ EmailsModel }) {
        this.getAllEmails = async (req, res, next) => {
            try {
                const emails = await this.EmailsModel.getAllEmails();
                res.json(emails);
            }
            catch (err) {
                next(err);
            }
        };
        this.getEmailById = async (req, res, next) => {
            try {
                const emailId = req.params.emailId;
                if (!emailId) {
                    return res.status(400).json({ error: 'ID de notificación requerido' });
                }
                const email = await this.EmailsModel.getEmailById(emailId);
                res.json(email);
            }
            catch (err) {
                next(err);
            }
        };
        this.createEmail = async (req, res, next) => {
            try {
                const data = req.body;
                if (!data.email) {
                    return res.status(400).json({ error: 'Datos inválidos: Se requiere email' });
                }
                const email = await this.EmailsModel.createEmail(data);
                res.status(201).json(email);
            }
            catch (err) {
                next(err);
            }
        };
        this.deleteEmail = async (req, res, next) => {
            try {
                const email = req.params.email;
                if (!email) {
                    return res.status(400).json({ error: 'ID de notificación requerido' });
                }
                await this.EmailsModel.deleteEmail(email);
                res.status(200).json({ message: 'Notificación eliminada con éxito' });
            }
            catch (err) {
                next(err);
            }
        };
        this.EmailsModel = EmailsModel;
    }
}
