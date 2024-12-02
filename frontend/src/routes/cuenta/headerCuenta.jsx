import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
export default function HeaderCuenta({ actualOption, setActualOption}) {
    const headerOptions = [{
        title: 'Mi perfil',
        href:'/cuenta'
      },
      {
        title:'Mi balance',
        href:'/cuenta/balance'
      },
      {
        title: 'Verificar',
        href: '/cuenta/verificar'
      },{
        
      }]
    useEffect(()=>{
        setActualOption(headerOptions.find(option => window.location.pathname === option.href))
    },[window.location.href])
    return(<>
      {/* Sidebar */}

      <aside className="sidebar">
        <div className="team-info">
          <h2>Meridian</h2>
          <p>meridian@gmail.com</p>
        </div>
        <div className="menu">

          {headerOptions.map((option, index)=> (
            <>
              <a href={option.href} key={index}>
                <div className={`headerOption ${window.location.pathname === option.href ? 'active': ''}`}>
                  {option.title}
                </div>
              </a>
            </>
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