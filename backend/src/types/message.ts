import { ID, ISOString } from "./objects"

export type MessageObjectType = {
  _id: ID
  userId: ID
  message: string
  conversationId: ID
  createdIn: ISOString
  read: boolean
}
