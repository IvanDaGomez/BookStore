import fs from 'node:fs/promises'
import path from 'node:path'
import express from 'express'
// File paths for different events
const files = {
  signups: './data/signups.csv',
  booksUploaded: './data/booksUploaded.csv',
  searches: './data/searches.csv',
  messages: './data/messages.csv',
  transactions: './data/transactions.csv'
}

// Helper to append data to a CSV
async function appendToCSV (filePath: string, data:
  { [key: string]: string | number | boolean | undefined}
) {
  const fullPath = path.resolve(filePath)

  // Check if file exists
  let fileExists = true
  try {
    await fs.access(fullPath)
  } catch {
    fileExists = false
  }

  // If the file doesn't exist, write the header row
  if (!fileExists) {
    const header = Object.keys(data).join(',') + '\n'
    await fs.writeFile(fullPath, header, 'utf-8')
  }

  // Append the new data as a row
  const row = Object.values(data).join(',') + '\n'
  await fs.appendFile(fullPath, row, 'utf-8')
}

async function handleStats (req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const now = new Date().toISOString() // Current timestamp

    switch (true) {
      case (req.url.includes('/api/users')): {
        // Record user signups
        let action
        if (req.url === '/api/users' && req.method === 'POST') {
          action = 'signUp'
        } else if (req.url.includes('/api/users/') && req.method === 'GET') {
          action = 'login'
        } else return
        const data = { date: now, action }
        await appendToCSV(files.signups, data)
        break
      }

      case (req.url === '/api/books' && req.method === 'POST'): {
        // Record book uploads
        const data = { date: now, bookTitle: req.body.titulo }
        await appendToCSV(files.booksUploaded, data)
        break
      }

      case (req.url.includes('/api/books/query') && req.method === 'GET'): {
        // Record searches
        const q = req.query.q as string
        const data = { date: now, query: q }
        await appendToCSV(files.searches, data)
        break
      }

      case (req.url === '/api/messages' && req.method === 'POST'): {
        // Record messages
        const data = { date: now, recipient: 'example_recipient' }
        await appendToCSV(files.messages, data)
        break
      }

      case (req.url === '/api/transactions' && req.method === 'POST'): {
        // Record transactions
        const data = { date: now, amount: req.body.price }
        await appendToCSV(files.transactions, data)
        break
      }
      default: {
        next()
      }
    }

    next() // Pass control to the next middleware
  } catch (err) {
    next(err)
  }
}
export { handleStats }
