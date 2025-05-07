import { pool } from "./config.js";
import { IUsersModel } from "../types/models.js";
import { BooksModel } from "../models/books/local/booksLocal.js";
import { CollectionsModel } from "../models/collections/local/collectionsModel.js";
import { ConversationsModel } from "../models/conversations/local/conversationsModel.js";
import { EmailsModel } from "../models/emails/local/emailsModel.js";
import { MessagesModel } from "../models/messages/local/messagesModel.js";
import { NotificationsModel } from "../models/notifications/local/notificationsModel.js";
import { TransactionsModel } from "../models/transactions/local/transactionsModel.js";
import { UsersModel } from "../models/users/local/usersLocal.js";
import fs from "node:fs/promises";
import { __dirname } from "./config.js";
import path from "node:path";
async function dropTables() {
  const dropUsersTable = `DROP TABLE IF EXISTS users CASCADE;`;
  const dropBooksTable = `DROP TABLE IF EXISTS books CASCADE;`;
  const dropBooksBackstageTable = `DROP TABLE IF EXISTS books_backstage CASCADE;`;
  const dropWithdrawalsTable = `DROP TABLE IF EXISTS withdrawals CASCADE;`;
  const dropTrendsTable = `DROP TABLE IF EXISTS trends CASCADE;`;
  const dropCollectionsTable = `DROP TABLE IF EXISTS collections CASCADE;`;
  const dropConversationsTable = `DROP TABLE IF EXISTS conversations CASCADE;`;
  const dropMessagesTable = `DROP TABLE IF EXISTS messages CASCADE;`;
  const dropEmailsTable = `DROP TABLE IF EXISTS emails CASCADE;`;
  const dropNotificationsTable = `DROP TABLE IF EXISTS notifications CASCADE;`;
  const dropTransactionsTable = `DROP TABLE IF EXISTS transactions CASCADE;`;
  
  await Promise.all([
    pool.query(dropUsersTable),
    pool.query(dropBooksTable),
    pool.query(dropCollectionsTable),
    pool.query(dropConversationsTable),
    pool.query(dropMessagesTable),
    pool.query(dropEmailsTable),
    pool.query(dropNotificationsTable),
    pool.query(dropTransactionsTable),
    pool.query(dropBooksBackstageTable),
    pool.query(dropWithdrawalsTable),
    pool.query(dropTrendsTable)
  ]);

  console.log('Tables dropped successfully');
}
async function createTables() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      rol VARCHAR(50) NOT NULL,
      fotoPerfil VARCHAR(255),
      correo VARCHAR(100) NOT NULL UNIQUE,
      direccionEnvio JSONB,
      librosIds VARCHAR[],
      estadoCuenta VARCHAR(50) NOT NULL,
      fechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      bio TEXT,
      favoritos VARCHAR[],
      conversationsIds VARCHAR[],
      notificationsIds VARCHAR[],
      validated BOOLEAN DEFAULT FALSE,
      login VARCHAR(50) NOT NULL,
      ubicacion JSONB,
      seguidores VARCHAR[],
      siguiendo VARCHAR[],
      coleccionsIds VARCHAR[],
      comprasIds VARCHAR[],
      preferencias JSONB,
      historialBusquedas JSONB,
      balance JSONB
    );
  `;

  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      id VARCHAR PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      precio DECIMAL(10, 2) NOT NULL,
      oferta DECIMAL(10, 2),
      isbn VARCHAR(20) UNIQUE NOT NULL,
      images VARCHAR(200)[],
      keywords VARCHAR[],
      descripcion TEXT,
      estado VARCHAR(50),
      genero VARCHAR(50),
      formato VARCHAR(50),
      vendedor VARCHAR(100),
      idVendedor VARCHAR,
      edicion VARCHAR(50),
      idioma VARCHAR(50),
      ubicacion JSONB,
      tapa VARCHAR(50),
      edad VARCHAR(50),
      fechaPublicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      disponibilidad VARCHAR(50) DEFAULT TRUE,
      mensajes VARCHAR[][],
      collectionsIds VARCHAR[]
    );
  `;
  const createBooksBackstageTable = `
    CREATE TABLE IF NOT EXISTS books_backstage (
      id VARCHAR PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      precio DECIMAL(10, 2) NOT NULL,
      oferta DECIMAL(10, 2),
      isbn VARCHAR(20) UNIQUE NOT NULL,
      images VARCHAR(200)[],
      keywords VARCHAR[],
      descripcion TEXT,
      estado VARCHAR(50),
      genero VARCHAR(50),
      formato VARCHAR(50),
      vendedor VARCHAR(100),
      idVendedor VARCHAR,
      edicion VARCHAR(50),
      idioma VARCHAR(50),
      ubicacion JSONB,
      tapa VARCHAR(50),
      edad VARCHAR(50),
      fechaPublicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      disponibilidad VARCHAR(50) DEFAULT TRUE,
      mensajes VARCHAR[][],
      collectionsIds VARCHAR[]
    );
  `;
  const createTrendsTable = `
    CREATE TABLE IF NOT EXISTS trends (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10) NOT NULL
    );
  `;
  const createWithdrawalsTable = `
    CREATE TABLE IF NOT EXISTS withdrawals (
      id VARCHAR PRIMARY KEY,
      userId VARCHAR,
      numeroCuenta VARCHAR(50),
      bank VARCHAR(50),
      phoneNumber VARCHAR(50),
      monto DECIMAL(10, 2),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'pending'
    );`;
  const createCollectionsTable = `
    CREATE TABLE IF NOT EXISTS collections (
      id VARCHAR PRIMARY KEY,
      foto VARCHAR(255),
      librosIds VARCHAR[],
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      seguidores VARCHAR[],
      userId VARCHAR,
      saga BOOLEAN DEFAULT FALSE,
      creadoEn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createConversationsTable = `
    CREATE TABLE IF NOT EXISTS conversations (
      id VARCHAR PRIMARY KEY,
      users VARCHAR[] NOT NULL,
      createdIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      lastMessage JSONB
    );
  `;
  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR PRIMARY KEY,
      conversationId VARCHAR,
      userId VARCHAR,
      message TEXT NOT NULL,
      createdIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT FALSE
    );
  `;

  const createEmailsTable = `
    CREATE TABLE IF NOT EXISTS emails (
      email VARCHAR PRIMARY KEY
    );
  `;
  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      priority VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      userId VARCHAR,
      input TEXT,
      createdIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT FALSE,
      actionUrl VARCHAR(255),
      expiresAt TIMESTAMP NOT NULL,
      message TEXT,
      metadata JSONB
    );
  `;

  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      postgreId SERIAL PRIMARY KEY,
      id VARCHAR,
      userId VARCHAR,
      bookId VARCHAR,
      sellerId VARCHAR,
      status VARCHAR(50) NOT NULL,
      shippingDetails JSONB,
      response JSONB,
      orden JSONB
    );
  `;


  await Promise.all([
    pool.query(createUsersTable),
    pool.query(createBooksTable),
    pool.query(createCollectionsTable),
    pool.query(createConversationsTable),
    pool.query(createMessagesTable),
    pool.query(createEmailsTable),
    pool.query(createNotificationsTable),
    pool.query(createTransactionsTable),
    pool.query(createBooksBackstageTable),
    pool.query(createWithdrawalsTable),
    pool.query(createTrendsTable)
  ])

  console.log('Tables created successfully');
}

