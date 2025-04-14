import { pool } from '../../../assets/config.js'
import { bookObject } from '../bookObject.js'
/*
 CREATE TABLE books (
    id SERIAL PRIMARY KEY,            -- Identificador único autoincremental
    title TEXT NOT NULL,              -- Título del libro
    author TEXT NOT NULL,             -- Autor del libro
    genre TEXT,                       -- Género del libro (opcional)
    published_date DATE,              -- Fecha de publicación
    description TEXT,                 -- Descripción del libro
    stock INTEGER DEFAULT 0,          -- Número de libros disponibles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Fecha de creación del registro
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Última actualización
);
 */
class BooksModel {
  static async getAllBooks () {
    try {
      const res = await pool.query('SELECT * FROM books')
      return res.rows
    } catch (err) {
      console.error('Error fetching books:', err)
      throw new Error(err)
    }
  }

  static async getBookById (id) {
    try {
      const res = await pool.query('SELECT * FROM books WHERE _id = $1', [id])
      return res.rows[0] || null
    } catch (err) {
      console.error('Error fetching book:', err)
      throw new Error(err)
    }
  }

  // Pendiente, no se como intgrar con postgre
  static async getBookByQuery (query, l, books = []) {
    const result = await pool.query(`
      SELECT *,
            similarity(titulo || ' ' || descripcion, $1) AS score
      FROM books
      WHERE disponibilidad = 'Disponible'
        AND similarity(titulo || ' ' || descripcion, $1) > 0.3
      ORDER BY score DESC
      LIMIT $2;
    `, [query, l])
  }

  static async getBooksByQueryWithFilters (query) {

  }

  static async createBook (data) {
    try {
      const info = bookObject(data)
      const res = await pool.query(
        `INSERT INTO books (id, titulo, autor, precio, oferta, isbn, descripcion, estado, genero, formato, vendedor, id_vendedor, edicion, idioma, ubicacion, tapa, edad, fecha_publicacion, actualizado_en, disponibilidad, libros_vendidos, images, keywords, mensajes, collections_ids) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), $19, $20, $21, $22, $23, $24) RETURNING *`,
        [info.id, info.titulo, info.autor, info.precio, info.oferta, info.isbn, info.descripcion, info.estado, info.genero, info.formato, info.vendedor, info.idVendedor, info.edicion, info.idioma, info.ubicacion, info.tapa, info.edad, info.fechaPublicacion, info.disponibilidad, info.librosVendidos, info.images, info.keywords, info.mensajes, info.collectionsIds]
      )
      return res.rows[0]
    } catch (err) {
      console.error('Error creating book:', err)
      throw new Error(err)
    }
  }

  static async updateBook (id, data) {
    try {
      const fields = Object.keys(data)
      const values = Object.values(data)
      values.push(id)

      const setQuery = fields.map((field, index) => `${field} = $${index + 1}`).join(', ')
      const res = await pool.query(
        `UPDATE books SET ${setQuery}, actualizadoEn = NOW() WHERE _id = $${fields.length + 1} RETURNING *`,
        values
      )
      return res.rows[0]
    } catch (err) {
      console.error('Error updating book:', err)
      throw new Error(err)
    }
  }

  static async deleteBook (id) {
    try {
      await pool.query('DELETE FROM books WHERE _id = $1', [id])
      return { message: 'Book deleted successfully' }
    } catch (err) {
      console.error('Error deleting book:', err)
      throw new Error('Error deleting book')
    }
  }

  static async getAllReviewBooks () {
    // TODO
    try {
      const result = await pool.query('SELECT * FROM review_books')
      return result.rows.map(bookObject)
    } catch (error) {
      console.error('Error fetching review books:', error)
      throw new Error('Error fetching review books')
    }
  }

  static async createReviewBook (data) {
    // TODO

    const info = bookObject(data)
    try {
      await pool.query('INSERT INTO review_books' +
        '(id, title, author, genre, published_date, description, stock)' +
        'VALUES($1, $2, $3, $4, $5, $6, $7)',
      [info.id, info.title, info.author, info.genre, info.published_date,
        info.description, info.stock])
    } catch (error) {

    }
  }

  static async deleteReviewBook (id) {
    // TODO
    try {
      await pool.query('DELETE FROM review_books WHERE id = $1', [id])
      return { message: 'Book deleted successfully' }
    } catch (err) {
      console.error('Error deleting book:', err)
      throw new Error('Error deleting book')
    }
  }

  static async updateReviewBook (id, data) {
    // TODO
  }

  static async forYouPage (user) {
    // TODO
  }

  static async getFavoritesByUser (favorites) {
    // TODO
  }

  static async getBooksByIdList (list, l) {
    // TODO
  }

  static async predictInfo (file) { // AI Model
    // TODO
  }
}

export { BooksModel }
