export const notificationObject = (data) => {
  return {
    _id: data._id || '',
    theme: data.theme || '',
    title: data.title || '',
    priority: data.priority || '',
    type: data.type || '',
    userId: data.userId || '',
    input: data.input || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false,
    actionUrl: data.actionUrl || '',
    expiresAt: data.expiresAt || new Date().toISOString(),
    metadata: data.metadata || {
      photo: '',
      bookTitle: '',
      bookId: ''
    }
  }
}
