import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function ChatHeader ({ user, reducedUsers, activeUser, activeConversation, setActiveConversation, isMobile }) {
  return (<>
  {(user && reducedUsers && activeConversation) &&
              <Link style={{ width: '100%' }} to={`/usuarios/${activeUser.id}`}>
                <div className='headerMessage'>
                  <svg
                    onClick={() => setActiveConversation(null)}
                    style={{
                      display: isMobile ? 'block' : 'none',
                      transform: 'rotate(180deg)'
                    }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={25} height={25} color='#000000' fill='none'
                  ><path d='M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                  </svg>
                  <img src={activeUser.fotoPerfil ? `http://localhost:3030/uploads/${activeUser.fotoPerfil}` : 'http://localhost:3030/uploads/default.jpg'} alt={activeUser.nombre} />
                  <h2>{activeUser.nombre}</h2>
                </div>
              </Link>}
              </>)
}

ChatHeader.propTypes = {
  user: PropTypes.object,
  reducedUsers: PropTypes.array,
  activeUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fotoPerfil: PropTypes.string,
    nombre: PropTypes.string.isRequired,
  }),
  activeConversation: PropTypes.object,
  setActiveConversation: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
}