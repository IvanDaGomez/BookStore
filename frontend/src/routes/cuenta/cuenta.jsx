import { ToastContainer } from "react-toastify";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HeaderCuenta from "./headerCuenta";
export default function Cuenta(){
        
    const [actualOption, setActualOption] = useState()

    return(<>
    <Header/>
    <div className="account-dashboard">
      <HeaderCuenta actualOption={actualOption} setActualOption={setActualOption}/>

      {/* Main Content */}
      <main className="main-content">
        {actualOption.title === 'Mi perfil' ?
        <Perfil/>:
        actualOption.title === 'Mi balance' ?
        <Balance/>:
        actualOption.title == 'Verificar'?
        <Verificar/>:
        <Perfil/>}
      </main>
    </div>
    <Footer/>
    <SideInfo/>
    <ToastContainer />
    </>)
}