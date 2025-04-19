import { ConversationObjectType } from "../../types/conversation"
import { ISOString } from "../../types/objects"


const conversationObject = (data: Partial<ConversationObjectType>): ConversationObjectType => {
  return {
    _id: data._id ?? crypto.randomUUID(),
    users: data.users ?? [crypto.randomUUID(), crypto.randomUUID()],
    createdIn: data.createdIn ?? new Date().toISOString() as ISOString,
    lastMessage: data.lastMessage ?? null
  }
}

export { conversationObject }