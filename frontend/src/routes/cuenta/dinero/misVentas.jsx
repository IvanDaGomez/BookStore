import Breadcrumb from "../../../assets/breadCrumb.jsx"

export default function MisVentas ({ user }) {
  const compras = [
    {
      id: 1,
      titulo: 'El señor de los anillos',
      autor: 'J.R.R. Tolkien',
      fecha_compra: '2024-01-10',
      precio: 40000,
      estado: 'Entregado'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      fecha_compra: '2024-02-15',
      precio: 40000,
      estado: 'En proceso'
    },
    {
      id: 3,
      titulo: 'Cien años de soledad',
      autor: 'Gabriel García Márquez',
      fecha_compra: '2024-03-05',
      precio: 40000,
      estado: 'Entregado'
    }
  ]

  return (
    <>
    <Breadcrumb pathsArr={window.location.pathname.split('/')} />
    <div className='mis-compras container'>
      <h1>Mis Ventas</h1>
      <p>Aquí puedes revisar los libros que has vendido.</p>

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
                  <td>{new Date(compra.fecha_compra).toLocaleDateString()}</td>
                  <td>${compra.precio}</td>
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
