import { ID, ImageType } from "./objects";
import { PartialUserInfoType, UserInfoType } from "./user";

export interface IUsersModel {
  getAllUsers(): Promise<UserInfoType[]>;
  getAllUsersSafe(): Promise<PartialUserInfoType[]>;
  getUserById(id: ID): Promise<PartialUserInfoType>;
  getPhotoAndNameUser(id: ID): Promise<{
    _id: ID
    fotoPerfil: ImageType
    nombre: string
  }>
  getEmailById(id: ID): Promise<{ correo: string, nombre: string }>;
  getUserByQuery(query: string): Promise<PartialUserInfoType[]>
  login(correo: string, contraseña: string): Promise<PartialUserInfoType>
  googleLogin(data: { nombre: string, correo: string }): Promise<UserInfoType>
  facebookLogin(data: { nombre: string, correo: string }): Promise<UserInfoType> 
  getUserByEmail(correo: string): Promise<UserInfoType>
  createUser(data: { nombre: string, correo: string, contraseña: string }): Promise<UserInfoType>
  updateUser(id: ID, data: Partial<UserInfoType>): Promise<PartialUserInfoType>
  deleteUser(id: ID): Promise<{ message: string }>
  getBalance(id: ID): Promise<{
    pendiente?: number
    disponible?: number
    porLlegar?: number
  }>
}

export interface ITransactionsModel {
  // Define the methods and properties of TransactionsModel
  // Example:
  getTransactionById(id: string): Promise<any>;
  // Add other methods from TransactionsModel as needed
}