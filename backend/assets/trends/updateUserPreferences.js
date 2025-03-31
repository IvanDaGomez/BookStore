import { getBookKeyInfo } from '../../models/books/local/getBookKeyInfo.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
export async function updateUserPreferences (userObj, book, action) {
  const maxScore = 50
  const minScore = 0
  const seenBookIncrement = 5
  const openedBookIncrement = 4
  const decrement = 1
  try {
    if (!userObj) {
      console.error('User is null, not updating preferences')
      return
    }

    const userId = userObj._id
    const user = await UsersModel.getUserById(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const bookKeyInfo = getBookKeyInfo(book)

    const userPreferences = user?.preferencias || {}
    // 🔹 Restar 1 punto a todos (mínimo 0)
    Object.keys(userPreferences).forEach(key => {
      userPreferences[key] = Math.max(userPreferences[key] - decrement, minScore)
      if (userPreferences[key] === minScore) {
        delete userPreferences[key]
      }
    })

    // 🔹 Ajustar puntuación según acción
    const increment = action === 'openedBook' ? seenBookIncrement : openedBookIncrement
    for (const key of bookKeyInfo) {
      userPreferences[key] = Math.min((userPreferences[key] || minScore) + increment, maxScore)
    }

    // Guardar los cambios en la base de datos
    await UsersModel.updateUser(userId, { preferencias: userPreferences })
  } catch (error) {
    console.error('Error updating user search history:', error)
  }
}
