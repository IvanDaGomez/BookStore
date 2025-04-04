import { Pool } from 'pg'

const pool = new Pool({
  user: 'tu_usuario',
  host: 'localhost',
  database: 'bookstore',
  password: 'tu_contraseña',
  port: 5432
})
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

  static async createBook (data) {
    try {
      const { titulo, autor, precio, oferta, isbn, images, keywords, descripcion, estado, genero, formato, vendedor, idVendedor, edicion, idioma, ubicacion, tapa, edad, disponibilidad, mensajes, librosVendidos, collectionsIds } = data
      const res = await pool.query(
        `INSERT INTO books (titulo, autor, precio, oferta, isbn, images, keywords, descripcion, estado, genero, formato, vendedor, idVendedor, edicion, idioma, ubicacion, tapa, edad, fechaPublicacion, actualizadoEn, disponibilidad, mensajes, librosVendidos, collectionsIds) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW(), NOW(), $19, $20, $21, $22) RETURNING *`,
        [titulo, autor, precio, oferta, isbn, images, keywords, descripcion, estado, genero, formato, vendedor, idVendedor, edicion, idioma, ubicacion, tapa, edad, disponibilidad, mensajes, librosVendidos, collectionsIds]
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
}

export { BooksModel }
