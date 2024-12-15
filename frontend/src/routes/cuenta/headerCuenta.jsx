/* eslint-disable react/prop-types */

export default function HeaderCuenta ({ options }) {
  return (
    <>
      {/* Sidebar */}

      <aside className='sidebar'>

        <div className='menu'>

          {options.map((option, index) => (
            <a href={option.href} key={index}>
              <div className={`headerOption ${window.location.pathname === option.href ? 'active' : ''}`}>
                {option.title}
              </div>
            </a>
          ))}
        </div>

        <div className='team-info'>
          <h2>Meridian</h2>
          <p>meridian@gmail.com</p>

          <a href='/contacto'><button className='create-contract'>Contáctanos</button></a>
        </div>
      </aside>
    </>
  )
}
