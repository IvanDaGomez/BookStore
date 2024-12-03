export default function TransactionHistorial() {
    // Sample transaction history data
    const transactionHistorial = [
        {
            id: 'txn_001',
            date: '2024-12-01',
            amount: 150.00,
            status: 'Completed',
            description: 'Purchased "Harry Potter and the Chamber of Secrets"',
        },
        {
            id: 'txn_002',
            date: '2024-12-02',
            amount: 45.00,
            status: 'Pending',
            description: 'Purchased "Introduction to React"',
        },
    ];

    return (
        <div className='container' style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
            <h1>Historial de Transacciones</h1>
            {transactionHistorial.length === 0 ? (
                <p>No hay transacciones disponibles.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Id usuario</th>
                            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Fecha</th>
                            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Monto</th>
                            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Estado</th>
                            <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactionHistorial.map((transaction) => (
                            <tr key={transaction.id}>
                                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                                    {transaction.id}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                                    {transaction.date}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                                    ${transaction.amount.toFixed(2)}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                                    {transaction.status}
                                </td>
                                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                                    {transaction.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
