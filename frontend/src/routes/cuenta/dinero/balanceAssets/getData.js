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
  const today = new Date();

  // Helper function to format the date into YYYY-MM-DD format
  const formatDate = (date) => new Date(date).toISOString().split('T')[0];
  
  const plotBuyTransactions = Xaxis.map((_, index) => {
    const date = new Date(today);
  
    if (Xaxis.length === 7) {
      // Adjust to the correct date if plotting for a week
      date.setDate(today.getDate() - (today.getDay() - index));
    } else if (Xaxis.length === 12) {
      // Adjust to the correct month, ensure it doesn't go past January or December
      date.setMonth(today.getMonth() - index);
    }
  
    const formattedDate = formatDate(date);

    // Filter transactions for the current user and date
    const filteredTransactions = transactions.filter(transaction => 
      transaction.userId === user._id &&
      formatDate(transaction.response.date_created) === formattedDate
    );
    console.log('filteredTransactions', filteredTransactions)
    // Sum the transaction amounts 
    return filteredTransactions.reduce((total, transaction) => total + transaction.response.transaction_amount, 0);
  }).reverse();
  
  const plotSellTransactions = Xaxis.map((_, index) => {
    const date = new Date(today);
  
    if (Xaxis.length === 7) {
      // Adjust to the correct date if plotting for a week
      date.setDate(today.getDate() - (today.getDay() - index));
    } else if (Xaxis.length === 12) {
      // Adjust to the correct month, ensure it doesn't go past January or December
      date.setMonth(today.getMonth() - index);
    }
  
    const formattedDate = formatDate(date);
  
    // Filter transactions for the current seller and date
    const filteredTransactions = transactions.filter(transaction => 
      transaction.sellerId === user._id &&
      formatDate(new Date(transaction.response.date_created)) === formattedDate
    );
  
    // Sum the transaction amounts
    return filteredTransactions.reduce((total, transaction) => total + transaction.response.transaction_amount, 0);
  }).reverse();
  
  
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
