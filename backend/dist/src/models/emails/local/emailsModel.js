import fs from 'node:fs/promises';
const EMAILS_FILE_PATH = './models/emails.json';
class EmailsModel {
    static async getAllEmails() {
        const data = await fs.readFile(EMAILS_FILE_PATH, 'utf-8');
        return data.length > 0 ? JSON.parse(data) : [];
    }
    static async getEmailById(id) {
        const emails = await this.getAllEmails();
        const email = emails.find(email => email === id);
        if (!email) {
            throw new Error('No se encontró el correo');
        }
        return email;
    }
    static async createEmail(data) {
        const emails = await this.getAllEmails();
        if (emails.some(email => email === data.email)) {
            throw new Error('Este correo ya fue ingresado');
        }
        emails.push(data.email);
        await fs.writeFile(EMAILS_FILE_PATH, JSON.stringify(emails, null, 2));
        return data;
    }
    static async deleteEmail(emailGiven) {
        const emails = await this.getAllEmails();
        const emailIndex = emails.findIndex(email => email === emailGiven);
        if (emailIndex === -1) {
            throw new Error('Correo no encontrado');
        }
        emails.splice(emailIndex, 1);
        await fs.writeFile(EMAILS_FILE_PATH, JSON.stringify(emails, null, 2));
        return { message: 'Correo eliminado correctamente' };
    }
}
export { EmailsModel };
