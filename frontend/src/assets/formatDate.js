// formatear la fecha para que salag dependiendo del día y hora
export function formatDate(createdIn) {
    if (!createdIn) return ''
    const date = new Date(createdIn);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
        // If it's today, return hours and minutes in HH:MM format
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (isYesterday) {
        // If it's yesterday, return "Yesterday"
        return "Ayer";
    } else {
        // Otherwise, return the date in DD/MM/YYYY format
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    }
}