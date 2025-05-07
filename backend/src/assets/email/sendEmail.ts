/* eslint-disable no-unused-vars */
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { google } from 'googleapis'
import { __dirname } from '../config.js'
dotenv.config()

const yourEmail = process.env.GOOGLE_EMAIL
const yourEmailPassword = process.env.GOOGLE_EMAIL_PASSWORD

const gmailHost = process.env.GMAIL_HOST
/**
 * Send mail
 * @param {string} to
 * @param {string} subject
 * @param {string[html]} htmlContent
 * @returns
 */
const oAuth2Client = new google.auth.OAuth2(
  process.env.EMAIL_CLIENT_ID,
  process.env.EMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground' // OAuth2 redirect URL
)
oAuth2Client.setCredentials({ refresh_token: process.env.EMAIL_REFRESH_TOKEN })

const sendEmail = async (
  to: string,
  subject: string,
  htmlContent: string
): Promise<any> => {
  try {
    // Get access token from OAuth2 client
    // const accessToken = await oAuth2Client.getAccessToken()

    // Set up the transporter using OAuth2
    const transporter = nodemailer.createTransport({
      host: gmailHost,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: yourEmail, // Your email address
        pass: yourEmailPassword
      }
    })

    // Set up email options
    const mailOptions = {
      from: `${process.env.BRAND_NAME} <${yourEmail}>`, // Your email address
      to, // Recipient
      subject, // Subject of the email
      html: htmlContent, // HTML content of the email
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/data/images/logo.png`, // Ensure the correct file path
          cid: 'logo@meridian' // CID for inline images
        }
      ]
    }

    // Send email
    const res = await transporter.sendMail(mailOptions) // Send the email asynchronously
    return res // Return response
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}

export { sendEmail }
