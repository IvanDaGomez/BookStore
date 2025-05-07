/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { SimpleNotification } from "../../assets/formatNotificationMessage";

export default function NotificationsRendering({ notifications, user, notificationOpen, setNotificationOpen }) {
  return (<>
    {(notifications && user && notificationOpen) && <div
      className='notificationsContainer' onMouseLeave={() =>
        setNotificationOpen(!notificationOpen)}>
      {notifications.slice(notifications.length - 4, notifications.length).map((notification, index) => (
        <Link to={`/notificaciones/${notification.id}`} key={index}>
          <div className='notificationElement'>
            {SimpleNotification(notification)}
          </div>
        </Link>
      )).reverse()}
      {notifications.length === 0 && 'No tienes notificaciones'}
    </div>}
  </>)
}