import dotenv from 'dotenv'
import { BookObjectType } from '../../types/book'
import { NotificationType } from '../../types/notification'
import { TypeType } from '../../types/notificationCategories'
import { ID, ImageType, ISOString } from '../../types/objects'
import { PartialUserInfoType } from '../../types/user'
dotenv.config()
// PROBLEMS I HAVE WITH THE TYPE OF NOTIFICATION
export type NotificationInfoNeeded = {
  id?: ID
  idVendedor?: ID
  images?: ImageType[]
  titulo?: string
  createdIn?: ISOString
  expiresAt?: ISOString 
  follower?: PartialUserInfoType
  guia?: string
} & Partial<BookObjectType>
export function createNotification (data: NotificationInfoNeeded, template: TypeType): NotificationType {

 const commonData = {
  id: data.id ?? crypto.randomUUID(),
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
        userId: data.id ?? crypto.randomUUID(),
        message: 'Estamos emocionados de tenerte con nosotros. Esperamos que disfrutes de la experiencia y encuentres justo lo que necesitas. Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por unirte!'
      })
    }
    case 'newFollower': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tienes un nuevo seguidor',
        priority: 'low',
        type: 'newFollower',
        userId: data.follower?.id ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/usuarios/${data.follower?.id}`,
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
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data.id
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
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data.id
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
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data.id
        }
      })
    }
    case 'bookBought': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Has comprado un libro',
        priority: 'high',
        type: 'bookBought',
        userId: data.id ?? crypto.randomUUID(),
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          guia: data.guia,
          bookTitle: data.titulo,
          bookId: data.id
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
        actionUrl: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          bookTitle: data.titulo,
          bookId: data.id
        }
      })
    }
  }
  return dataToSend as NotificationType
}
