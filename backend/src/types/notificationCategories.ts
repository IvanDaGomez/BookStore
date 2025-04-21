const priorityArr = ['low', 'normal', 'high'] as const
type PriorityType = typeof priorityArr[number]

const typeArr = [  
    'newMessage',
    'bookUpdated',
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
type TypeType = typeof typeArr[number]
export { 
    priorityArr, PriorityType,
    typeArr, TypeType
}