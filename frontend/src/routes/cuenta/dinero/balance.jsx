/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import ChartBalanceData from './balanceAssets/chartBalanceData'
import TransactionHistorial from './transactionHistorial'
import axios from 'axios'
import Breadcrumb from '../../../assets/breadCrumb.jsx'
/* eslint-disable no-unused-vars */
export default function Balance ({ user, setUser }) {
  const [cobrar, setCobrar] = useState(false)
  const [ingresar, setIngresar] = useState(false)
  const [transactions, setTransactions] = useState([])
  useEffect(()=>{
    async function fetchTransactions (userId) {
      const response = await axios.get(`http://localhost:3030/api/transactions/transactionByUser/${userId}`)
      setTransactions(response.data)
    }
    fetchTransactions(user._id)
  },[user])


  useEffect(() => {
    async function fetchBalance () {
      if (!user._id) return
      try {
        const url = 'http://localhost:3030/api/users/balance/' + user._id
        const response = await axios.get(url, { withCredentials: true })
        if (response.data) {
          setUser({ ...user, balance: response.data.balance })
        }
      } catch (error) {
        console.error('Error en la llamada del balance')
      }
    }
    fetchBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const balanceSum = Object.values(user?.balance || {}).reduce((a, b) => a + b, 0)
  const [pathsArr] = useState(window.location.pathname.split('/'))
  return (
    <>
    <Breadcrumb pathsArr={pathsArr} />
      <div className='flexBalance'>
        <div className='container balanceContainer'>
          <h1>Balance</h1>
          <div className='bigNumber'>
            ${balanceSum}
          </div>
          <div className='numbers'>
            <div>
              <h2>Puedo cobrar:</h2>
              <h3 style={{ fontWeight: '800' }}>${user?.balance?.disponible || 0}</h3>
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
            {user.balance.disponible > 0 &&
              <button onClick={() => setCobrar(!cobrar)}>
                Cobrar
              </button>}
              <button onClick={() => setIngresar(!ingresar)}>Ingresar</button>
            </div>
            
          </div>

        </div>
        <div className='container graphContainer'>
          <ChartBalanceData transactions={transactions} user={user}/>
        </div>
      </div>
      {cobrar &&
        <div className='cobrarContainer'>
          <h1>Cobrar</h1>
          <p>Bla bla bla</p>
        </div>}
      {ingresar &&
      <div>Hola</div>
      }
      <TransactionHistorial transactions={transactions} user={user}/>
    </>
  )
}
