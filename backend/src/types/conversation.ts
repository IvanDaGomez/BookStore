import { MessageObjectType } from "./message"
import { ID, ISOString } from "./objects"


export type ConversationObjectType = {
  id: ID
  users: [ID, ID]
  createdIn: ISOString
  lastMessage: MessageObjectType | null
}