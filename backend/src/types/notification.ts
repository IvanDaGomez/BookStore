import { PriorityType, TypeType } from "./notificationCategories"
import { ID, ImageType, ISOString } from "./objects"

export type NotificationType = {
  _id: ID
  title: string
  priority: PriorityType
  type: TypeType
  userId: ID
  input?: string
  createdIn: ISOString
  read: boolean
  actionUrl?: string
  expiresAt: ISOString
  message?: string
  metadata?: {
    photo?: ImageType
    bookTitle?: string
    guia?: string
    bookId?: ID
  }
}
