import { ToastContainer } from "react-toastify";
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function ColeccionesPage() {
    return (<>
    <Header/>
    <div className="coleccionesContainer">
        
    </div>
    <Footer />
    <SideInfo />
    <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} pauseOnHover={false} closeOnClick theme="light"/>
    </>)
}