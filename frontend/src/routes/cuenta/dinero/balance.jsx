/* eslint-disable react/prop-types */
import TransactionHistorial from "./transactionHistorial";

/* eslint-disable no-unused-vars */
export default function Balance({ user }) {

    async function fetchTransactions(userId) {
        const response = await fetch(`http://localhost:3030/transactions/${userId}`);
        if (!response.ok) {
          throw new Error('Error al cargar el historial de transacciones');
        }
        return response.json();
      }
    // Fetch balance in server
    return (<>
    <h1>Balance</h1>
    <div className="container balanceContainer">
        <div className="numbers">
            <div  >
                <h2>Puedo cobrar:</h2>
                <h3 style={{color: 'var(--using4)'}}>$20000</h3>
            </div>
            <div>
                <h2>Pendiente:</h2>
                <h3>$0</h3>
            </div>
        </div>
        <button>
            Cobrar
        </button>
    </div>
    <h1>Historial de transacciones</h1>
    <TransactionHistorial user={user} />
    </>)
}