export const conversationObject = (data) => {
  return {
    _id: data._id || '',
    users: data.users || [],
    messages: data.messages || [],
    createdIn: data.createdIn || new Date().toISOString(),
    lastMessage: data.lastMessage || {}
  }
}
