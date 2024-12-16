import fs from 'node:fs/promises'

const collectionObject = (data) => {
  return {
    _id: data._id || '',
    foto: data.foto || '',
    librosIds: data.librosIds || [],
    nombre: data.nombre || '',
    descripcion: data.descripcion || '',
    seguidores: data.seguidores || [],
    userId: data.userId || '',
    saga: data.saga || false

  }
}
class CollectionsModel {
  static async getAllCollections () {
    try {
      const data = await fs.readFile('./models/collections.json', 'utf-8')
      const collections = JSON.parse(data)

      return collections
    } catch (err) {
      console.error('Error reading collections:', err)
      throw new Error(err)
    }
  }

  static async getCollectionById (id) {
    try {
      const collections = await this.getAllCollections()
      const collection = collections.find(collection => collection._id === id)
      if (!collection) {
        return null
      }

      // Return collection with limited public information
      return collectionObject(collection)
    } catch (err) {
      console.error('Error reading collection:', err)
      throw new Error(err)
    }
  }

  static async getCollectionsByUser (id) {
    try {
      const collections = await this.getAllCollections()
      const filteredCollections = collections.filter(collection => collection.userId === id)
      if (!filteredCollections) {
        return null
      }

      // Return collection with limited public information
      return filteredCollections.map(collection => collectionObject(collection))
    } catch (err) {
      console.error('Error reading collection:', err)
      throw new Error(err)
    }
  }

  static async createCollection (data) {
    try {
      const collections = await this.getAllCollections()

      // Crear valores por defecto
      // Asignar un ID único al colección
      data._id = crypto.randomUUID()
      const time = new Date()
      data.createdIn = `${time.toISOString()}`
      const newCollection = collectionObject(data)
      collections.push(newCollection)
      await fs.writeFile('./models/collections.json', JSON.stringify(collections, null, 2))
      return newCollection
    } catch (err) {
      return err
    }
  }

  static async deleteCollection (id) {
    try {
      const collections = await this.getAllCollections()
      const collectionIndex = collections.findIndex(collection => collection._id === id)
      if (collectionIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      collections.splice(collectionIndex, 1)
      await fs.writeFile('./models/collections.json', JSON.stringify(collections, null, 2))
      return { collection: 'Collection deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting collection:', err)
      throw new Error('Error deleting collection')
    }
  }

  static async updateCollection (id, data) {
    try {
      const collections = await this.getAllCollections()

      const collectionIndex = collections.findIndex(collection => collection._id === id)
      if (collectionIndex === -1) {
        return null // Si no se encuentra la colección, retorna null
      }
      // Actualiza los datos directamente en el objeto de la colección
      Object.assign(collections[collectionIndex], data) // Modifica directamente el objeto en el array
      await fs.writeFile('./models/collections.json', JSON.stringify(collections, null, 2))

      return collectionObject(collections[collectionIndex]) // Devuelve la colección actualizada
    } catch (err) {
      console.error('Error updating collection:', err)
      throw new Error(err)
    }
  }
}

export { CollectionsModel }
