import fs from 'node:fs/promises'
import { pool } from './config.js'
const filePaths = [
  'books.json',
  'booksBackStage.json',
  'collections.json',
  'conversations.json',
  'emails.json',
  'failedTransactions.json',
  'messages.json',
  'notifications.json',
  'transactions.json',
  'users.json'
]

for (const filePath of filePaths) {
  const file = `./models/${filePath}`
  try {
    const data = await fs.readFile(file, 'utf-8')
    const jsonData = JSON.parse(data)
    for (const item of jsonData) {
      const keys = Object.keys(item)
      const values = Object.values(item)
      const placeholders = keys.map((_, index) => `$${index + 1}`).join(', ')
      const query = `INSERT INTO ${filePath.replace('.json', '')} (${keys.join(', ')}) VALUES (${placeholders})`
      await pool.query(query, values)
    }
    console.log(`Data from ${file} inserted successfully`)
  } catch (err) {
    console.error(`Error inserting data from ${file}:`, err)
  }
}
