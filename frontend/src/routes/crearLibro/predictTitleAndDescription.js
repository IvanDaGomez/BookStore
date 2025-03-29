
export async function predictInfo(file) {
    try {
        const formData = new FormData()
        async function urlToBlob (blobUrl) {
          const response = await fetch(blobUrl)
          const blob = await response.blob()
          return blob
        }
        
        const blobFile = await urlToBlob(file)
        formData.append('image', blobFile, `predictedImage.png`)
        const url = 'http://localhost:3030/api/books/predictInfo'
        const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include'
        })

        const data = await response.json()
        console.log({
            title: data.data.title,
            author: data.data.author
        })
        return {
            title: data.data.title,
            author: data.data.author
        }
    } catch (error) {
        console.error(error)
        console.error('Error en el servidor')
    }

}