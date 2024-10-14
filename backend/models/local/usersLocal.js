import fs from 'node:fs/promises'

class UsersModel {
  static async getAllUsers () {
    try {
      const data = await fs.readFile('./models/local/users.json', 'utf-8')
      return JSON.parse(data)
    } catch (err) {
      console.error('Error reading users:', err)
      throw new Error(err)
    }
  }

  static async getUserById (id) {
    try {
      const users = await this.getAllUsers()
      const user = users.find(user => user.id === id)
      if (!user) {
        return null // Si no se encuentra el usuario, retorna null
      }
      return user
    } catch (err) {
      console.error('Error reading user:', err)
      throw new Error(err)
    }
  }

  static async createUser (data) {
    try {
      const users = await this.getAllUsers()
      users.push(data)
      await fs.writeFile('./models/local/users.json', JSON.stringify(users, null, 2))
      return data // Retorna el usuario creado
    } catch (err) {
      console.error('Error creating user:', err)
      throw new Error('Error creating user')
    }
  }

  static async updateUser (id, data) {
    try {
      console.log(data)
      const users = await this.getAllUsers()

      const userIndex = users.findIndex(user => user.id === id)
      if (userIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      /* Logica de correo repetido
            if(data.mail){
                if (users[userIndex].includes(data.mail))
                const emailRepeated = users.splice(userIndex, 1).some(user => user.mail === data.mail);
                if (emailRepeated) {
                    throw new Error("Email is already in use");
                }
            } */

      // Actualiza los datos del usuario
      Object.assign(users[userIndex], data)

      // Hacer el path hacia aqui
      // const filePath = pat h.join()
      await fs.writeFile('./users.json', JSON.stringify(users, null, 2))

      return users[userIndex] // Retorna el usuario actualizado
    } catch (err) {
      console.error('Error updating user:', err)
      throw new Error(err)
    }
  }

  static async deleteUser (id) {
    try {
      const users = await this.getAllUsers()
      const userIndex = users.findIndex(user => user.id === id)
      if (userIndex === -1) {
        return null // Si no se encuentra el usuario, retorna null
      }
      users.splice(userIndex, 1)
      await fs.writeFile('./users.json', JSON.stringify(users, null, 2))
      return { message: 'User deleted successfully' } // Mensaje de éxito
    } catch (err) {
      console.error('Error deleting user:', err)
      throw new Error('Error deleting user')
    }
  }
}

export { UsersModel }
