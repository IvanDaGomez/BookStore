import { formatDate } from "./formatDate"

export function formatNotificationMessage(notification) {
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
                    <span>{formattedDate}:</span>
                    <span> A new book titled &quot;<strong>{notification.bookTitle}</strong>&quot; has been published!</span>
                </>
            );

        case 'bookSold':
            return (
                <>
                    <span>{formattedDate}:</span>
                    <span> Your book &quot;<strong>{notification.bookTitle}</strong>&quot; was sold to {notification.buyerName}.</span>
                </>
            );

        case 'orderShipped':
            return (
                <>
                    <span>{formattedDate}:</span>
                    <span> Your order for &quot;<strong>{notification.bookTitle}</strong>&quot; has been shipped!</span>
                </>
            );

        case 'reviewReceived':
            return (
                <>
                    <span>{formattedDate}:</span>
                    <span> You received a new review on &quot;<strong>{notification.bookTitle}</strong>&quot;: &quot;{notification.reviewSnippet}&quot;.</span>
                </>
            );

        default:
            return (
                <>
                    <span>{formattedDate}:</span>
                    <span> You have a new notification.</span>
                </>
            );
    }
}
