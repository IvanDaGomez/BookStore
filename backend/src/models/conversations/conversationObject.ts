import { ID, ISOString } from "../../types/objects"

type lastMessageType = {
  _id: ID
  userId: ID
  message: string
  createdIn: ISOString
  conversationID: ID
  read: boolean
}

type ConversationObjectType = {
  _id: ID
  users: ID[]
  createdIn: string
  lastMessage: lastMessageType | null
}

const conversationObject = (data: ConversationObjectType): ConversationObjectType => {
  return {
    _id: data._id || '',
    users: data.users || [],
    createdIn: data.createdIn || new Date().toISOString(),
    lastMessage: data.lastMessage || null
  }
}

export { conversationObject, ConversationObjectType }