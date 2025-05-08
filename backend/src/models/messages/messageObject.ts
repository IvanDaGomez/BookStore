import { MessageObjectType } from '../../types/message'
import { ISOString } from '../../types/objects'

const messageObject = (data: Partial<MessageObjectType>): MessageObjectType => {
  return {
    id: data.id ?? crypto.randomUUID(),
    user_id: data.user_id ?? crypto.randomUUID(),
    message: data.message ?? '',
    conversation_id: data.conversation_id ?? crypto.randomUUID(),
    created_in: data.created_in || (new Date().toISOString() as ISOString),
    read: data.read || false
  }
}

export { messageObject }
