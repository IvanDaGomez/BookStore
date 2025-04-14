const notificationArr = [
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
  'newFollower'
] as const
type NotificationTypes = typeof notificationArr[number]

export { notificationArr, NotificationTypes }
