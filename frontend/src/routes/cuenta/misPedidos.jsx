export default function MisPedidos ({ user }) {
  const compras = [
    {
      id: 1,
      titulo: 'El señor de los anillos',
      autor: 'J.R.R. Tolkien',
      fechaCompra: '2024-01-10',
      precio: 40000,
      estado: 'Entregado'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      fechaCompra: '2024-02-15',
      precio: 40000,
      estado: 'En proceso'
    },
    {
      id: 3,
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      fechaCompra: '2024-03-05',
      precio: 40000,
      estado: 'Entregado'
    }
  ]

  return (
    <div className='mis-compras container'>
      <h1>Mis Pedidos</h1>
      <p>Aquí puedes revisar los pedidos que has hecho.</p>

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
                  <td>${compra.precio}</td>
                  <td>{compra.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
    </div>
  )
}
