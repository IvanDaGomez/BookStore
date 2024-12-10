import dotenv from 'dotenv'
dotenv.config()

export function createNotification (data, template) {
  /*   {
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
  } */
  switch (template) {
    case 'welcomeUser': {
      return {
        title: '¡Bienvenido a Meridian!',
        priority: 'high',
        type: 'welcomeUser',
        userId: data._id,
        read: false,
        message: 'Estamos emocionados de tenerte con nosotros. Esperamos que disfrutes de la experiencia y encuentres justo lo que necesitas. Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por unirte!'
      }
    }
    case 'newFollower': {
      return {
        title: 'Tienes un nuevo seguidor',
        priority: 'low',
        type: 'newFollower',
        userId: data.follower._id,
        read: false,
        actionUrl: `${process.env.FRONTEND_URL}/usuarios/${data.follower_id}`,
        metadata: data.metadata || {
          photo: data.follower.fotoPerfil || ''
        }
      }
    }
    case 'bookPublished': {
      return {

        title: 'Tu libro ha sido publicado con éxito',
        priority: 'high',
        type: 'bookPublished',
        userId: data.idVendedor,
        read: false,
        actionUrl: `http://localhost:5173/libros/${data._id}`,
        metadata: data.metadata || {
          photo: data.images[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      }
    }
    case 'bookUpdated': {
      return {

        title: 'Tu libro ha sido actualizado con éxito',
        priority: 'high',
        type: 'bookUpdated',
        userId: data.idVendedor,
        read: false,
        actionUrl: `http://localhost:5173/libros/${data._id}`,
        metadata: data.metadata || {
          photo: data.images[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      }
    }
  }
}
