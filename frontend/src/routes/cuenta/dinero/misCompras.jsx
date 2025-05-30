/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import Breadcrumb from "../../../assets/breadCrumb.jsx"
import useFetchTransactions from "../../../assets/useFetchTransactions.js"

import axios from "axios"
import { BACKEND_URL } from "../../../assets/config.js"

export default function MisCompras ({ user }) {
  
  const [transactions,] = useFetchTransactions({ user })
  const [compras, setCompras] = useState([])
  useEffect(() => {
    if (!transactions) return
    const filteredCompras = transactions.filter(transaction => transaction.user_id === user.id)
    setCompras(filteredCompras)
  },[transactions, user])
  const [libros, setLibros] = useState([])
  useEffect(() => {
    async function fetchLibro() {
      if (compras.length === 0) return
      const librosIds = compras.map(compra => compra.book_id)
      const urlLibros = `${BACKEND_URL}/api/books/idList/${librosIds.join(',')}`
      const response = await axios.get(urlLibros, null, { withCredentials: true })
      setLibros(response.data)
    }
    fetchLibro()
  },[compras])
  return (
    <>
    <Breadcrumb pathsArr={window.location.pathname.split('/')} />
    <div className='mis-compras container'>
      <h1>Mis Compras</h1>
      <p>Aquí puedes revisar los libros que has adquirido.</p>

      {libros.length === 0
        ? (
          <p>No tienes compras registradas.</p>
          )
        : (
          <table className='compras-table'>
            <thead>
              <tr>
                <th>Título</th>
                <th>Autor</th>
                <th>Fecha de Compra</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {libros.map((libro, index) => (
                <tr key={libro.id}>
                  <td>{libro.titulo}</td>
                  <td>{libro.autor}</td>
                  <td>{new Date(transactions[index].response.date_created.split('T')[0]).toLocaleDateString()}</td>
                  <td>${libro.precio}</td>
                  <td>{transactions[index].status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
    </div>
    </>
  )
}
