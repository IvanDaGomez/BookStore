/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { handleFavoritos } from "../handleFavoritos";
import { Link } from "react-router-dom";

export default function RenderBottomText({ element, user, callback }) {
  const necesitasIniciarSesion = (
    <div>
      Necesitas iniciar sesión{" "}
      <Link to="/login" style={{ textDecoration: "underline", color: "var(--using4)" }}>
        aquí
      </Link>
    </div>
  );

  // Helper function to handle user authentication check
  const handleAuthCheck = (event, action) => {
    event.preventDefault();
    if (!user || Object.keys(user).length === 0) {
      toast.error(necesitasIniciarSesion);
      callback();
      return false;
    }
    action();
    callback();
    return true;
  };

  // Render the "Comprar" button
  const renderComprarButton = () => (
    <div
      className="fastInfoElement"
      onClick={(e) =>
        handleAuthCheck(e, () => {
          window.location.href = `/checkout/${element.id}`;
        })
      }
    >
      <span>Comprar</span>
    </div>
  );

  // Render the "Mensajes" icon
  const renderMensajesIcon = () => (
    <svg
      onClick={() =>// window.location.href = `/libros/${element.id}#comments`
          window.location.href = `/mensajes?n=${element.idVendedor}&q=${element.id}`
          }
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={20}
      height={20}
      color="#000000"
      fill="none"
    ><path d="M8.5 14.5H15.5M8.5 9.5H12"stroke="currentColor"strokeWidth="1"strokeLinecap="round"strokeLinejoin="round"/><path d="M14.1706 20.8905C18.3536 20.6125 21.6856 17.2332 21.9598 12.9909C22.0134 12.1607 22.0134 11.3009 21.9598 10.4707C21.6856 6.22838 18.3536 2.84913 14.1706 2.57107C12.7435 2.47621 11.2536 2.47641 9.8294 2.57107C5.64639 2.84913 2.31441 6.22838 2.04024 10.4707C1.98659 11.3009 1.98659 12.1607 2.04024 12.9909C2.1401 14.536 2.82343 15.9666 3.62791 17.1746C4.09501 18.0203 3.78674 19.0758 3.30021 19.9978C2.94941 20.6626 2.77401 20.995 2.91484 21.2351C3.05568 21.4752 3.37026 21.4829 3.99943 21.4982C5.24367 21.5285 6.08268 21.1757 6.74868 20.6846C7.1264 20.4061 7.31527 20.2668 7.44544 20.2508C7.5756 20.2348 7.83177 20.3403 8.34401 20.5513C8.8044 20.7409 9.33896 20.8579 9.8294 20.8905C11.2536 20.9852 12.7435 20.9854 14.1706 20.8905Z"stroke="currentColor"strokeWidth="1"strokeLinejoin="round"/></svg>
  );

  // Render the "Favoritos" icon
  const renderFavoritosIcon = () => (
    <svg
      onClick={(event) =>
        handleAuthCheck(event, () => {
          user ?
            handleFavoritos(event, element.id, user.id)
          : handleFavoritos(event, element.id);
        })
      }
      className={`favoritos favorito-${element.id}`} xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"width={20}height={20}color="#fff">
      <path d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.221721 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"stroke="currentColor"strokeWidth="1"strokeLinecap="round"/></svg>
  );

  return (
    <>
      {element.disponibilidad !== "Vendido" ? (
        <div className="extraInfoElement">
          {renderFavoritosIcon()}
          {renderComprarButton()}
          {renderMensajesIcon()}
        </div>
      ) : (
        <div style={{ height: "30px" }} />
      )}
    </>
  );
}