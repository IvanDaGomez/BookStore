import Breadcrumb from "../../../assets/breadCrumb.jsx"

export default function MisCompras ({ user }) {
  const compras = [
    {
      id: 1,
      titulo: 'El señor de los anillos',
      autor: 'J.R.R. Tolkien',
      fechaCompra: '2024-01-10',
      precio: 19.99,
      estado: 'Entregado'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      fechaCompra: '2024-02-15',
      precio: 14.99,
      estado: 'En proceso'
    },
    {
      id: 3,
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      fechaCompra: '2024-03-05',
      precio: 24.99,
      estado: 'Entregado'
    }
  ]

  return (
    <>
    <Breadcrumb pathsArr={window.location.pathname.split('/')} />
    <div className='mis-compras container'>
      <h1>Mis Compras</h1>
      <p>Aquí puedes revisar los libros que has adquirido.</p>

      {compras.length === 0
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
              {compras.map((compra) => (
                <tr key={compra.id}>
                  <td>{compra.titulo}</td>
                  <td>{compra.autor}</td>
                  <td>{new Date(compra.fechaCompra).toLocaleDateString()}</td>
                  <td>${compra.precio.toFixed(2)}</td>
                  <td>{compra.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
    </div>
    </>
  )
}
