import { PriorityType, TypeType } from "./notificationCategories"
import { ID, ImageType, ISOString } from "./objects"

export type NotificationType = {
  _id: ID
  title: string
  priority: PriorityType
  type: TypeType
  userId: ID
  input: string
  createdIn: ISOString
  read: boolean
  actionUrl: string
  expiresAt: ISOString
  message: string
  metadata?: {
    photo?: ImageType
    bookTitle?: string
    bookId?: ID
  }
}

export type NotificationToSendType = {
  title: string
  priority: PriorityType
  type: TypeType
  userId: ID
  read: boolean
  actionUrl?: string
  metadata?: {
    photo?: ImageType
    bookTitle?: string
    bookId?: ID
  }
  expiresAt?: ISOString
  message?: string
  input?: string
  createdIn?: ISOString
}