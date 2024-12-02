/* eslint-disable react/prop-types */

export default function HeaderCuenta({ options }) {

    return(<>
      {/* Sidebar */}

      <aside className="sidebar">
        <div className="team-info">
          <h2>Meridian</h2>
          <p>meridian@gmail.com</p>
        </div>
        <div className="menu">

          {options.map((option, index)=> (
              <a href={option.href} key={index}>
                <div className={`headerOption ${window.location.pathname === option.href ? 'active': ''}`}>
                  {option.title}
                </div>
              </a>
          ))}
        </div>

        <div className="org-settings">
          <h3>ORGANIZATION</h3>
          <ul>
            <li>Apps & Perks</li>
            <li>Tax Forms</li>
            <li>Organization Settings</li>
          </ul>
        </div>
        <button className="create-contract">Create Contract +</button>
      </aside>
    </>)
}