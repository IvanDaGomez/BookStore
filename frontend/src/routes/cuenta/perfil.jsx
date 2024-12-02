import renderProfilePhoto from "../../assets/renderProfilePhoto";

/* eslint-disable react/prop-types */
export default function Perfil({ user, navigate }) {
    return (<>
    <h1>Perfil</h1>
    <div className="userInfo">
        <img src={renderProfilePhoto({ user })} alt={user?.nombre} />
        <div>
        <h2>{user.nombre}</h2>
        <h3>{user.correo}</h3>
        <button onClick={()=>navigate('/usuarios/editarUsuario')}>
            Editar perfil
        </button>
        </div>
    </div>
    </>)
}