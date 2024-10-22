import { useState, useEffect } from "react";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import Footer from "../../components/footer";
export default function EditarUsuario(){
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('http://localhost:3030/api/users/userSession', {
                    method: 'POST',
                    credentials: 'include',  // Asegúrate de enviar las cookies
                });
    
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); // Establece el usuario en el estado
                } else {
                    window.location.href = '/popUp/noUser'
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
    
        fetchUser(); // Llama a la función para obtener el usuario
    }, []); // Dependencias vacías para ejecutar solo una vez al montar el componente
    

    const [fotoPerfil, setFotoPerfil] = useState()

    useEffect(() => {
        if (user){
        document.querySelector("#nombre").value = user.nombre || "";
        //document.querySelector("#bio").value = user.bio || "";
        //document.querySelector("#estadoCuenta").value = user.estadoCuenta || "";
        setFotoPerfil(user.fotoPerfil && user.fotoPerfil.trim() !== ''
            ? `http://localhost:3030/uploads/${user.fotoPerfil}`
            : 'http://localhost:3030/uploads/default.jpg')
        }
      }, [user]);
    return(<>
    <Header/>
    {user &&<>
        <form action="">
        <div className="editarUsuario">
            <div>
            <div className="editarFotoContainer">
            <img
                        src={fotoPerfil}
                        alt="Profile"
                        
                    />
                
            </div>
            <button>Editar</button>
            </div>
            <div className="inputCrear">
          <label htmlFor="autor">Nombre *</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            required
            
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="autor">Bio *</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            required
            
            
          />
        </div>
        <div className="inputCrear">
          <label htmlFor="autor">Nombre *</label>
          <input
            id="nombre"
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            required
            
            
          />
        </div>
        <button type="submit">Enviar</button>
        </div>
        
        </form>
    </>
    }
    <SideInfo/>
    <Footer />
    </>)
}