async function fillTablesWithLocalData() {
  const userData = await UsersModel.getAllUsers();
  const bookData = await BooksModel.getAllBooks();
  const bookBackstageData = await BooksModel.getAllReviewBooks();
  const withdrawalData = await TransactionsModel.getAllWithdrawTransactions();
  const rawTrends = await fs.readFile(path.join(__dirname, "data", "trends.json"), "utf-8");
  const trendsData = JSON.parse(rawTrends);
  const collectionData = await CollectionsModel.getAllCollections();
  const conversationData = await ConversationsModel.getAllConversations();
  const messageData = await MessagesModel.getAllMessages();
  const notificationData = await NotificationsModel.getAllNotifications();
  const emailData = await EmailsModel.getAllEmails();
  const transactionData = await TransactionsModel.getAllTransactions();

  try {
    await Promise.all(
      userData.map((user) =>
        pool.query(
          `
          INSERT INTO users (id, nombre, rol, fotoPerfil, correo, direccionEnvio, librosIds, 
          estadoCuenta, fechaRegistro, actualizadoEn, bio, favoritos, conversationsIds, 
          notificationsIds, validated, login, ubicacion, seguidores, siguiendo, coleccionsIds, 
          comprasIds, preferencias, historialBusquedas)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23);
        `,
          [
            user._id,
            user.nombre,
            user.rol,
            user.fotoPerfil,
            user.correo,
            user.direccionEnvio,
            user.librosIds,
            user.estadoCuenta,
            user.fechaRegistro,
            user.actualizadoEn,
            user.bio,
            user.favoritos,
            user.conversationsIds,
            user.notificationsIds,
            user.validated,
            user.login,
            user.ubicacion,
            user.seguidores,
            user.siguiendo,
            user.coleccionsIds,
            user.comprasIds,
            user.preferencias,
            user.historialBusquedas,
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting users:", error);
  }

  try {
    await Promise.all(
      bookData.map((book) =>
        pool.query(
          `
          INSERT INTO books (id, titulo, autor, precio, oferta, isbn, images, keywords, 
          descripcion, estado, genero, formato, vendedor, idVendedor, edicion, idioma, 
          ubicacion, tapa, edad, fechaPublicacion, actualizadoEn, disponibilidad,
          mensajes, collectionsIds)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,$21,$22, $23, $24)
          ON CONFLICT (isbn) DO NOTHING;
        `,
          [
            book._id,
            book.titulo,
            book.autor,
            book.precio,
            book.oferta,
            book.isbn,
            book.images,
            book.keywords,
            book.descripcion,
            book.estado,
            book.genero,
            book.formato,
            book.vendedor,
            book.idVendedor,
            book.edicion,
            book.idioma,
            book.ubicacion,
            book.tapa,
            book.edad,
            book.fechaPublicacion,
            book.actualizadoEn,
            book.disponibilidad,
            book.mensajes,
            book.collectionsIds,
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting books:", error);
  }

  try {
    await Promise.all(
      bookBackstageData.map((book) =>
        pool.query(
          `
          INSERT INTO books_backstage (id, titulo, autor, precio, oferta, isbn, images, keywords, 
          descripcion, estado, genero, formato, vendedor, idVendedor, edicion, idioma, 
          ubicacion, tapa, edad, fechaPublicacion, actualizadoEn, disponibilidad,
          mensajes, collectionsIds)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,$21,$22, $23, $24)
          ON CONFLICT (isbn) DO NOTHING;
        `,
          [
            book._id,
            book.titulo,
            book.autor,
            book.precio,
            book.oferta,
            book.isbn,
            book.images,
            book.keywords,
            book.descripcion,
            book.estado,
            book.genero,
            book.formato,
            book.vendedor,
            book.idVendedor,
            book.edicion,
            book.idioma,
            book.ubicacion,
            book.tapa,
            book.edad,
            book.fechaPublicacion,
            book.actualizadoEn,
            book.disponibilidad,
            book.mensajes,
            book.collectionsIds,
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting books:", error);
  }
  try {
    await Promise.all(
      collectionData.map((collection) =>
        pool.query(
          `
          INSERT INTO collections (id, foto, librosIds, nombre, descripcion, seguidores, userId, saga, creadoEn)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `,
          [
            collection._id,
            collection.foto,
            collection.librosIds,
            collection.nombre,
            collection.descripcion,
            collection.seguidores,
            collection.userId,
            collection.saga,
            collection.creadoEn,
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting collections:", error);
  }

  try {
    await Promise.all(
      conversationData.map((conversation) =>
        pool.query(
          `
          INSERT INTO conversations (id, users, createdIn, lastMessage)
          VALUES ($1, $2, $3, $4);
        `,
          [conversation._id, conversation.users, conversation.createdIn, conversation.lastMessage]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting conversations:", error);
  }

  try {
    await Promise.all(
      messageData.map((message) =>
        pool.query(
          `
          INSERT INTO messages (id, conversationId, userId, message, createdIn, read)
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
          [
            message._id,
            message.conversationId,
            message.userId,
            message.message,
            message.createdIn,
            message.read,
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting messages:", error);
  }

  try {
    await Promise.all(
      notificationData.map((notification) =>
        pool.query(
          `
          INSERT INTO notifications (id, title, priority, type, userId, input, createdIn, read, actionUrl, expiresAt, message, metadata)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
        `,
          [
            notification._id,
            notification.title,
            notification.priority,
            notification.type,
            notification.userId,
            notification.input,
            notification.createdIn,
            notification.read,
            notification.actionUrl,
            notification.expiresAt,
            notification.message,
            notification.metadata,
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting notifications:", error);
  }

  try {
    await Promise.all(
      emailData.map((email) =>
        pool.query(
          `
          INSERT INTO emails (email)
          VALUES ($1);
        `,
          [email]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting emails:", error);
  }

  try {
    await Promise.all(
      transactionData.map((transaction) =>
        pool.query(
          `
          INSERT INTO transactions (id, userId, bookId, sellerId, status, shippingDetails, response, orden)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
          [
            transaction._id,
            transaction.userId,
            transaction.bookId,
            transaction.sellerId,
            transaction.status,
            transaction.shippingDetails,
            transaction.response,
            transaction.order ?? {},
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting transactions:", error);
  }
  try {
    await Promise.all(
      withdrawalData.map((withdrawal) =>
        pool.query(
          `
          INSERT INTO withdrawals (id, userId, numeroCuenta, bank, monto, fecha, status, phoneNumber)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
          [
            withdrawal._id,
            withdrawal.userId,
            withdrawal.numeroCuenta,
            withdrawal.bank,
            withdrawal.monto,
            withdrawal.fecha,
            withdrawal.status,
            withdrawal.phoneNumber
          ]
        )
      )
    );
  } catch (error) {
    console.error("Error inserting withdrawals:", error);
  }
  try {
    Object.entries(trendsData).map(([key, trend]) =>
      pool.query(
        `
        INSERT INTO trends (title, amount)
        VALUES ($1, $2);
      `,
        [key, trend]
      )
    )
  } catch (error) {
    console.error("Error inserting trends:", error);
  }
  console.log("Tables filled with local data successfully");
  // Close the database connection
}



async function seed() {
  await pool.connect();
  console.log("Connected to the database");
  await dropTables()
  await createTables();
  await fillTablesWithLocalData();
}

seed()