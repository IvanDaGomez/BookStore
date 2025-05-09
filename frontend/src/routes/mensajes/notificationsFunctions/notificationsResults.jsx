import { formatDate } from "../../../assets/formatDate"
import { reduceText } from "../../../assets/reduceText"

import PropTypes from 'prop-types';

export default function NotificationsResults ({
  filteredNotifications,
  setActiveNotification,
  activeNotification,
}) {
  const typeMessages = {
    newMessage: 'Tienes un nuevo mensaje!',
    newQuestion: 'Tienes una nueva pregunta!',
    bookPublished: 'Tu libro ha sido publicado!',
    bookSold: 'Tu libro ha sido vendido!',
    reviewReceived: 'Tienes una nueva reseña!'
  }
  
  return (<>
  {(filteredNotifications && filteredNotifications.length !== 0) && filteredNotifications
            .slice() // Ensure a new array is created to avoid mutating state
            .reverse()
            .map((notification) => (
              <div
                key={notification.id}
                className={`conversationSpecific 
                                ${activeNotification && activeNotification.id === notification.id ? 'active' : ''}
                                ${!notification.read && activeNotification.id !== notification.id ? 'notRead' : ''}`}
                onClick={() => setActiveNotification(notification)}
              >

                <div className='conversationSpecificTitleAndMessage'>
                  <h2>
                    {notification.type
                      ? (
                        <>
                          {reduceText(typeMessages[notification.type] || notification.title, 40)}
                        </>
                        )
                      : null}

                  </h2>
                </div>
                <span>{formatDate(notification?.created_in) ?? ''}</span>

              </div>
            ))}
  </>)
}
NotificationsResults.propTypes = {
  filteredNotifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string,
      title: PropTypes.string,
      read: PropTypes.bool,
      createdIn: PropTypes.string,
    })
  ).isRequired,
  setActiveNotification: PropTypes.func.isRequired,
  activeNotification: PropTypes.shape({
    id: PropTypes.string,
  }),
};
