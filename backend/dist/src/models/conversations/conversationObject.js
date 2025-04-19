const conversationObject = (data) => {
    return {
        _id: data._id ?? crypto.randomUUID(),
        users: data.users ?? [crypto.randomUUID(), crypto.randomUUID()],
        createdIn: data.createdIn ?? new Date().toISOString(),
        lastMessage: data.lastMessage ?? null
    };
};
export { conversationObject };
