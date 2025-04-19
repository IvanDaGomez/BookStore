import e from 'express'
import { AuthToken } from './authToken'
import { BookObjectType } from './book'
import { CollectionObjectType } from './collection'
import { ConversationObjectType } from './conversation'
import { ID, ImageType } from './objects'
import { PartialUserInfoType, UserInfoType } from './user'
import { MessageObjectType } from './message'

export interface IUsersModel {
  getAllUsers(): Promise<UserInfoType[]>
  getAllUsersSafe(): Promise<PartialUserInfoType[]>
  getUserById(id: ID): Promise<PartialUserInfoType>
  getPhotoAndNameUser(id: ID): Promise<{
    _id: ID
    fotoPerfil: ImageType
    nombre: string
  }>
  getEmailById(id: ID): Promise<{ correo: string; nombre: string }>
  getUserByQuery(query: string): Promise<PartialUserInfoType[]>
  login(correo: string, contraseña: string): Promise<PartialUserInfoType>
  googleLogin(data: { nombre: string; correo: string }): Promise<UserInfoType>
  facebookLogin(data: { nombre: string; correo: string }): Promise<UserInfoType>
  getUserByEmail(correo: string): Promise<UserInfoType>
  createUser(data: {
    nombre: string
    correo: string
    contraseña: string
  }): Promise<UserInfoType>
  updateUser(id: ID, data: Partial<UserInfoType>): Promise<PartialUserInfoType>
  deleteUser(id: ID): Promise<{ message: string }>
  getBalance(id: ID): Promise<{
    pendiente?: number
    disponible?: number
    porLlegar?: number
  }>
}

export interface IBooksModel {
  getAllBooks(): Promise<BookObjectType[]>
  getBookById(id: ID): Promise<BookObjectType>
  getBookByQuery(
    query: string,
    l: number,
    books?: BookObjectType[]
  ): Promise<Partial<BookObjectType>[]>
  getBooksByQueryWithFilters(query: {
    query: string
    where: Record<string, string>
    limit: number
  }): Promise<Partial<BookObjectType>[]>
  getBooksByUserId(userId: ID): Promise<any[]>
  createBook(data: BookObjectType): Promise<BookObjectType>
  updateBook(
    id: ID,
    data: Partial<BookObjectType>
  ): Promise<Partial<BookObjectType>>
  deleteBook(id: ID): Promise<{ message: string }>
  getAllReviewBooks(): Promise<BookObjectType[]>
  createReviewBook(data: Partial<BookObjectType>): Promise<BookObjectType>
  updateReviewBook(
    id: ID,
    data: Partial<BookObjectType>
  ): Promise<BookObjectType>
  deleteReviewBook(id: ID): Promise<{ message: string }>
  forYouPage(
    userKeyInfo: AuthToken | undefined,
    sampleSize: number
  ): Promise<Partial<BookObjectType>[]>
  getFavoritesByUser(favorites: ID[]): Promise<Partial<BookObjectType>[]>
  getBooksByIdList(list: ID[], l: number): Promise<Partial<BookObjectType>[]>
  predictInfo(
    file: Express.Multer.File
  ): Promise<{ title: string; author: string }>
  getBooksByCollection(
    collection: CollectionObjectType
  ): Promise<BookObjectType[]>
}

export interface ICollectionsModel {
  getAllCollections(): Promise<CollectionObjectType[]>
  getCollectionById(id: ID): Promise<CollectionObjectType>
  getCollectionsByUser(id: ID): Promise<CollectionObjectType[]>
  createCollection (data: Partial<CollectionObjectType>): Promise<CollectionObjectType>
  deleteCollection (id: ID): Promise<{ message: string }>
  updateCollection (id: ID, data: Partial<CollectionObjectType>): Promise<CollectionObjectType>
  getCollectionByQuery(
    query: string,
    l: number,
    collections?: CollectionObjectType[]
  ): Promise<Partial<CollectionObjectType>[]>
  getCollectionsByQueryWithFilters (query: {
      query: string
      where: Record<string, string> | {}
      l: number
    }): Promise<CollectionObjectType[]>
  getCollectionSaga (bookId: ID, userId: ID): Promise<CollectionObjectType>
}

export interface IConversationsModel {
  getAllConversations(l?: number): Promise<ConversationObjectType[]>
  getConversationsByList(conversationsIds: ID[]): Promise<ConversationObjectType[]>
  getConversationById(conversationId: ID): Promise<ConversationObjectType>
  createConversation(data: Partial<ConversationObjectType>): Promise<ConversationObjectType>
  deleteConversation(id: ID): Promise<{ message: string }>
  updateConversation(id: ID, data: Partial<ConversationObjectType>): Promise<ConversationObjectType>
}

export interface IEmailsModel {
  getAllEmails(): Promise<string[]>
  getEmailById(id: ID): Promise<string>
  createEmail (data: { email: string }): Promise<{ email: string }>
  deleteEmail (emailGiven: string): Promise<{ message: string }>
}

export interface IMessagesModel {
  getAllMessages(): Promise<MessageObjectType[]>
  getAllMessagesByConversation (id: ID): Promise<MessageObjectType[]>
  getMessageById (id: ID): Promise<MessageObjectType> 
  sendMessage (data: Partial<MessageObjectType>): Promise<MessageObjectType>
  deleteMessage (id: ID): Promise<{ message: string }>
  updateMessage (id: ID, data: Partial<MessageObjectType>): Promise<MessageObjectType>
}
export interface ITransactionsModel {
  // Define the methods and properties of TransactionsModel
  // Example:
  getTransactionById(id: string): Promise<any>
  // Add other methods from TransactionsModel as needed
}
