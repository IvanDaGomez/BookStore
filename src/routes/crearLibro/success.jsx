import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function SuccessCreatingBook(){
    return(<>
    <Header/>
    <div className="success-container">
            <h2>¡Publicación enviada con éxito!</h2>
            <p>Tu publicación será revisada para su lanzamiento.</p>
            <button className="back-button" onClick={() => window.location.reload()}>
                Volver
            </button>
        </div>
    <Footer/>
    <SideInfo/>
    </>)
}