import { useState } from "react";
import './protectedReview.css'
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../assets/config";
export default function ProtectedBan() {
  const [username, setUsername] = useState("");

  const handleBan = async (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para banear al usuario
    console.log(`Usuario baneado: ${username}`);
    const response = await axios.post(`${BACKEND_URL}/api/users/ban`, { username }, { withCredentials: true });
    if (response.data.error) {
      console.error('Error en el servidor:', response.data.error);
      toast.error(`Error: ${response.data.error}`);
      return;
    }
    toast.success('Usuario baneado correctamente');
    setUsername("");
  };

  return (
    <>
    <div className="book-review">
      <h2>Banear Usuario</h2>
      <form onSubmit={handleBan}>
        <label htmlFor="username">Nombre de Usuario o Correo:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa el nombre de usuario o correo"
          required
        />
        <button type="submit">Banear</button>
      </form>
    </div>
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light" />
    </>
  );
}