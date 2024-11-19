import { formatDate } from "./formatDate"

function formatNotificationMessage(notification) {
    const formattedDate = formatDate(notification.createdIn);

    switch (notification.type) {
        case 'newMessage':
            return (
                <>  
                    <h2>Tienes un nuevo mensaje!</h2>
                    <span>{formattedDate}</span>
                </>
            );
        case 'newQuestion':
            return (
                <>  
                    <h2>Tienes una nueva pregunta!</h2>
                    <span>{formattedDate}</span>  
                </>
            );
        case 'bookPublished':
            return (
                <>
                    <h2> A new book titled &quot;<strong>{notification.metadata.bookTitle}</strong>&quot; has been published!</h2>
                    <span>{formattedDate}:</span>
                </>
            );

        case 'bookSold':
            return (
                <>
                    <h2> Your book &quot;<strong>{notification.metadata.bookTitle}</strong>&quot; was sold to {notification.buyerName}.</h2>
                    <span>{formattedDate}:</span>
                </>
            );

        case 'orderShipped':
            return (
                <>
                    <h2> Your order for &quot;<strong>{notification.metadata.bookTitle}</strong>&quot; has been shipped!</h2>
                    <span>{formattedDate}:</span>
                </>
            );

        case 'reviewReceived':
            return (
                <>
                    <span>{formattedDate}:</span>
                    <h2> You received a new review on &quot;<strong>{notification.metadata.bookTitle}</strong>&quot;: &quot;{notification.reviewSnippet}&quot;.</h2>
                </>
            );

        default:
            return (
                <>
                    <span>{formattedDate}:</span>
                    <span> Tienes una nueva notificación.</span>
                </>
            );
    }
}

function formatNotificationMessageBig(notification) {
    const { type, title, createdIn, metadata, actionUrl, read } = notification;

    const typeMessages = {
        newMessage: "Tienes un nuevo mensaje!",
        bookPublished: "Tu libro ha sido publicado!",
        bookSold: `Tu libro "${metadata.bookTitle}" ha sido vendido!`,
        orderShipped: "Tu pedido ha sido entregado!",
        reviewReceived: `Tienes una nueva reseña de "${metadata.bookTitle}"!`
    };

    const typeIcons = {
        newMessage: "📩",
        bookPublished: "📘",
        bookSold: "💸",
        orderShipped: "📦",
        reviewReceived: "⭐"
    };

    const formattedDate = formatDate(createdIn);

    return (
        <div className={`notification-item ${read ? 'read' : 'unread'}`}>
            <div className="notification-icon">
                {typeIcons[type] || "🔔"}
            </div>
            <div className="notification-content">
                <h4 className="notification-title">{typeMessages[type] || title}</h4>
                {metadata.photo && (
                    <img
                        src={metadata.photo}
                        alt="Notification"
                        className="notification-photo"
                    />
                )}
                <p className="notification-date">{formattedDate}</p>
                {actionUrl && (
                    <a href={actionUrl} className="notification-link">
                        Ver detalles
                    </a>
                )}
            </div>
        </div>
    );
}


export {formatNotificationMessage, formatNotificationMessageBig}