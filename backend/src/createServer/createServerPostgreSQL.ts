import { createApp } from '../index.js'
import { BooksModel } from '../models/books/postgreSQL/booksModel.js'
import { UsersModel } from '../models/users/postgreSQL/usersModel.js'
import { MessagesModel } from '../models/messages/postgreSQL/messagesModel.js'
import { ConversationsModel } from '../models/conversations/postgreSQL/conversationsModel.js'
import { NotificationsModel } from '../models/notifications/postgreSQL/notificationsModel.js'
import { TransactionsModel } from '../models/transactions/postgreSQL/transactionsModel.js'
import { EmailsModel } from '../models/emails/postgreSQL/emailsModel.js'
import { CollectionsModel } from '../models/collections/postgreSQL/collectionsModel.js'
import { pool } from '../assets/config.js'

// Maximum number of connection retries
const MAX_RETRIES = 5;
const RETRY_DELAY = 5000; // 5 seconds

async function connectWithRetry(retries = 0): Promise<void> {
  try {
    await pool.connect();
    console.log('Successfully connected to PostgreSQL database');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL database:', error);
    
    if (retries < MAX_RETRIES) {
      console.log(`Retrying connection in ${RETRY_DELAY/1000} seconds... (Attempt ${retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return connectWithRetry(retries + 1);
    } else {
      console.error('Max connection retries reached. Exiting...');
      process.exit(1);
    }
  }
}
// Attempt to connect to the database
await connectWithRetry();

// Create and start the application
const server = createApp({
  BooksModel,
  UsersModel,
  MessagesModel,
  ConversationsModel,
  NotificationsModel,
  TransactionsModel,
  EmailsModel,
  CollectionsModel
});

export { server }; // Export the server instance for proper shutdown handling
