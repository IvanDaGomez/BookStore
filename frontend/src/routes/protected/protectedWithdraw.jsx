import { useContext, useEffect, useState } from "react";
import './protectedWithdraw.css';
import axios from "axios";
import { renderProfilePhoto } from '../../assets/renderProfilePhoto.js';
import { formatPrice } from "../../assets/formatPrice.js";
import { UserContext } from "../../context/userContext.jsx";
import { useReturnIfNoUser } from "../../assets/useReturnIfNoUser.js";

export default function ProtectedWithdraw() {
  const [info, setInfo] = useState([]);
  const [actualInfo, setActualInfo] = useState({});
  const [isProcessing, setIsProcessing] = useState(false); // Disable button while processing
  const { user, loading, setUser } = useContext(UserContext);
  useReturnIfNoUser(user, loading, true)
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3030/api/transactions/withdrawMoney');
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setInfo(data);
        setActualInfo(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!user?.id) return;
      try {

        const emailResponse = await axios.get(`http://localhost:3030/api/users/c/${user.id}`);
        setUser({
          ...user,
          correo: emailResponse.data.correo
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function handleWithdraw() {
    setIsProcessing(true);
    try {
      const response = await axios.put(`http://localhost:3030/api/transactions/withdrawMoney/${actualInfo.user_id}`);
      if (response.data.error) {
        alert(response.data.error);
      }
      const actualIndex = info.findIndex((item) => item.userId === actualInfo.userId);
      if (actualIndex === -1) {
        alert('No se encontró la transacción');
        return;
      }
      const nextInfo = info[actualIndex + 1] || null;
      setActualInfo(nextInfo);
    } catch (error) {
      console.error("Error during withdraw:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="protectedContainer">
      <h1>Enviar dinero a usuarios para retirar</h1>
      <div className="withdrawInfo">
        <div className="withdrawInfoUser">
          <h1>Información del usuario</h1>
          {user ? (
            <>
              <img src={renderProfilePhoto(user.foto_perfil ?? '')} alt="Profile" />
              <p><strong>Nombre:</strong> {user.nombre}</p>
              <p><strong>Email:</strong> {user.correo}</p>
              <p><strong>Teléfono:</strong> {user.phone_number || 'No disponible'}</p>
            </>
          ) : (
            <p>Cargando información del usuario...</p>
          )}
          <h1>Información de la transacción</h1>
          {actualInfo ? (
            <div className="withdrawTransactionInfo">
              <p><strong>Monto:</strong> {formatPrice(actualInfo.monto)}</p>
              <p><strong>Banco:</strong> {actualInfo.bank}</p>
              <p><strong>Numero de cuenta:</strong> {actualInfo.numero_cuenta}</p>
            </div>
          ) : (
            <p>No hay información de transacción disponible.</p>
          )}
        </div>
        <div className="buttons">
          <button onClick={() => alert('Proceso cancelado')}>Cancelar</button>
          <button onClick={handleWithdraw} disabled={isProcessing}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}
