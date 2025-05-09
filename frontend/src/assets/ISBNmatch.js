import axios from 'axios'
export async function ISBNmatch ({ titulo, autor, ISBN }) {
  try {
    console.log(ISBN)
    const url = `https://www.googleapis.com/books/v1/volumes?q=isbn:${ISBN}`
    const response = await axios.get(url)


    console.dir(response.data, { depth: null })
    // Buscar la url del pdf
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
  } catch (error) {
    console.log(error)
    console.error('Error buscando el ISBN')
  }
}

ISBNmatch({ titulo: 'La armonia de las celulas', autor: 'Antoine de Saint-Exupéry', ISBN: '9788419399465' })