const priorityArr = ['low', 'normal', 'high'] as const
type PriorityType = typeof priorityArr[number]

const typeArr = ['welcomeUser', 'newQuestion', 'bookPublished', 'bookReserved',
    'bookSold', 'bookUpdated', 'newFollower', 'notRegistered'] as const
type TypeType = typeof typeArr[number]
export { 
    priorityArr, PriorityType,
    typeArr, TypeType
}