export const trackRequests = (req, res, next) => {
  // TODO: Implement stats tracking for users logged in, users logged out, and requests per endpoint
  // This is a placeholder implementation
  // transactions, books, messages, collections, conversations, notifications
  console.log(`Request URL: ${req.url}, Method: ${req.method}`)
  next()
}
