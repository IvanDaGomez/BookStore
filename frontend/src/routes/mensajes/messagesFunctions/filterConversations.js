export  function filterConversations ({
    e,
    conversaciones,
    setFilteredConversations,
    user,
    reducedUsers
}) {
    const searchTerm = e.target.value.toLowerCase() // Normalize the search term for case-insensitive comparison

    // Filter conversations where the name of the other user contains the search term
    const filtered = conversaciones.filter(conversation => {
      // Find the other user's ID
      const otherUserId = conversation.users.find(u => u !== user.id)
      if (!otherUserId) return null

      // Find the user object for the other user in reducedUsers
      const userMatch = reducedUsers.find(reducedUser => reducedUser.id === otherUserId)

      return userMatch.nombre.toLowerCase().includes(searchTerm)
    })

    // Update the state with the filtered conversations
    setFilteredConversations(filtered)
  }