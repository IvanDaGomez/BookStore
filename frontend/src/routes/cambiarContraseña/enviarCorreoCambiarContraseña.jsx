import axios from "axios"
import { useState } from "react"
import Loader from "./loader"

export default function EnviarCorreoCambiarContraseña() {
    const [emailSent, setEmailSent] = useState(false)
    const [errors, setErrors] = useState([])
    const [loading, setLoading] = useState(false)
    async function handleSubmitMail(e) {
        e.preventDefault()
        const { email } = e.target
        // verify email 
        const emailValue = email.value;

        // Expresión regular para validar un correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if (!emailRegex.test(emailValue)) {
            setErrors(["Por favor ingresa un correo electrónico válido"]);
            return;
        }
    
        // Simulación de éxito o llamadas API
        setErrors([]);
        setLoading(true)
        try {
            const url = 'http://localhost:3030/api/users/changePasswordEmail'
            const response = await axios.post(url, {email: email.value}, { withCredentials: true })

            if (response.data.ok) {
                setEmailSent(true)
                setLoading(false)
            }
            else {
                console.error('Error en el servidor')
            }
        } catch (error) {
            console.error(error)
        }
        
    }
    return(<>
    {loading && <>
    <div className="opaqueBackground"></div>
    <div className="loader"><Loader /></div></>}
    <div className="verifyContainer cambiarContraseñaDiv">
    <h1>¿Olvidaste tu contraseña?</h1>
        <p>Para cambiar tu contraseña escribe tu correo electrónico</p>
        <div className="imageDiv">
            <img src="/candadoPregunta.png" alt="" />
        </div>
        
        <form onSubmit={handleSubmitMail} noValidate>
        <div className="input-field">
                        
                        <input
                            type="email"
                            name="email"
                            required
                        />
                        <label htmlFor="confirmPassword">Correo electrónico:</label>
                    </div>
            {errors.length!== 0 && <div className="error">{errors[0]}</div> }
             <button type='submit'>{!emailSent ? 'Enviar': 'Volver a enviar'}</button> 
            {emailSent && <div className="success">El correo se ha enviado exitosamente, revisa tu bandeja de entrada.</div>}
        </form>


    </div>
    
    </>)
}