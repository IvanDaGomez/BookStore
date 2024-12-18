/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { google } from 'googleapis'
dotenv.config()

const yourEmail = process.env.EMAIL
const yourPass = process.env.EMAIL_PASSWORD
const gmailHost = 'smtp.gmail.com'
const outlookHost = 'smtp.office365.com'
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

const sendEmail = async (to, subject, htmlContent) => {
  const accessToken = await oAuth2Client.getAccessToken()
  const transporter = nodemailer.createTransport({
    host: gmailHost,
    port: mailPort,
    secure: false, // use SSL - TLS
    auth: {
      type: 'OAuth2',
      user: yourEmail,
      clientId: process.env.EMAIL_CLIENT_ID,
      clientSecret: process.env.EMAIL_CLIENT_SECRET,
      refreshToken: process.env.EMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  })

  const mailOptions = {
    from: `${process.env.BRAND_NAME} ${senderEmail}`,
    to,
    subject,
    html: htmlContent
  }
  const res = await transporter.sendMail(mailOptions) // promise
  return res
}

export { sendEmail }
