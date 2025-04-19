import { updateTrends } from '../../assets/trends/updateTrends.js';
import { updateUserPreferences } from '../../assets/trends/updateUserPreferences.js';
import { updateUserSearchHistory } from '../../assets/trends/updateUserSearchHistory.js';
export async function updateData(user, bookCopy, action) {
    await updateUserPreferences(user, bookCopy, action);
    await updateUserSearchHistory(user, bookCopy, action);
    await updateTrends(bookCopy, action);
}
