import axios from 'axios'
export async function ISBNmatch({ titulo, autor, ISBN }) {
    try {
        

        const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`
        const response = await axios.get(url)
        const obj = {
            title: response.data.items[0].volumeInfo.title,
            image: response.data.items[0].volumeInfo.imageLinks.thumbnail,
            authors: response.data.items[0].volumeInfo.authors
        }
        if (titulo !== obj.title) {
            return false
        }
        if (!obj.authors.includes(autor)) {
            return false
        }
        // si coincide
        return true
    } catch {
        console.error('Error buscando el ISBN')
    }
}