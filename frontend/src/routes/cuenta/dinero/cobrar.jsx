/* eslint-disable react/prop-types */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../../assets/config";
export default function Cobrar({ user, setCobrar, setUser }) {
  const [mensajeError, setMensajeError] = useState('');
  const [code, setCode] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault()

    const [
      numeroCuenta,
      phoneNumber,
      monto,
      password,
      bank,
      safeCode,
    ] = Array.from(e.target.elements).map((input) => input.value);
    // console.log(numeroCuenta.value, monto.value, password.value, safeCode.value)
    // Validar que todos los campos estén completos
    // Validar telefono valido
    if (!/^\d{10}$/.test(phoneNumber)) {
      setMensajeError('Número de teléfono inválido');
      toast.error('Número de teléfono inválido');
      return;
    }
    if (!numeroCuenta || !monto || !password || !bank || !safeCode) {
      setMensajeError('Por favor complete todos los campos');
      toast.error('Por favor complete todos los campos');
      return;
    }
    if (monto > user.balance.disponible) {
      setMensajeError('No tienes suficiente saldo disponible');
      toast.error('No tienes suficiente saldo disponible');
      return;
    }
    if (safeCode !== code) {
      setMensajeError('El código de seguridad no coincide');
      // console.log(safeCode, code)
      toast.error('El código de seguridad no coincide');
      return;
    }
    const body = {
      user_id: user.id,
      numero_cuenta: numeroCuenta,
      monto,
      password,
      bank,
      phone_number: phoneNumber
    }
    // Lógica para verificar la contraseña (esto debe hacerse en el backend)
    // En el backend, debes verificar la contraseña del usuario
    try {
      
      const response = await fetch(`${BACKEND_URL}/api/transactions/withdrawMoney`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include'
      });
      if (!response.ok) {
        setMensajeError('Error al solicitar el retiro');
        toast.error('Error al solicitar el retiro');
        return
      }

      const data = await response.json();
      if (data.error) {
        setMensajeError(data.error);
        toast.error(data.error);
        return
      }
      setCobrar(false);
      toast.success('Retiro solicitado con éxito, tiene un tiempo de espera de 1 a 3 días hábiles');
      setUser({
        ...user,
        balance: {
          por_llegar: (user.balance.por_llegar ?? 0),
          disponible: user.balance.disponible - monto,
          pendiente: (user.balance.pendiente ?? 0) + monto
        }
      });
    } catch {
        // Manejo de errores
    }
  };
  useEffect(() => {
    const fetchCode = async () => {
      try {
        if (!user) return
        const response = await axios.get(`${BACKEND_URL}/api/transactions/getSafeCode/${user.id}`, { withCredentials: true });
        if (response.data) {
          setCode(response.data.code);
        }
      } catch (error) {
        console.error('Error al obtener el código de seguridad:', error);
      }
    };
    fetchCode();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
      <div className="askPrompt">
        <h1>Retirar dinero</h1>
        <form onSubmit={handleSubmit}>
        {/* Campo para número de cuenta */}
        <input 
          type="text" 
          placeholder="Número de cuenta" 

        />
        <input type="number"
          placeholder="Teléfono" 
        />
        {/* Campo para monto a retirar */}
        <input 
          type="number" 
          placeholder="Monto a retirar" 

        />
        
        {/* Campo para la contraseña */}
        <input 
          type="password" 
          placeholder="Contraseña de tu cuenta" 

        />
        <input type="text" 
          placeholder="Banco"

        />
        <div className="accent">Se ha enviado un código de seguridad a tu correo para hacer el retiro lo más seguro posible. Ingrésalo</div>
        {/* Campo para el código de seguridad */}
        <input 
          type="text" 
          placeholder="Código de seguridad" 

        />
        <button type="submit">Solicitar Retiro</button>
        </form>
        {/* Mostrar mensaje de error si algún campo no está lleno */}
        {mensajeError && <p style={{ color: 'red' }}>{mensajeError}</p>}
        
        {/* Botón para realizar el retiro */}
        
      </div>
    </>
  );
}
