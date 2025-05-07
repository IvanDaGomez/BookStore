import { sendEmail } from './sendEmail.js'

await sendEmail(
  'ivandavidgomezsilva@hotmail.com',
  'Test Email',
  '<h1>Test</h1>'
)
console.log('Email sent successfully')
