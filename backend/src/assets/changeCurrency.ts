// Reusable function to convert between any two currencies
async function convertCurrency (amount: number, fromCurrency: string, toCurrency: string): Promise<number | string> {
  amount = Math.abs(amount)
  const host = 'https://api.frankfurter.app'

  // Check for valid input
  if (fromCurrency === toCurrency) {
    throw new Error('Source and target currencies must be different.')
  }

  try {
    // Fetch the conversion rate from the API
    const response = await fetch(`${host}/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`)
    const data = await response.json() 

    // Extract and return the converted value
    const convertedValue = data.rates[toCurrency]
    return convertedValue || 'Conversion rate not available'
  } catch (error) {
    throw new Error('Failed to convert currency. Please try again later.')
  }
}

export { convertCurrency }
