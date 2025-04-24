import { ToastContainer } from 'react-toastify'
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import Perfil from './perfil'
import HeaderCuenta from './headerCuenta'
import Balance from './dinero/balance'
import axios from 'axios'
import Stats from './stats'
import MisPedidos from './misPedidos'
import PreferenciasComprador from './preferencias/preferenciasComprador'
import PreferenciasVendedor from './preferencias/preferenciasVendedor'
import MisCompras from './dinero/misCompras'
import MisVentas from './dinero/misVentas'
import NotificacionesPreferencias from './preferencias/notificacionesPreferencias'
import Direcciones from './direcciones'

export default function Cuenta () {
  const navigate = useNavigate()
  const [actualOption, setActualOption] = useState(null)
  const [user, setUser] = useState(null)

  // Fetch user session
  useEffect(() => {
    async function fetchUser () {
      try {
        const url = 'http://localhost:3030/api/users/userSession'
        const response = await axios.post(url, null, {
          withCredentials: true
        })
        setUser(response.data.user)
      } catch (error) {
        console.error('Error fetching user data:', error)
        navigate('/popUp/noUser')
      }
    }
    fetchUser()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch user email if not already set
  useEffect(() => {
    if (!user || user?.correo) return

    async function fetchUserEmail () {
      try {
        const response = await axios.get(`http://localhost:3030/api/users/c/${user._id}`, {
          withCredentials: true // Ensures cookies are sent with the request
        })

        if (response.status === 200 && response.data) {
          setUser({
            ...user,
            correo: response.data.correo
          })
        }
      } catch (error) {
        console.error('Error fetching user email:', error)
      }
    }

    fetchUserEmail()
  }, [user])

  // Memoize headerOptions to prevent infinite loops

  const headerOptions = useMemo(() => [
    { title: 'Mi perfil', href: '/cuenta' },
    { title: 'Mi balance', href: '/cuenta/balance' },
    { title: 'Mis favoritos', href: '/favoritos/' + user?._id },
    { title: 'Mis libros', href: '/usuarios/' + user?._id },
    { title: 'Estadísticas', href: '/cuenta/stats' },
    { title: 'Notificaciones', href: '/cuenta/preferencias-notificaciones', includeInHeader: false },
    { title: 'Preferencias del comprador', href: '/cuenta/preferencias-comprador', includeInHeader: false },
    { title: 'Preferencias del vendedor', href: '/cuenta/preferencias-vendedor', includeInHeader: false, condition: user?.rol === 'vendedor' || user?.rol === 'admin' },
    { title: 'Mis pedidos', href: '/cuenta/pedidos' },
    { title: 'Mis compras', href: '/cuenta/mis-compras' },
    { title: 'Mis ventas', href: '/cuenta/mis-ventas', condition: user?.rol === 'vendedor' || user?.rol === 'admin' },
    { title: 'Direcciones', href: '/cuenta/direcciones', includeInHeader: false }
  ], [user?.rol, user?._id])

  // Filter header options
  const filteredHeaderOptions = useMemo(() =>
    headerOptions.filter(
      (option) =>
        option.includeInHeader !== false &&
        (option.condition === undefined || option.condition)
    ), [headerOptions]
  )

  // Update `actualOption` when path changes
  useEffect(() => {
    const currentOption = headerOptions.find((option) => window.location.pathname === option.href)
    setActualOption(currentOption || headerOptions[0])
  }, [headerOptions])

  // Render page content based on actualOption
  function renderPage () {
    if (!actualOption) return <Perfil user={user} />

    switch (actualOption.title) {
      case 'Mi perfil':
        return <Perfil user={user} navigate={navigate} />
      case 'Mi balance':
        return <Balance user={user} setUser={setUser} />

      case 'Estadísticas':
        return <Stats user={user} />
      case 'Preferencias del comprador':
        return <PreferenciasComprador user={user} />
      case 'Preferencias del vendedor':
        return <PreferenciasVendedor user={user} />
      case 'Mis pedidos':
        return <MisPedidos user={user} />
      case 'Mis compras':
        return <MisCompras user={user} />
      case 'Mis ventas':
        return <MisVentas user={user} />
      case 'Notificaciones':
        return <NotificacionesPreferencias user={user} />
      case 'Direcciones':
        return <Direcciones user={user} />
      default:
        return <Perfil user={user} />
    }
  }

  return (
    <>
      <Header />
      <div className='account-dashboard'>
        <HeaderCuenta options={filteredHeaderOptions} />
        <main className='main-content'>{user && renderPage()}</main>
      </div>
      {console.log(user)}
      <Footer />
      <SideInfo />
      <ToastContainer />
    </>
  )
}
