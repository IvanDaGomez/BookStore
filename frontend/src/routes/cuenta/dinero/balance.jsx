/* eslint-disable react/prop-types */
import { useState } from "react";
import ChartBalanceData from "./balanceAssets/chartBalanceData";
import TransactionHistorial from "./transactionHistorial";

/* eslint-disable no-unused-vars */
export default function Balance({ user }) {
    const [cobrar, setCobrar] = useState(false)
    async function fetchTransactions(userId) {
        const response = await fetch(`http://localhost:3030/transactions/${userId}`);
        if (!response.ok) {
          throw new Error('Error al cargar el historial de transacciones');
        }
        return response.json();
      }
    // Fetch balance in server
    return (<>
    <div className="flexBalance">
        <div className="container balanceContainer">
            <h1>Balance</h1>
            <div className="bigNumber">
                $30000
            </div>
            <div className="numbers">
                <div>
                    <h2>Puedo cobrar:</h2>
                    <h3 style={{fontWeight: '800'}}>$20000</h3>
                </div>
                <div>
                    <h2>Pendiente:</h2>
                    <h3>$10000</h3>
                </div>
                <button onClick={() => setCobrar(!cobrar)}>
                Cobrar
            </button>
            </div>
            
        </div>
        <div className="container graphContainer">
            <ChartBalanceData />
        </div>
    </div>
    {cobrar && 
    <div className="cobrarContainer">
        <h1>Cobrar</h1>
        <p>Bla bla bla</p>
    </div>
    }
    <TransactionHistorial user={user} />
    </>)
}