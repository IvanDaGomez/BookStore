// Esta función sirve pero no he hecho el backend
// eslint-disable-next-line no-unused-vars
async function ggetData ({ Xaxis }) {
  // Determinar el tipo basado en el eje seleccionado
  let type
  if (Xaxis.length === 7) type = 'semanal' // 7 días de la semana
  else if (Xaxis.length === 12) type = 'mensual' // 12 meses del año
  else type = 'anual' // Lista de años

  try {
    // Llamada al backend
    const response = await fetch(`/api/data?type=${type}`)
    if (!response.ok) {
      throw new Error(`Error al obtener datos: ${response.statusText}`)
    }

    // Parsear los datos recibidos
    const result = await response.json()

    // Formatear los datos para Chart.js
    return {
      labels: Xaxis, // Eje X (días, meses o años)
      datasets: [
        {
          label: 'Mi Dataset',
          data: result.values, // Asegúrate de que el backend envíe los datos en un formato adecuado
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }
      ]
    }
  } catch (error) {
    console.error('Error al obtener los datos:', error)
    return null // Maneja el error devolviendo un valor por defecto
  }
}

// Simular datos

export async function getData ({ Xaxis }) {
  let type
  if (Xaxis.length === 7) type = 'semanal'
  else if (Xaxis.length === 12) type = 'mensual'
  else type = 'anual'

  // Simular datos

  const simulatedValues = Xaxis.map(() => Math.floor(Math.random() * 1000000))

  return {
    labels: Xaxis,
    datasets: [
      {
        label: `Datos ${type}`,
        data: simulatedValues,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      }
    ]
  }
}
