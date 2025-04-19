import { getBookKeyInfo } from '../../models/books/local/getBookKeyInfo.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { AuthToken } from '../../types/authToken.js'
import { BookObjectType } from '../../types/book.js'

export async function updateUserSearchHistory (userObj: AuthToken, book: Partial<BookObjectType>, action: 'query' | 'openedBook') {
  const maxScore: number = 30
  const minScore: number = 0
  const seenBookIncrement: number = 7
  const openedBookIncrement: number = 5
  const decrement: number = 2

  const userId = userObj._id
  const user = await UsersModel.getUserById(userId)
  const bookKeyInfo = getBookKeyInfo(book)
  const userPreferences = user.historialBusquedas
  // 🔹 Restar 1 punto a todos (mínimo 0)
  Object.keys(userPreferences).forEach(key => {
    userPreferences[key] = userPreferences[key] - decrement
    if (userPreferences[key] <= minScore) {
      delete userPreferences[key]
    }
  })
  // 🔹 Ajustar puntuación según acción
  const increment = action === 'openedBook' ? seenBookIncrement : openedBookIncrement
  for (const key of bookKeyInfo) {
    userPreferences[key] = Math.min((userPreferences[key] || minScore) + increment, maxScore)
  }
  // Guardar los cambios en la base de datos
  await UsersModel.updateUser(userId, { historialBusquedas: userPreferences })

}
