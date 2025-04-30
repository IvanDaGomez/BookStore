/* eslint-disable react/prop-types */
import titleCase from '../../../assets/toTitleCase'
import { formatPrice } from '../../../assets/formatPrice'

export default function TransactionHistorial ({ transactions, user }) {
  // Sample transaction history data
  const header = [
    'id',
    'fecha',
    'monto',
    'tipo',
    'estado',
    'descripcion'
  ]
  const transactionKeyInfo = (transaction) => {
    let tipo 
    if (transaction.sellerId === user._id) {
      tipo = 'Venta'
    }
    else if (transaction.userId === user._id) {
      tipo = 'Compra'
    }
    const parsedAmount = parseInt(transaction.response.transaction_amount, 10)
    // Translate status to Spanish
    if (transaction.status === 'pending') {
      transaction.status = 'Pendiente'
    }
    else if (transaction.status === 'approved') {
      transaction.status = 'Aprobada'
    }
    else if (transaction.status === 'rejected') {
      transaction.status = 'Rechazada'
    }
    else if (transaction.status === 'in_process') {
      transaction.status = 'En proceso'
    }
    else if (transaction.status === 'refunded') {
      transaction.status = 'Reembolsada'
    }
    else if (transaction.status === 'cancelled') {
      transaction.status = 'Cancelada'
    }
    const transactionDate = new Date(transaction.response.date_created.split('T')[0]).toISOString().split('T')[0]
    return [transaction._id, 
      transactionDate, 
      formatPrice(parsedAmount), 
      tipo,
      transaction.status, 
      transaction.response.description]
  }
  return (
    <>
      <h1>Historial de transacciones</h1>
      <div className='balanceTransactionHistorialContainer'>
        {transactions.length === 0
          ? (
            <p>No hay transacciones disponibles.</p>
            )
          : (<>
            <div className='balanceTransactionHeader'>
              {header.map((header, index) => (
                <div key={index}>
                  {titleCase(header)}
                </div>
              ))}
            </div>
            <div className='balanceTransactionHistorial'>
              
            {transactions.map((transaction) => (
                  <div className='transactionLine' key={transaction._id}>
                  {transactionKeyInfo(transaction).map((value, index) => (
                    <div key={index}>
                      {value}
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
