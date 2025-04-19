import { ID, ISOString } from "./objects"

type lastMessageType = {
  _id: ID
  userId: ID
  message: string
  createdIn: ISOString
  conversationID: ID
  read: boolean
}

export type ConversationObjectType = {
  _id: ID
  users: [ID, ID]
  createdIn: ISOString
  lastMessage: lastMessageType | null
}