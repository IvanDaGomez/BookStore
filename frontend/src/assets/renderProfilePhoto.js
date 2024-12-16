function renderProfilePhoto (url) {
  let profilePhoto
  if (!url) {
    profilePhoto = 'http://localhost:3030/uploads/default.jpg'
  } else if (url.startsWith('http')) {
    profilePhoto = url
  } else if (url) {
    profilePhoto = `http://localhost:3030/uploads/${url}`
  } else profilePhoto = 'http://localhost:3030/uploads/default.jpg'
  return profilePhoto
}

export { renderProfilePhoto }
