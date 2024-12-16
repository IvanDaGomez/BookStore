import titleCase from '../../../assets/toTitleCase'

export default function TransactionHistorial () {
  // Sample transaction history data
  const transactionHistorial = [
    {
      ID: 'txn_001',
      fecha: '2024-12-01',
      cantidad: 150.00,
      estado: 'Completed',
      descripcion: 'Purchased "Harry Potter and the Chamber of Secrets"'
    },
    {
      ID: 'txn_001',
      fecha: '2024-12-01',
      cantidad: 150.00,
      estado: 'Completed',
      descripcion: 'Purchased "Harry Potter and the Chamber of Secrets"'
    }
  ]

  return (
    <>
      <h1>Historial de transacciones</h1>
      <div className='balanceTransactionHistorialContainer'>
        {transactionHistorial.length === 0
          ? (
            <p>No hay transacciones disponibles.</p>
            )
          : (<>
            <div className='balanceTransactionHeader'>
              {Object.keys(transactionHistorial[0]).map((header, index) => (
                <div key={index}>
                  {titleCase(header)}
                </div>
              ))}
            </div>
            <div className='balanceTransactionHistorial'>
              {transactionHistorial.map((transaction) => (

                <div className='transactionLine' key={transaction.id}>
                  {Object.keys(transaction).map((key, index) => (
                    <div key={index}>
                      {transaction[key]}
                    </div>
                  ))}
                </div>
              ))}
            </div>
             </>)}
      </div>
    </>
  )
}
