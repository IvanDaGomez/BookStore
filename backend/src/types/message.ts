import { ID, ISOString } from './objects'

export type MessageObjectType = {
  id: ID
  user_id: ID
  message: string
  conversation_id: ID
  created_in: ISOString
  read: boolean
}
