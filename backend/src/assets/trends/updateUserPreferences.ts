import { getBookKeyInfo } from '../../models/books/local/getBookKeyInfo.js'
import { UsersModel } from '../../models/users/local/usersLocal.js'
import { AuthToken } from '../../types/authToken.js'
import { BookObjectType } from '../../types/book.js'
export async function updateUserPreferences (userObj: AuthToken, book: Partial<BookObjectType>, action: 'query' | 'openedBook') {
  /**
   * 🔹 Función para actualizar las preferencias del usuario en función de la acción realizada
   *  🔹 Parámetros
   *  - userObj: Objeto de usuario que contiene el ID del usuario
   *  - book: Objeto de libro que contiene información sobre el libro
   *  - action: Acción realizada por el usuario ('query' o 'openedBook')
   *  🔹 Lógica
   *  - Se definen las puntuaciones máximas y mínimas, así como los incrementos y decrementos
   *  - Se obtiene el ID del usuario y se busca en la base de datos
   *  - Se obtienen las preferencias del usuario
   *  - Se restan puntos a todas las preferencias (mínimo 0)
   *  - Se ajusta la puntuación según la acción realizada
   *  - Se guardan los cambios en la base de datos
   */
  const maxScore: number = 50
  const minScore: number = 0
  const seenBookIncrement: number = 5
  const openedBookIncrement: number = 4
  const decrement: number = 1

  const userId = userObj.id
  const user = await UsersModel.getUserById(userId)
  const bookKeyInfo = getBookKeyInfo(book)
  const userPreferences = user?.preferencias || {}

  Object.keys(userPreferences).forEach(key => {
    userPreferences[key] = userPreferences[key] - decrement
    if (userPreferences[key] <= minScore) {
      delete userPreferences[key]
    }
  })

  const increment = action === 'openedBook' ? seenBookIncrement : openedBookIncrement
  for (const key of bookKeyInfo) {
    userPreferences[key] = Math.min((userPreferences[key] || minScore) + increment, maxScore)
  }

  await UsersModel.updateUser(userId, { preferencias: userPreferences })
}
