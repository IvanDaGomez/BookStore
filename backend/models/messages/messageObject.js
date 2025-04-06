export const messageObject = (data) => {
  return {
    _id: data._id || '',
    userId: data.userId || '',
    message: data.message || '',
    conversationId: data.conversationId || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false
  }
}
