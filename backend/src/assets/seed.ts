import { pool } from './config.js'
import { IUsersModel } from '../types/models.js'
import { BooksModel } from '../models/books/local/booksLocal.js'
import { CollectionsModel } from '../models/collections/local/collectionsModel.js'
import { ConversationsModel } from '../models/conversations/local/conversationsModel.js'
import { EmailsModel } from '../models/emails/local/emailsModel.js'
import { MessagesModel } from '../models/messages/local/messagesModel.js'
import { NotificationsModel } from '../models/notifications/local/notificationsModel.js'
import { TransactionsModel } from '../models/transactions/local/transactionsModel.js'
import { UsersModel } from '../models/users/local/usersLocal.js'
import fs from 'node:fs/promises'
import { __dirname } from './config.js'
import path from 'node:path'
async function dropTables () {
  const dropUsersTable = `DROP TABLE IF EXISTS users CASCADE;`
  const dropBooksTable = `DROP TABLE IF EXISTS books CASCADE;`
  const dropBooksBackstageTable = `DROP TABLE IF EXISTS books_backstage CASCADE;`
  const dropWithdrawalsTable = `DROP TABLE IF EXISTS withdrawals CASCADE;`
  const dropTrendsTable = `DROP TABLE IF EXISTS trends CASCADE;`
  const dropCollectionsTable = `DROP TABLE IF EXISTS collections CASCADE;`
  const dropConversationsTable = `DROP TABLE IF EXISTS conversations CASCADE;`
  const dropMessagesTable = `DROP TABLE IF EXISTS messages CASCADE;`
  const dropEmailsTable = `DROP TABLE IF EXISTS emails CASCADE;`
  const dropNotificationsTable = `DROP TABLE IF EXISTS notifications CASCADE;`
  const dropTransactionsTable = `DROP TABLE IF EXISTS transactions CASCADE;`

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
  ])

  console.log('Tables dropped successfully')
}

