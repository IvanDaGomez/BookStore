import { ID, ISOString } from "../../types/objects"

type MessageObjectType = {
  _id: ID
  userId: ID
  message: string
  conversationId: ID
  createdIn: ISOString
  read: boolean
}


const messageObject = (data: MessageObjectType): MessageObjectType => {
  return {
    _id: data._id,
    userId: data.userId,
    message: data.message,
    conversationId: data.conversationId,
    createdIn: data.createdIn || new Date().toISOString(),
    read: data.read || false
  }
}

export { messageObject, MessageObjectType }