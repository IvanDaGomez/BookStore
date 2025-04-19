import { createApp } from '../index.js'
import { BooksModel } from '../models/books/local/booksLocal.js'
import { UsersModel } from '../models/users/local/usersLocal.js'
import { MessagesModel } from '../models/messages/local/messagesModel.js'
import { ConversationsModel } from '../models/conversations/local/conversationsModel.js'
import { NotificationsModel } from '../models/notifications/local/notificationsModel.js'
import { TransactionsModel } from '../models/transactions/local/transactionsModel.js'
import { EmailsModel } from '../models/emails/local/emailsModel.js'
import { CollectionsModel } from '../models/collections/local/collectionsModel.js'

createApp({
  BooksModel,
  UsersModel,
  MessagesModel,
  ConversationsModel,
  NotificationsModel,
  TransactionsModel,
  EmailsModel,
  CollectionsModel
})

