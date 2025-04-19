import { updateTrends } from '../../assets/trends/updateTrends.js'
import { updateUserPreferences } from '../../assets/trends/updateUserPreferences.js'
import { updateUserSearchHistory } from '../../assets/trends/updateUserSearchHistory.js'
import { AuthToken } from '../../types/authToken'
import { BookObjectType } from '../../types/book'

export async function updateData (user: AuthToken, bookCopy: Partial<BookObjectType>, action: 'query' | 'openedBook') {
  await updateUserPreferences(user, bookCopy, action)
  await updateUserSearchHistory(user, bookCopy, action)
  await updateTrends(bookCopy, action)
}
