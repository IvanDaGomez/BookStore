const messageObject = (data) => {
    return {
        _id: data._id ?? crypto.randomUUID(),
        userId: data.userId ?? crypto.randomUUID(),
        message: data.message ?? '',
        conversationId: data.conversationId ?? crypto.randomUUID(),
        createdIn: data.createdIn || new Date().toISOString(),
        read: data.read || false
    };
};
export { messageObject };
