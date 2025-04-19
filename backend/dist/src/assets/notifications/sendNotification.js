import fetch from 'node-fetch';
export async function sendNotification(body) {
    // La url es definida
    /* Estructura de las notificaciones
    {
      "_id": "f60c325b-cb26-48e7-a08b-18a7ddc5ab1c",
      "theme": "",
      "title": "Tienes una nueva pregunta",
      "priority": "normal",
      "type": "newQuestion",
      "userId": "857857d1-afdd-411d-b41a-be427d1ff186",
      "input": "¿En qué estado se encuentra el producto?",
      "createdIn": "2024-12-03T17:37:14.371Z",
      "read": true,
      "actionUrl": "http://localhost:5173/libros/e93345c4-ca50-4919-ba85-4dcf00882673",
      "expiresAt": "2025-01-02T17:37:14.371Z",
      "metadata": {
        "photo": "1733198744024-545526866.png",
        "bookTitle": "React Practico desde cero a desarrollos web avanzados",
        "bookId": "e93345c4-ca50-4919-ba85-4dcf00882673"
      }
    }
    */
    const notificationUrl = 'http://localhost:3030/api/notifications/';
    const response = await fetch(notificationUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error('Error creando notificación');
    }
}
