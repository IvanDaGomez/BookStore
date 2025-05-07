/* eslint-disable react/prop-types */
import { Link } from "react-router-dom"
import logout from "../../assets/logout"
import { useState } from "react"

export default function HamburgerMenuOptions ({ profile, setProfile, user, color, profileContainer}) {
  const [values] = useState([
    {
      name: 'Mi cuenta',
      href: '/cuenta',
      svg: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color={color} fill='none'><path d='M6.57757 15.4816C5.1628 16.324 1.45336 18.0441 3.71266 20.1966C4.81631 21.248 6.04549 22 7.59087 22H16.4091C17.9545 22 19.1837 21.248 20.2873 20.1966C22.5466 18.0441 18.8372 16.324 17.4224 15.4816C14.1048 13.5061 9.89519 13.5061 6.57757 15.4816Z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M16.5 6.5C16.5 8.98528 14.4853 11 12 11C9.51472 11 7.5 8.98528 7.5 6.5C7.5 4.01472 9.51472 2 12 2C14.4853 2 16.5 4.01472 16.5 6.5Z' stroke='currentColor' strokeWidth='1.5' /></svg>
    }, 
    {
      name: 'Publica tu libro',
      href: '/libros/crear',
      svg: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color={color} fill='none'><path d='M20.5 16.9286V10C20.5 6.22876 20.5 4.34315 19.3284 3.17157C18.1569 2 16.2712 2 12.5 2H11.5C7.72876 2 5.84315 2 4.67157 3.17157C3.5 4.34315 3.5 6.22876 3.5 10V19.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M9 8.67347L10.409 7.18691C11.159 6.39564 11.534 6 12 6C12.466 6 12.841 6.39564 13.591 7.18692L15 8.67347M12 6.08723L12 13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M20.5 17H6C4.61929 17 3.5 18.1193 3.5 19.5C3.5 20.8807 4.61929 22 6 22H20.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M20.5 17C19.1193 17 18 18.1193 18 19.5C18 20.8807 19.1193 22 20.5 22' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
    },
    {
      name: 'Mis libros',
      href: `/usuarios/${user?.id ?? ''}`,
      svg: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color={color} fill='none'><path d='M20.5 16.9286V10C20.5 6.22876 20.5 4.34315 19.3284 3.17157C18.1569 2 16.2712 2 12.5 2H11.5C7.72876 2 5.84315 2 4.67157 3.17157C3.5 4.34315 3.5 6.22876 3.5 10V19.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M20.5 17H6C4.61929 17 3.5 18.1193 3.5 19.5C3.5 20.8807 4.61929 22 6 22H20.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M20.5 22C19.1193 22 18 20.8807 18 19.5C18 18.1193 19.1193 17 20.5 17' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M15 7L9 7' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M12 11L9 11' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
    },
    {
      name: 'Mis mensajes',
      href: '/mensajes',
      svg: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color={color} fill='none'><path d='M8.5 14.5H15.5M8.5 9.5H12' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /><path d='M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' /></svg>
    }, 
    {
      name: 'Cerrar sesión',
      svg: <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color='#000000' fill='none'><path d='M11 3L10.3374 3.23384C7.75867 4.144 6.46928 4.59908 5.73464 5.63742C5 6.67576 5 8.0431 5 10.7778V13.2222C5 15.9569 5 17.3242 5.73464 18.3626C6.46928 19.4009 7.75867 19.856 10.3374 20.7662L11 21' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M21 12L11 12M21 12C21 11.2998 19.0057 9.99153 18.5 9.5M21 12C21 12.7002 19.0057 14.0085 18.5 14.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>,
      callback: () => logout()
    }
  ])
  return (
    <>{profile && <>
    <div className='profileContainer' onMouseLeave={() => { setProfile(!profile) }} ref={profileContainer}>
      {(!user)
        ? <>
          <Link to='/login'>
            <div className='profileElement'>
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={20} height={20} color={color} fill='none'><path d='M10 3L9.33744 3.23384C6.75867 4.144 5.46928 4.59908 4.73464 5.63742C4 6.67576 4 8.0431 4 10.7778V13.2222C4 15.9569 4 17.3242 4.73464 18.3626C5.46928 19.4009 6.75867 19.856 9.33744 20.7662L10 21' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /><path d='M10 12L20 12M10 12C10 11.2998 11.9943 9.99153 12.5 9.5M10 12C10 12.7002 11.9943 14.0085 12.5 14.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' /></svg>
              <span>Inicio de sesión</span>
            </div>
          </Link>
        </>
        : values.map((values, index) => (
          <Link to={values.href ?? null} key={index} onClick={values.callback ?? null}>
            <div className='profileElement'>
              {values.svg}
              <span>{values.name}</span>
            </div>
          </Link>
        ))
        }
    </div>
              </>}</>)
}