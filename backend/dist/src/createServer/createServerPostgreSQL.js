import { createApp } from '../index';
import { BooksModel } from '../models/books/postgreSQL/booksModel.js';
import { UsersModel } from '../models/users/postgreSQL/usersModel.js';
import { MessagesModel } from '../models/messages/postgreSQL/messagesModel.js';
import { ConversationsModel } from '../models/conversations/postgreSQL/conversationsModel.js';
import { NotificationsModel } from '../models/notifications/postgreSQL/notificationsModel.js';
import { TransactionsModel } from '../models/transactions/postgreSQL/transactionsModel.js';
import { EmailsModel } from '../models/emails/postgreSQL/emailsModel.js';
import { CollectionsModel } from '../models/collections/postgreSQL/collectionsModel.js';
createApp({
    BooksModel,
    UsersModel,
    MessagesModel,
    ConversationsModel,
    NotificationsModel,
    TransactionsModel,
    EmailsModel,
    CollectionsModel
});
