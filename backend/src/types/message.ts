import { ID, ISOString } from "./objects"

export type MessageObjectType = {
  id: ID
  userId: ID
  message: string
  conversationId: ID
  createdIn: ISOString
  read: boolean
}
