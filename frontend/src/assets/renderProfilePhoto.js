function renderProfilePhoto({ user }) {
    let profilePhoto;
    if (!user.fotoPerfil) {
        profilePhoto = 'http://localhost:3030/uploads/default.jpg'
    }
    else if (user.fotoPerfil.startsWith('http') ) {
        profilePhoto = user.fotoPerfil
    }
    else if (user.fotoPerfil) {
        profilePhoto = `http://localhost:3030/uploads/${user.fotoPerfil}`
    }
    else profilePhoto = 'http://localhost:3030/uploads/default.jpg'
    return profilePhoto
}

export { renderProfilePhoto }