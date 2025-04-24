export function filterNotifications ({
  e,
  notifications,
  setFilteredNotifications
}) {
  const searchTerm = e.target.value.toLowerCase() // Normalize the search term for case-insensitive comparison

  // Filter conversations where the name of the other user contains the search term
  const filtered = notifications.filter((notification) =>
    notification.title.toLowerCase().includes(searchTerm)
  )

  // Update the state with the filtered conversations
  setFilteredNotifications(filtered)
}