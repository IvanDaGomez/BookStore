import { useState, useEffect } from 'react';

export default function Login() {
  const mobileSep = window.innerWidth < 1280

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Para registro
  const [name, setName] = useState('')
  const [isMobile, setIsMobile] = useState(mobileSep);
  const [isRegister, setIsRegister] = useState(false); // Estado para alternar entre login y signup

  const handleResize = () => {
    setIsMobile(mobileSep);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errors, setErrors] = useState([])

  const validateErrors = (formData) => {
    const { name, email, password, confirmPassword } = formData;
    const errorMessages = []; // Array para almacenar mensajes de error

    // Verificar campos vacíos
    if (!email) errorMessages.push('El correo es obligatorio.');
    if (!password) errorMessages.push('La contraseña es obligatoria.');

    // Validar formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailPattern.test(email)) {
      errorMessages.push('El correo no tiene un formato válido.');
    }

    // Validar longitud de la contraseña
    if (password && password.length < 6) {
      errorMessages.push('La contraseña debe tener al menos 6 caracteres.');
    }

    // Verificar coincidencia de contraseñas (solo para registro)
    if (isRegister && password !== confirmPassword) {
      errorMessages.push('Las contraseñas no coinciden.');
    }
    if (isRegister && !name){
      errorMessages.push('El nombre es requerido')
    }
    // Actualizar estado de errores
    setErrors(errorMessages);
    return errorMessages.length === 0; // Retornar verdadero si no hay errores
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = {
      email,
      password,
      confirmPassword
    };
  
    const validated = validateErrors(formData);
    if (!validated) return;
  
    const url = isRegister ? '/api/users' : `/api/users?mail=${email}`;
  
    try {
      const response = await fetch(url, {
        method: isRegister ? 'POST' : 'GET', // Cambia según la acción
        headers: {
          'Content-Type': 'application/json',
        },
        body: isRegister ? JSON.stringify(formData) : null, // Solo envía el cuerpo si es un registro
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor'); // Manejo de errores
      }
      window.location.href = window.location.origin
      const data = await response.json(); // Aquí obtienes la respuesta del servidor
  
      // Verifica si el token o usuario están en la respuesta
      if (data.token) {
        // Guardar el token como cookie o en localStorage
        document.cookie = `token=${data.token}; path=/`; // Ejemplo de guardado en cookie
        window.location.href = '/inicio'; // Redirigir a la página de inicio
      } else {
        console.error('No se recibió el token', data);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    }
  };
  

  return (
    <div
      className="login-container"
      style={{
        backgroundImage: isMobile ? "url('/drawing.svg')" : 'none',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
      }}
    >
      <div className="login-form">
        <h1>{isRegister ? 'Crea una cuenta!' : 'Bienvenido de vuelta!'}</h1>
        <h2 >
          {isRegister
            ? 'Un paso hacia el futuro que deseas. ¡Atrévete!'
            : 'Leer es el primer paso hacia un mundo lleno de posibilidades. ¿Te atreves a comenzar?'}
        </h2>
        <h2 style={{fontSize:"3rem"}}>{isRegister ? 'Registro' : 'Inicio de Sesión'}</h2>

        <form onSubmit={handleSubmit} noValidate>
        {isRegister && (<div className="input-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Ingresa tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>)}
          <div className="input-group">
            <label>Correo</label>
            <input
              type="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {isRegister && (
            <div className="input-group">
              <label>Confirma tu contraseña</label>
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirma tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}
          <button type="submit" className="login-button">
            {isRegister ? 'Registro' : 'Inicio de sesión'}
          </button>
        </form>
          {(errors.length!=0) ? <div className='error'>
            {errors[0]}
          </div>: <></> }
          <div className="alternativasLogin">
            <div>{/*Logo de Google */}
            <img loading="lazy" src="/google-logo.svg" alt="Google logo" title='Google logo'/>
            </div>
            <div> {/*Logo de Facebook */}
            <img loading="lazy" src="/facebook-logo.svg" alt="Facebook logo" title='Facebook logo'/>
            </div>
            <div>{/*Logo de Amazon */}
            <img loading="lazy" src="/amazon-logo.svg" alt="Amazon logo" title='Amazon logo'/>
            </div>
          </div>
        {!isRegister && (
          <div className="forgot-password">
            <a href="/">¿Olvidaste tu contraseña?</a>
          </div>
        )}
        <div className="register-link">
          <span>{isRegister ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}</span>
          <a onClick={() => setIsRegister(!isRegister)}>
            <span style={{cursor:"pointer"}} >{isRegister ? 'Inicio de sesión' : 'Registro'}</span>
          </a>
        </div>
      </div>
      {!isMobile && <img loading="lazy" src="/drawing.svg" className="drawing" />}
    </div>
  );
}