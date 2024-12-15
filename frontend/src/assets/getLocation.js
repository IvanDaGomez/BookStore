import axios from 'axios'
const getLocation = async () => {
  // Verifica si la API de Geolocalización está disponible
  if (!navigator.geolocation) {
    console.log('Geolocalización no es soportada por este navegador.')
    return null // Devuelve null si no hay soporte
  }

  // Devuelve una nueva promesa
  return new Promise((resolve, reject) => {
    // Solicita la ubicación del usuario
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        // Llamada a la API de Geocodificación Inversa
        try {
          const locationData = await getLocationFromCoordinates(latitude, longitude)
          resolve(locationData) // Resuelve la promesa con los datos de ubicación
        } catch (error) {
          reject(error) // Rechaza la promesa en caso de error
        }
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`)
        reject(err) // Rechaza la promesa si hay un error en la obtención de la ubicación
      }
    )
  })
}

// Función para la geocodificación inversa
async function getLocationFromCoordinates (lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`

  try {
    const response = await axios.get(url)
    const data = response.data

    // Acceder a la información de la ubicación
    const pais = data.address.country
    const ciudad = data.address.city || data.address.town || data.address.village // Dependiendo de lo que devuelva
    const departamento = data.address.state || data.address.region // Puede que retorne 'region' en algunos casos

    return { pais, ciudad, departamento } // Retorna el objeto con los datos de ubicación
  } catch (error) {
    console.error('Error al obtener la ubicación:', error)
    throw error // Lanza el error para ser manejado en la función llamadora
  }
}

export default getLocation
