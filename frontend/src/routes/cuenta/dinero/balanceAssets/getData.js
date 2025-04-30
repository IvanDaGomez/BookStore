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

export async function getData ({ Xaxis, transactions, user }) {

  // Simular datos
  const today = new Date()
  const plotBuyTransactions = Xaxis.map((_, index)=>{
    const date = new Date(today)
    date.setDate(today.getDate() - index - 1)
    transactions = transactions.filter(transaction => transaction.userId === user._id)
    return transactions.filter(transaction => transaction.response.date_created.split('T')[0] === date.toISOString().split('T')[0])
    .reduce((a, b) => a + b.response.transaction_amount, 0)
  }).reverse()
  const plotSellTransactions = Xaxis.map((_, index)=>{
    const date = new Date(today)
    date.setDate(today.getDate() - index - 1)
    transactions = transactions.filter(transaction => transaction.sellerId === user._id)
    return transactions.filter(transaction => transaction.response.date_created.split('T')[0] === date.toISOString().split('T')[0])
    .reduce((a, b) => a + b.response.transaction_amount, 0)
  }).reverse()
  return {
    labels: Xaxis,
    datasets: [
      {
        label: `Compras`,
        data: plotBuyTransactions,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)'
      },
      {
        label: `Ventas`,
        data: plotSellTransactions,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderDash: [5, 5] // Dashed line for sales
      }
    ]
  }
}
