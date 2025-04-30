/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { google } from 'googleapis'
import SMTPPool from 'nodemailer/lib/smtp-pool'
dotenv.config()

const yourEmail = process.env.EMAIL
const gmailHost = 'smtp.live.com'
const mailPort = 587
const senderEmail = process.env.EMAIL

/**
 * Send mail
 * @param {string} to
 * @param {string} subject
 * @param {string[html]} htmlContent
 * @returns
 */
const oAuth2Client = new google.auth.OAuth2(process.env.EMAIL_CLIENT_ID, process.env.EMAIL_CLIENT_SECRET, 'https://developers.google.com/oauthplayground')
oAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN })

const sendEmail = async (to: string, subject: string, htmlContent: string): Promise<any> => {
  const accessToken = await oAuth2Client.getAccessToken()
  const transporter = (nodemailer as any).createTransport({
    // host: gmailHost,
    // port: mailPort,

    service: 'hotmail',
    // host: gmailHost, // Removed as 'service' is already specified
    secure: false, // use SSL - TLS
    auth: {
      // type: 'OAuth2',
      user: yourEmail,
      pass: process.env.EMAIL_PASSWORD,
      // clientId: process.env.EMAIL_CLIENT_ID,
      // clientSecret: process.env.EMAIL_CLIENT_SECRET,
      // refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      // accessToken: accessToken.token
    },
    tls: {
      ciphers: 'SSLv3', // Ensures compatibility with Hotmail's SMTP server
    }
  })

  const mailOptions = {
    from: `${process.env.BRAND_NAME} <${senderEmail}>`,
    to,
    subject,
    html: htmlContent,
    attachments: [{
      filename: 'logo.png',
      path: `${__dirname}/data/images`,
      cid: 'logo@meridian'
    }]
  }
  const res = await transporter.sendMail(mailOptions) // promise
  return res as any
}

export { sendEmail }
