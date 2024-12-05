import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router";
export default function EnviarCorreoAVerificar() {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [sending, setSending] = useState(true)
    useEffect(() => {
        async function fetchUser() {
          try {
            const url = "http://localhost:3030/api/users/userSession";
            const response = await axios.post(url, null, {
              withCredentials: true,
            });
            setUser(response.data.user);
          } catch (error) {
            console.error("Error fetching user data:", error);
            navigate("/popUp/noUser");
          }
        }
        fetchUser();
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

        // Fetch user email if not already set
    useEffect(() => {
        if (!user || user?.correo) return;

        async function fetchUserEmail() {
        try {
            const response = await axios.get(`http://localhost:3030/api/users/c/${user._id}`, {
            withCredentials: true, // Ensures cookies are sent with the request
            });
        
            if (response.status === 200 && response.data) {
            setUser({
                ...user,
                correo: response.data.correo,
            });
            }
        } catch (error) {
            console.error("Error fetching user email:", error);
        }
        }
        
        fetchUserEmail();
        
    }, [user]);
    useEffect(()=>{
        async function sendVerifyEmail() {
            if (!user && !user?.correo && user.validated) return 
            try {
                

            const url = 'http://localhost:3030/api/users/sendValidationEmail'
            const body = {
                correo: user.correo,
                nombre: user.nombre,
                _id: user._id,
            }
            console.log(body)
            const response = await axios.post(url, body, { withCredentials: true } )
            if (response.data.ok) {
                setSending(false)
            }
            } catch  {
                console.error('Error en el servidor')
            }
        }
        sendVerifyEmail()
    },[user])
    return (<>
        <div className="verifyContainer">
            <h1>Verificación</h1>
            {console.log(user)}
            {sending ? <>Enviando correo</>:<>Correo enviado, revisa tu bandeja de entrada</>}
        </div>
    </>)
}