/* eslint-disable react-hooks/exhaustive-deps */
import { ToastContainer } from "react-toastify";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Perfil from "./perfil";
import HeaderCuenta from "./headerCuenta";
import Verificar from "./verificar";
import Balance from "./balance";
import axios from "axios";
import Stats from "./stats";
import TransactionHistorial from "./transactionHistorial";
import MisPedidos from "./misPedidos";

export default function Cuenta(){
    const navigate = useNavigate()
    const [actualOption, setActualOption] = useState('Mi perfil')
    const [user, setUser] = useState(null)

    useEffect(() => {
      async function fetchUser() {
          try {
              const url = 'http://localhost:3030/api/users/userSession'
              const response = await axios.post(url, null, {
                  withCredentials: true
              })
              setUser(response.data.user);
          } catch (error) {
              console.error('Error fetching user data:', error);
              navigate('/popUp/noUser')
          }
      };
      fetchUser();

  }, []);
  useEffect(() => {
    if (!user || user?.correo) return;
    async function fetchUserEmail() {
        try {
            const response = await fetch(`http://localhost:3030/api/users/c/${user._id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setUser({
                  ...user,
                  correo: data.correo
                });
                
            }
        } catch (error) {
            console.error('Error fetching user email:', error);
        }
    }

    fetchUserEmail();
}, [user]);
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
    title: 'Mis favoritos',
    href: '/favoritos'
  },{
    title: 'Mis libros',
    href:'/libros'
  },{
    title: 'Estadísticas',
    href:'/cuenta/stats'
  },{
    title: 'Historial de transacciones',
    href: '/cuenta/historialTransacciones'
  },{
    title: 'Mis pedidos',
    href: '/cuenta/pedidos'
  },{
    title: 'Mis compras',
    href: '/cuenta/mis-compras'
  },{
    title: 'Mis ventas',
    href: '/cuenta/mis-ventas'
  }]
  useEffect(()=>{
      setActualOption(headerOptions.find(option => window.location.pathname === option.href))
  },[])
    return(<>
    <Header/>
    <div className="account-dashboard">
      <HeaderCuenta options={headerOptions}/>

      {/* Main Content */}

      <main className="main-content">
        {user && <>
          {actualOption.title === 'Mi perfil' ?
          <Perfil user={user} navigate={navigate}/>:
          actualOption.title === 'Mi balance' ?
          <Balance user={user}/>:
          actualOption.title == 'Verificar'?
          <Verificar verified={user.validated || false}/>:
          actualOption.title === 'Estadísticas' ?
          <Stats user={user}/>:
          actualOption.title === 'Historial de transacciones' ?
          <TransactionHistorial />:
          actualOption.title === 'Mis pedidos' ?
          <MisPedidos user={user} />:
          <Perfil user={user}/>}
        </>
        }
      </main>
    </div>
    <Footer/>
    <SideInfo/>
    <ToastContainer />
    </>)
}