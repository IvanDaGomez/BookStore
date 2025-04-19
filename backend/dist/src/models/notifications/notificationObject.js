const notificationObject = (data) => {
    return {
        _id: data._id ?? crypto.randomUUID(),
        title: data.title ?? '',
        priority: data.priority ?? 'low',
        type: data.type ?? 'notRegistered',
        userId: data.userId ?? crypto.randomUUID(),
        input: data.input ?? '',
        createdIn: data.createdIn ?? new Date().toISOString(),
        read: data.read ?? false,
        actionUrl: data.actionUrl,
        expiresAt: data.expiresAt ?? new Date().toISOString(),
        metadata: data.metadata ?? {}
    };
};
export { notificationObject };
