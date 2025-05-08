import { MessageObjectType } from './message'
import { ID, ISOString } from './objects'

export type ConversationObjectType = {
  id: ID
  users: [ID, ID]
  created_in: ISOString
  last_message: MessageObjectType | null
}
