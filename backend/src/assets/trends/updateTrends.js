import fs from 'node:fs/promises'
import { getBookKeyInfo } from '../../models/books/local/getBookKeyInfo.js'

export async function updateTrends (book, action) {
  /*
    Updates the file trends.json, tracking website trends.

    Inputs:
      book: { _id: str, ... (book information) }
      action: 'openedBook' | 'query'

    Output:
      undefined (modifies the trends file)
  */
  const validActions = ['openedBook', 'query']
  const decrement = 1
  const incrementSeenBook = 4
  const incrementOpenedBook = 6
  const TRENDS_FILE = './models/trends.json'
  const MAX_TREND_SCORE = 200
  try {
    // 🔹 Ensure valid action
    if (!validActions.includes(action)) {
      console.warn(`⚠ Invalid action: "${action}". Skipping trend update.`)
      return
    }

    let trends = {}

    // 🔹 Read trends file or create if missing
    try {
      const data = await fs.readFile(TRENDS_FILE, 'utf-8')
      trends = JSON.parse(data)
    } catch (error) {
      console.log('📂 No trend file found. Creating a new one...')
      await fs.writeFile(TRENDS_FILE, JSON.stringify({}, null, 2)) // Ensure file exists
    }

    // 🔹 Reduce old values (trend decay)
    let hasChanges = false
    for (const key in trends) {
      trends[key] = Math.max(trends[key] - decrement, 0)
      if (trends[key] === 0) {
        delete trends[key] // Remove inactive trends
        hasChanges = true
      }
    }

    // 🔹 Get book keywords
    const bookKeyInfo = getBookKeyInfo(book)
    if (!bookKeyInfo || bookKeyInfo.length === 0) {
      console.warn('⚠ No key info found for book. Skipping trend update.')
      return
    }

    // 🔹 Increase trends based on action
    const increment = action === 'openedBook' ? incrementOpenedBook : incrementSeenBook
    for (const key of bookKeyInfo) {
      const newScore = Math.min((trends[key] || 0) + increment, MAX_TREND_SCORE)
      if (trends[key] !== newScore) hasChanges = true // Detect changes
      trends[key] = newScore
    }

    // 🔹 Only save if trends changed
    if (hasChanges) {
      await fs.writeFile(TRENDS_FILE, JSON.stringify(trends, null, 2))
      // console.log('✅ Global trends updated:', trends)
    }
    // } else {
    //   console.log('ℹ No changes in trends, skipping file write.')
    // }
  } catch (error) {
    console.error('❌ Error updating global trends:', error)
  }
}
