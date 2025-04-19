import { MessageObjectType } from "../../types/message"
import { ISOString } from "../../types/objects"

const messageObject = (data: Partial<MessageObjectType>): MessageObjectType => {
  return {
    _id: data._id ?? crypto.randomUUID(),
    userId: data.userId ?? crypto.randomUUID(),
    message: data.message ?? '',
    conversationId: data.conversationId ?? crypto.randomUUID(),
    createdIn: data.createdIn || new Date().toISOString() as ISOString,
    read: data.read || false
  }
}

export { messageObject }