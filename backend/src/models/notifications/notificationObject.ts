import { PriorityType, TypeType } from "../../types/notificationCategories"
import { ID, ImageType, ISOString } from "../../types/objects"

type NotificationObjectType = {
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
  metadata?: {
    photo?: ImageType | ''
    bookTitle?: string
    bookId?: ID
  }
}

const notificationObject = (data: NotificationObjectType): NotificationObjectType => {
  return {
    _id: data._id || '',
    title: data.title || '',
    priority: data.priority || '',
    type: data.type || '',
    userId: data.userId || '',
    input: data.input || '',
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false,
    actionUrl: data.actionUrl || '',
    expiresAt: data.expiresAt || new Date().toISOString(),
    metadata: data.metadata || {}
  }
}

export { notificationObject, NotificationObjectType }