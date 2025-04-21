import dotenv from 'dotenv'
import { BookObjectType } from '../../types/book'
import { NotificationType } from '../../types/notification'
import { TypeType } from '../../types/notificationCategories'
import { ID, ImageType, ISOString } from '../../types/objects'
import { PartialUserInfoType } from '../../types/user'
dotenv.config()
// PROBLEMS I HAVE WITH THE TYPE OF NOTIFICATION
export type NotificationInfoNeeded = {
  _id?: ID
  idVendedor?: ID
  images?: ImageType[]
  titulo?: string
  createdIn?: ISOString
  expiresAt?: ISOString 
  follower?: PartialUserInfoType
} & Partial<BookObjectType>
export function createNotification (data: NotificationInfoNeeded, template: TypeType): NotificationType {
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
 const commonData = {
  _id: data._id ?? crypto.randomUUID(),
  read: false,
  createdIn: data.createdIn ?? new Date().toISOString() as ISOString,
  expiresAt: data.expiresAt ?? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() as ISOString,
 }
 const dataToSend = {
  ...commonData
 }
  switch (template) {
    case 'welcomeUser': {
      Object.assign(dataToSend, {
        title: '¡Bienvenido a Meridian!',
        priority: 'high',
        type: 'welcomeUser',
        userId: data._id ?? crypto.randomUUID(),
        message: 'Estamos emocionados de tenerte con nosotros. Esperamos que disfrutes de la experiencia y encuentres justo lo que necesitas. Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por unirte!'
      })
    }
    case 'newFollower': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tienes un nuevo seguidor',
        priority: 'low',
        type: 'newFollower',
        userId: data.follower?._id ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/usuarios/${data.follower?._id}`,
        metadata: {
          photo: data.follower?.fotoPerfil ?? ''
        }
      })
    }
    case 'bookPublished': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tu libro ha sido publicado con éxito',
        priority: 'high',
        type: 'bookPublished',
        userId: data.idVendedor ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data._id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      })
    }
    case 'bookUpdated': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tu libro ha sido actualizado con éxito',
        priority: 'high',
        type: 'bookUpdated',
        userId: data.idVendedor ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data._id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      })
    }
    case 'bookSold': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tu libro ha sido vendido con éxito',
        priority: 'high',
        type: 'bookSold',
        userId: data.idVendedor ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data._id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      })
    }
    default: {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Notificación no válida',
        priority: 'low',
        type: 'invalidNotification',
        userId: data.idVendedor ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data._id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data._id
        }
      })
    }
  }
  return dataToSend as NotificationType
}
