const priorityArr = ['low', 'normal', 'high'] as const
type PriorityType = typeof priorityArr[number]

const notificationTypeArr = [  
    'newMessage',
    'bookUpdated',
    'bookBought',
    'bookPublished',
    'bookRejected',
    'questionAnswered',
    'newQuestion',
    'bookSold',
    'orderShipped',
    'reviewReceived',
    'welcomeUser',
    'newFollower',
    'invalidNotification'] as const
type TypeType = typeof notificationTypeArr[number]
export { 
    priorityArr, PriorityType,
    notificationTypeArr, TypeType
}