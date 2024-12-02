export default function renderProfilePhoto({ user }) {
    return user.fotoPerfil && user?.login === 'default' && user.fotoPerfil.trim() !== ''
    ? `http://localhost:3030/uploads/${encodeURIComponent(user.fotoPerfil)}`
    : user.login === 'Google' || user.login === 'Facebook' && user.fotoPerfil
    ? user.fotoPerfil
    : 'http://localhost:3030/uploads/default.jpg'
}