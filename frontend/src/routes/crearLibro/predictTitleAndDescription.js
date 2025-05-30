import { BACKEND_URL } from "../../assets/config"

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
        const url = `${BACKEND_URL}/api/books/predictInfo`
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })

        const data = await response.json()
        if (data.error) {
            console.error('Error en el servidor:', data.error)
            return
        }
        return {
            title: data.title,
            author: data.author
        }
    } catch (error) {
        console.error(error)
        console.error('Error en el servidor')
    }

}