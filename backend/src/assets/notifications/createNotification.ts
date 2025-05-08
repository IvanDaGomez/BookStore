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
  id_vendedor?: ID
  images?: ImageType[]
  titulo?: string
  created_in?: ISOString
  expires_at?: ISOString
  follower?: PartialUserInfoType
  order?: string
} & Partial<BookObjectType>
export function createNotification (
  data: NotificationInfoNeeded,
  template: TypeType
): NotificationType {
  const commonData = {
    id: data.id ?? crypto.randomUUID(),
    read: false,
    created_in: data.created_in ?? (new Date().toISOString() as ISOString),
    expires_at:
      data.expires_at ??
      (new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString() as ISOString)
  }
  const dataToSend: Partial<NotificationType> = {
    ...commonData
  }
  switch (template) {
    case 'welcomeUser': {
      Object.assign(dataToSend, {
        title: '¡Bienvenido a Meridian!',
        priority: 'high',
        type: 'welcomeUser',
        user_id: data.id ?? crypto.randomUUID(),
        message:
          'Estamos emocionados de tenerte con nosotros. Esperamos que disfrutes de la experiencia y encuentres justo lo que necesitas. Si tienes alguna pregunta, no dudes en contactarnos. ¡Gracias por unirte!'
      })
    }
    case 'newFollower': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tienes un nuevo seguidor',
        priority: 'low',
        type: 'newFollower',
        user_id: data.follower?.id ?? crypto.randomUUID(),
        action_url: `${process.env.FRONTEND_URL}/usuarios/${data.follower?.id}`,
        metadata: {
          photo: data.follower?.foto_perfil ?? ''
        }
      })
    }
    case 'bookPublished': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tu libro ha sido publicado con éxito',
        priority: 'high',
        type: 'bookPublished',
        user_id: data.id_vendedor ?? crypto.randomUUID(),
        action_url: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          book_title: data.titulo,
          book_id: data.id
        }
      })
    }
    case 'bookUpdated': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tu libro ha sido actualizado con éxito',
        priority: 'high',
        type: 'bookUpdated',
        user_id: data.id_vendedor ?? crypto.randomUUID(),
        action_url: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          book_title: data.titulo,
          book_id: data.id
        }
      })
    }
    case 'bookSold': {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Tu libro ha sido vendido con éxito',
        priority: 'high',
        type: 'bookSold',
        user_id: data.id_vendedor ?? crypto.randomUUID(),
        action_url: `${process.env.FRONTEND_URL}/libros/${data.id}`,
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
        user_id: data.id ?? crypto.randomUUID(),
        action_url: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          order: data.order,
          book_title: data.titulo,
          book_id: data.id
        }
      })
    }
    default: {
      Object.assign(dataToSend, {
        ...commonData,
        title: 'Notificación no válida',
        priority: 'low',
        type: 'invalidNotification',
        user_id: data.id_vendedor ?? crypto.randomUUID(),
        action_url: `${process.env.FRONTEND_URL}/libros/${data.id}`,
        metadata: {
          photo: (data.images ?? [])[0],
          book_title: data.titulo,
          book_id: data.id
        }
      })
    }
  }
  return dataToSend as NotificationType
}
