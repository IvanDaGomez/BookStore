import  { useState } from 'react';

const NotificacionesPreferencias = ({ user }) => {
  const [settings, setSettings] = useState({
    Compras: { notification: true, email: false },
    Ventas: { notification: true, email: false },
    Noticias: { notification: false, email: false },
    'Nuevos libros': { notification: true, email: false },
    'Ofertas especiales': { notification: true, email: false },
  });

  const handleToggle = (topic, type) => {
    setSettings((prev) => ({
      ...prev,
      [topic]: {
        ...prev[topic],
        [type]: !prev[topic][type],
      },
    }));
  };

  return (
    <div className="notification-settings container">
      <h1>Configuración de notificaciones</h1>

      <table className="settings-table">
        <thead>
          <tr>
            <th>Notificación</th>
            <th>Notificaciones del sistema</th>
            <th>Correo</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(settings).map(([topic, { notification, email }]) => (
            <tr key={topic}>
              <td>{topic.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}</td>
              <td>
                <div className='inputContainer'>
              <label className="switch">
                <input type="checkbox" />
                <div className="slider"></div>
                <div className="slider-card">
                    <div className="slider-card-face slider-card-front"></div>
                    <div className="slider-card-face slider-card-back"></div>
                </div>
                </label>
                </div>
              </td>
              
              <td>
                <div  className='inputContainer'>
              <label className="switch">
                <input type="checkbox" />
                <div className="slider"></div>
                <div className="slider-card">
                    <div className="slider-card-face slider-card-front"></div>
                    <div className="slider-card-face slider-card-back"></div>
                </div>
                </label>
              </div>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotificacionesPreferencias;
