import { ConversationObjectType } from '../../types/conversation'
import { ISOString } from '../../types/objects'

const conversationObject = (
  data: Partial<ConversationObjectType>
): ConversationObjectType => {
  return {
    id: data.id ?? crypto.randomUUID(),
    users: data.users ?? [crypto.randomUUID(), crypto.randomUUID()],
    created_in: data.created_in ?? (new Date().toISOString() as ISOString),
    last_message: data.last_message ?? null
  }
}

export { conversationObject }
