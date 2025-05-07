import axios from "axios"
import { useEffect, useState } from "react"

export default function useFetchTransactions ({ user }) {
  const [transactions, setTransactions] = useState([])
  useEffect(()=>{
    if (!user) return
      async function fetchTransactions (userId) {
        const response = await axios.get(`http://localhost:3030/api/transactions/transactionByUser/${userId}`)
        const sortedTransactions = response.data.sort((a, b) => new Date(b.response.date_created.split('T')[0]) - new Date(a.response.date_created.split('T')[0]))
        setTransactions(sortedTransactions)
      }
      fetchTransactions(user.id)
    },[user])
  return [transactions, setTransactions]
}