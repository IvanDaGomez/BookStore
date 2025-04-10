import { pool } from '../../../assets/config.js' // Importa la conexión a PostgreSQL
// import { levenshteinDistance } from '../../../assets/levenshteinDistance.js'
import { collectionObject } from '../collectionObject.js'
/*
CREATE TABLE collections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    foto TEXT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    saga BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/
class CollectionsModel {
  static async getAllCollections () {
    try {
      const { rows } = await pool.query('SELECT * FROM collections')
      return rows.map(collectionObject)
    } catch (err) {
      console.error('Error reading collections:', err)
      throw new Error('Database error')
    }
  }

  static async getCollectionById (id) {
    try {
      const { rows } = await pool.query('SELECT * FROM collections WHERE id = $1', [id])
      return rows.length ? collectionObject(rows[0]) : null
    } catch (err) {
      console.error('Error reading collection:', err)
      throw new Error('Database error')
    }
  }

  static async getCollectionsByUser (userId) {
    try {
      const { rows } = await pool.query('SELECT * FROM collections WHERE user_id = $1', [userId])
      return rows.map(collectionObject)
    } catch (err) {
      console.error('Error fetching collections by user:', err)
      throw new Error('Database error')
    }
  }

  static async createCollection (data) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO collections (foto, nombre, descripcion, user_id, saga)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [data.foto, data.nombre, data.descripcion, data.userId, data.saga]
      )
      return collectionObject(rows[0])
    } catch (err) {
      console.error('Error creating collection:', err)
      throw new Error('Database error')
    }
  }

  static async deleteCollection (id) {
    try {
      const { rowCount } = await pool.query('DELETE FROM collections WHERE id = $1', [id])
      return rowCount ? { message: 'Collection deleted successfully' } : null
    } catch (err) {
      console.error('Error deleting collection:', err)
      throw new Error('Database error')
    }
  }

  static async updateCollection (id, data) {
    try {
      const { rows } = await pool.query(
        `UPDATE collections 
         SET foto = $1, nombre = $2, descripcion = $3, saga = $4 
         WHERE id = $5 RETURNING *`,
        [data.foto, data.nombre, data.descripcion, data.saga, id]
      )
      return rows.length ? collectionObject(rows[0]) : null
    } catch (err) {
      console.error('Error updating collection:', err)
      throw new Error('Database error')
    }
  }
}

export { CollectionsModel }
