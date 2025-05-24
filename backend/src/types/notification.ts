import { PriorityType, TypeType } from './notificationCategories'
import { ID, ImageType, ISOString } from './objects'

export type NotificationType = {
  id: ID
  title: string
  priority: PriorityType
  type: TypeType
  user_id: ID
  input?: string
  created_in: ISOString
  read: boolean
  action_url?: string
  expires_at: ISOString
  message?: string
  metadata?: {
    photo?: ImageType
    book_title?: string
    guia?: string
    book_id?: ID
    pregunta?: string
    respuesta?: string
  }
}
