/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import ChartBalanceData from './balanceAssets/chartBalanceData'
import TransactionHistorial from './transactionHistorial'
import axios from 'axios'
import Breadcrumb from '../../../assets/breadCrumb.jsx'
import useFetchTransactions from '../../../assets/useFetchTransactions.js'
import Cobrar from './cobrar.jsx'
// import Ingresar from './ingresar.jsx'
/* eslint-disable no-unused-vars */
export default function Balance ({ user, setUser }) {
  const [cobrar, setCobrar] = useState(false)
  // const [ingresar, setIngresar] = useState(false)
  const [transactions, setTransactions] = useFetchTransactions({ user})
  


  useEffect(() => {
    async function fetchBalance () {
      if (!user.id) return
      try {
        const url = 'http://localhost:3030/api/users/balance/' + user.id
        const response = await axios.get(url, { withCredentials: true })
        if (response.data) {
          setUser({ ...user, balance: {
            disponible: response.data.balance.disponible, // prueba
            pendiente: response.data.balance.pendiente,
            porLlegar: response.data.balance.porLlegar
          } })
        }
      } catch (error) {
        console.error('Error en la llamada del balance')
      }
    }
    fetchBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const balanceSum = () => {
    const values = Object.values(user.balance)
    return values.reduce((acc, value) => {
      if (typeof value === 'number') {
        return acc + value
      }
      return acc
    }, 0)
  }
  const [pathsArr] = useState(window.location.pathname.split('/'))
  return (
    <>
    <Breadcrumb pathsArr={pathsArr} />
      <div className='flexBalance'>
        <div className='container balanceContainer'>
          <h1>Balance</h1>
          <div className='bigNumber'>
            ${balanceSum()}
          </div>
          <div className='numbers'>
            <div>
              <h2>Disponible:</h2>
              <h3>${user?.balance?.disponible || 0}</h3>
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
                Retirar
              </button>}
              {/* <button onClick={() => setIngresar(!ingresar)}>Ingresar</button> */}
            </div>
            
          </div>

        </div>
        <div className='container graphContainer'>
          <ChartBalanceData transactions={transactions} user={user}/>
        </div>
      </div>
      {cobrar && <Cobrar user={user} setCobrar={setCobrar} setUser={setUser}/>}
      {/* {ingresar && <Ingresar user={user} setUser={setUser}/>} */}
      <TransactionHistorial transactions={transactions} user={user}/>
    </>
  )
}
