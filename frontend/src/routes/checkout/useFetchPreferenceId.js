import { useEffect, useState } from "react"

export default function useFetchPreferenceId(libro) {
  const [preferenceId, setPreferenceId] = useState(null) // State to store the preference ID
  useEffect(() => {
    // Fetch preferenceId only when `libro` changes
    const fetchPreferenceId = async () => {
      if (libro) {
        try {
          const url = 'http://localhost:3030/api/transactions/getBookPreferenceId'

          // Prepare the payload
          const body = {
            ...libro,
            title: libro.titulo,
            price: libro.oferta !== null ? libro.oferta : libro.precio
          }

          // Make the API call
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body),
            credentials: 'include' // Include credentials if necessary
          })

          // Parse the response JSON
          if (response.ok) {
            const data = await response.json()
            setPreferenceId(data.id) // Assuming response includes `preferenceId`
          } else {
            console.error('Error fetching preference ID:', response.statusText)
          }
        } catch (error) {
          console.error('Error fetching preference ID:', error)
        }
      }
    }

    fetchPreferenceId()
  }, [libro]) // Dependency array ensures this runs when `libro` changes
  return [preferenceId, setPreferenceId] // Return the fetched preference ID
}