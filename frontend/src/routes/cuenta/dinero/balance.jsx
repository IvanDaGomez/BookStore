/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import ChartBalanceData from "./balanceAssets/chartBalanceData";
import TransactionHistorial from "./transactionHistorial";
import axios from 'axios'
/* eslint-disable no-unused-vars */
export default function Balance({ user, setUser }) {
    const [cobrar, setCobrar] = useState(false)
    async function fetchTransactions(userId) {
        const response = await fetch(`http://localhost:3030/transactions/${userId}`);
        if (!response.ok) {
          throw new Error('Error al cargar el historial de transacciones');
        }
        return response.json();
      }
    // Fetch balance in server

    useEffect(()=> {
        async function fetchBalance() {
            if (!user._id) return
            try {
                

            const url = 'http://localhost:3030/api/users/balance/' + user._id
            const response = await axios.get(url, { withCredentials: true })
            if (response.data) {
                setUser({...user, balance: response.data.balance})
            }
            } catch (error) {
                console.error('Error en la llamada del balance')   
            }
        }
        fetchBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    return (<>
    <div className="flexBalance">
        <div className="container balanceContainer">
            <h1>Balance</h1>
            <div className="bigNumber">
                ${Object.values(user?.balance|| {}).reduce((a, b) => a + b, 0)}
            </div>
            <div className="numbers">
                <div>
                    <h2>Puedo cobrar:</h2>
                    <h3 style={{fontWeight: '800'}}>${user?.balance?.disponible || 0}</h3>
                </div>
                <div>
                    <h2>Pendiente:</h2>
                    <h3>${user?.balance?.pendiente || 0}</h3>
                </div>
                <div>
                    <h2>Por llegar:</h2>
                    <h3>${user?.balance?.porLlegar || 0}</h3>
                </div>
                <div>
                <button onClick={() => setCobrar(!cobrar)}>
                Cobrar
                </button>
                </div>
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