async function createTables () {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR PRIMARY KEY,
      nombre VARCHAR(100) NOT NULL,
      rol VARCHAR(50) NOT NULL,
      foto_perfil VARCHAR(255),
      correo VARCHAR(100) NOT NULL UNIQUE,
      direccion_envio JSONB,
      libros_ids VARCHAR[],
      estado_cuenta VARCHAR(50) NOT NULL,
      fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      bio TEXT,
      favoritos VARCHAR[],
      conversations_ids VARCHAR[],
      notifications_ids VARCHAR[],
      validated BOOLEAN DEFAULT FALSE,
      login VARCHAR(50) NOT NULL,
      ubicacion JSONB,
      seguidores VARCHAR[],
      siguiendo VARCHAR[],
      collections_ids VARCHAR[],
      compras_ids VARCHAR[],
      preferencias JSONB,
      historial_busquedas JSONB,
      balance JSONB,
      contraseña VARCHAR(255)
    );
  `

  const createBooksTable = `
    CREATE TABLE IF NOT EXISTS books (
      id VARCHAR PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      precio DECIMAL(10) NOT NULL,
      oferta DECIMAL(10),
      isbn VARCHAR(20),
      images VARCHAR(200)[],
      keywords VARCHAR[],
      descripcion TEXT,
      estado VARCHAR(50),
      genero VARCHAR(50),
      formato VARCHAR(50),
      vendedor VARCHAR(100),
      id_vendedor VARCHAR,
      edicion VARCHAR(50),
      idioma VARCHAR(50),
      ubicacion JSONB,
      tapa VARCHAR(50),
      edad VARCHAR(50),
      fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      disponibilidad VARCHAR(50) DEFAULT TRUE,
      mensajes JSONB[],
      collections_ids VARCHAR[]
    );
  `
  const createBooksBackstageTable = `
    CREATE TABLE IF NOT EXISTS books_backstage (
      id VARCHAR PRIMARY KEY,
      titulo VARCHAR(255) NOT NULL,
      autor VARCHAR(255) NOT NULL,
      precio DECIMAL(10) NOT NULL,
      oferta DECIMAL(10),
      isbn VARCHAR(20),
      images VARCHAR(200)[],
      keywords VARCHAR[],
      descripcion TEXT,
      estado VARCHAR(50),
      genero VARCHAR(50),
      formato VARCHAR(50),
      vendedor VARCHAR(100),
      id_vendedor VARCHAR,
      edicion VARCHAR(50),
      idioma VARCHAR(50),
      ubicacion JSONB,
      tapa VARCHAR(50),
      edad VARCHAR(50),
      fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      disponibilidad VARCHAR(50) DEFAULT 'Disponible',
      mensajes JSONB[],
      collections_ids VARCHAR[]
    );
  `
  const createTrendsTable = `
    CREATE TABLE IF NOT EXISTS trends (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      amount DECIMAL(10) NOT NULL
    );
  `
  const createWithdrawalsTable = `
    CREATE TABLE IF NOT EXISTS withdrawals (
      id VARCHAR PRIMARY KEY,
      user_id VARCHAR,
      numero_cuenta VARCHAR(50),
      bank VARCHAR(50),
      phone_number VARCHAR(50),
      monto DECIMAL(10, 2),
      fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status VARCHAR(50) DEFAULT 'pending'
    );`
  const createCollectionsTable = `
    CREATE TABLE IF NOT EXISTS collections (
      id VARCHAR PRIMARY KEY,
      foto VARCHAR(255),
      libros_ids VARCHAR[],
      nombre VARCHAR(100) NOT NULL,
      descripcion TEXT,
      seguidores VARCHAR[],
      user_id VARCHAR,
      saga BOOLEAN DEFAULT FALSE,
      creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `

  const createConversationsTable = `
    CREATE TABLE IF NOT EXISTS conversations (
      id VARCHAR PRIMARY KEY,
      users VARCHAR[] NOT NULL,
      created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_message JSONB
    );
  `
  const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR PRIMARY KEY,
      conversation_id VARCHAR,
      user_id VARCHAR,
      message TEXT NOT NULL,
      created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT FALSE
    );
  `

  const createEmailsTable = `
    CREATE TABLE IF NOT EXISTS emails (
      id SERIAL PRIMARY KEY,
      email VARCHAR
    );
  `
  const createNotificationsTable = `
    CREATE TABLE IF NOT EXISTS notifications (
      id VARCHAR PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      priority VARCHAR(50) NOT NULL,
      type VARCHAR(50) NOT NULL,
      user_id VARCHAR,
      input TEXT,
      created_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read BOOLEAN DEFAULT FALSE,
      action_url VARCHAR(255),
      expires_at TIMESTAMP NOT NULL,
      message TEXT,
      metadata JSONB
    );
  `

  const createTransactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      postgre_id SERIAL PRIMARY KEY,
      id VARCHAR,
      user_id VARCHAR,
      book_id VARCHAR,
      seller_id VARCHAR,
      status VARCHAR(50) NOT NULL,
      shipping_details JSONB,
      response JSONB,
      orden JSONB
    );
  `

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

  console.log('Tables created successfully')
}

async function fillTablesWithLocalData () {
  const userData = await UsersModel.getAllUsers()
  const bookData = await BooksModel.getAllBooks()
  const bookBackstageData = await BooksModel.getAllReviewBooks()
  const withdrawalData = await TransactionsModel.getAllWithdrawTransactions()
  const rawTrends = await fs.readFile(
    path.join(__dirname, 'data', 'trends.json'),
    'utf-8'
  )
  const trendsData = JSON.parse(rawTrends)
  const collectionData = await CollectionsModel.getAllCollections()
  const conversationData = await ConversationsModel.getAllConversations()
  const messageData = await MessagesModel.getAllMessages()
  const notificationData = await NotificationsModel.getAllNotifications()
  const emailData = await EmailsModel.getAllEmails()
  const transactionData = await TransactionsModel.getAllTransactions()

  try {
    await Promise.all(
      userData.map(user =>
        pool.query(
          `
          INSERT INTO users (id, nombre, rol, foto_perfil, correo, direccion_envio, libros_ids, 
          estado_cuenta, fecha_registro, actualizado_en, bio, favoritos, conversations_ids, 
          notifications_ids, validated, login, ubicacion, seguidores, siguiendo, collections_ids, 
          compras_ids, preferencias, historial_busquedas, balance, contraseña)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25);
        `,
          [
            user.id,
            user.nombre,
            user.rol,
            user.foto_perfil,
            user.correo,
            user.direccion_envio,
            user.libros_ids,
            user.estado_cuenta,
            user.fecha_registro,
            user.actualizado_en,
            user.bio,
            user.favoritos,
            user.conversations_ids,
            user.notifications_ids,
            user.validated,
            user.login,
            user.ubicacion,
            user.seguidores,
            user.siguiendo,
            user.collections_ids,
            user.compras_ids,
            user.preferencias,
            user.historial_busquedas,
            user.balance,
            user.contraseña
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting users:', error)
  }

  try {
    await Promise.all(
      bookData.map(book =>
        pool.query(
          `
          INSERT INTO books (id, titulo, autor, precio, oferta, isbn, images, keywords, 
          descripcion, estado, genero, formato, vendedor, id_vendedor, edicion, idioma, 
          ubicacion, tapa, edad, fecha_publicacion, actualizado_en, disponibilidad,
          mensajes, collections_ids)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,$21,$22, $23, $24);
        `,
          [
            book.id,
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
            book.id_vendedor,
            book.edicion,
            book.idioma,
            book.ubicacion,
            book.tapa,
            book.edad,
            book.fecha_publicacion,
            book.actualizado_en,
            book.disponibilidad,
            book.mensajes,
            book.collections_ids
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting books:', error)
  }

  try {
    await Promise.all(
      bookBackstageData.map(book =>
        pool.query(
          `
          INSERT INTO books_backstage (id, titulo, autor, precio, oferta, isbn, images, keywords, 
          descripcion, estado, genero, formato, vendedor, id_vendedor, edicion, idioma, 
          ubicacion, tapa, edad, fecha_publicacion, actualizado_en, disponibilidad,
          mensajes, collections_ids)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
          $14, $15, $16, $17, $18, $19, $20,$21,$22, $23, $24);
        `,
          [
            book.id,
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
            book.id_vendedor,
            book.edicion,
            book.idioma,
            book.ubicacion,
            book.tapa,
            book.edad,
            book.fecha_publicacion,
            book.actualizado_en,
            book.disponibilidad,
            book.mensajes,
            book.collections_ids
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting books:', error)
  }
  try {
    await Promise.all(
      collectionData.map(collection =>
        pool.query(
          `
          INSERT INTO collections (id, foto, libros_ids, nombre, descripcion, seguidores, user_id, saga, creado_en)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
        `,
          [
            collection.id,
            collection.foto,
            collection.libros_ids,
            collection.nombre,
            collection.descripcion,
            collection.seguidores,
            collection.user_id,
            collection.saga,
            collection.creado_en
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting collections:', error)
  }

  try {
    await Promise.all(
      conversationData.map(conversation =>
        pool.query(
          `
          INSERT INTO conversations (id, users, created_in, last_message)
          VALUES ($1, $2, $3, $4);
        `,
          [
            conversation.id,
            conversation.users,
            conversation.created_in,
            conversation.last_message
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting conversations:', error)
  }

  try {
    await Promise.all(
      messageData.map(message =>
        pool.query(
          `
          INSERT INTO messages (id, conversation_id, user_id, message, created_in, read)
          VALUES ($1, $2, $3, $4, $5, $6);
        `,
          [
            message.id,
            message.conversation_id,
            message.user_id,
            message.message,
            message.created_in,
            message.read
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting messages:', error)
  }

  try {
    await Promise.all(
      notificationData.map(notification =>
        pool.query(
          `
          INSERT INTO notifications (id, title, priority, type, user_id, input, created_in, read, action_url, expires_at, message, metadata)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
        `,
          [
            notification.id,
            notification.title,
            notification.priority,
            notification.type,
            notification.user_id,
            notification.input,
            notification.created_in,
            notification.read,
            notification.action_url,
            notification.expires_at,
            notification.message,
            notification.metadata
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting notifications:', error)
  }

  try {
    await Promise.all(
      emailData.map(email =>
        pool.query(
          `
          INSERT INTO emails (email)
          VALUES ($1);
        `,
          [email]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting emails:', error)
  }

  try {
    await Promise.all(
      transactionData.map(transaction =>
        pool.query(
          `
          INSERT INTO transactions (id, user_id, book_id, seller_id, status, shipping_details, response, orden)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
          [
            transaction.id,
            transaction.user_id,
            transaction.book_id,
            transaction.seller_id,
            transaction.status,
            transaction.shipping_details,
            transaction.response,
            transaction.order ?? {}
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting transactions:', error)
  }
  try {
    await Promise.all(
      withdrawalData.map(withdrawal =>
        pool.query(
          `
          INSERT INTO withdrawals (id, user_id, numero_cuenta, bank, monto, fecha, status, phone_number)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
        `,
          [
            withdrawal.id,
            withdrawal.user_id,
            withdrawal.numero_cuenta,
            withdrawal.bank,
            withdrawal.monto,
            withdrawal.fecha,
            withdrawal.status,
            withdrawal.phone_number
          ]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting withdrawals:', error)
  }
  try {
    await Promise.all(
      Object.entries(trendsData).map(([key, trend]) =>
        pool.query(
          `
      INSERT INTO trends (title, amount)
      VALUES ($1, $2);
    `,
          [key, trend]
        )
      )
    )
  } catch (error) {
    console.error('Error inserting trends:', error)
  }
  console.log('Tables filled with local data successfully')
  // Close the database connection
}

async function seed () {
  await pool.connect()

  console.log('Connected to the database')
  await dropTables()
  await createTables()
  await fillTablesWithLocalData()
  console.log('Database seeded successfully')
  await pool.end()
}

seed()
