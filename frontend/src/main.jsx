import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/main/App.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import ErrorPage from './components/errorPage/errorPage.jsx'
import Search from './routes/search/search.jsx'
import Login from './routes/login/login.jsx'
import CrearLibro from './routes/crearLibro/CrearLibro.jsx'
import Usuario from './routes/usuarios/Usuario.jsx'
import Mensajes from './routes/mensajes/mensajes.jsx'
import BookView from './routes/bookView/bookView.jsx'
import './index.css'
import EditarUsuario from './routes/usuarios/editarUsuario.jsx'
import Checkout from './routes/checkout/checkout.jsx'
import Notificaciones from './routes/mensajes/notificaciones.jsx'
import ProtectedReviewBook from './routes/protected/protectedReviewBook.jsx'
import TerminosYCondiciones from './routes/extraFooterInfo/terminos.jsx'
import SobreNosotros from './routes/extraFooterInfo/sobreNosotros.jsx'
import PoliticaPrivacidad from './routes/extraFooterInfo/politicaPrivacidad.jsx'
import AvisoPrivacidad from './routes/extraFooterInfo/avisoPrivacidad.jsx'
import Contacto from './routes/extraFooterInfo/contacto.jsx'
import PoliticaDatosPersonales from './routes/extraFooterInfo/politicaDatosPersonales.jsx'
import UsoDeCookies from './routes/extraFooterInfo/usoCookies.jsx'
import Cuenta from './routes/cuenta/cuenta.jsx'
import EnviarCorreoAVerificar from './routes/verificar/enviarCorreoAVerificar.jsx'
import EnviarCorreoCambiarContraseña from './routes/cambiarContraseña/enviarCorreoCambiarContraseña.jsx'
import CambiarContraseña from './routes/cambiarContraseña/cambiarContraseña.jsx'
import Faq from './routes/faq/faq.jsx'
import Fyp from './routes/forYouPage/fyp.jsx'
import { UserProvider } from './context/userContext.jsx'
import FypCollections from './routes/forYouPage/fypCollections.jsx'
import ColeccionEspecificoPage from './routes/colecciones/coleccionEspecifico.jsx'
import ProtectedStats from './routes/protected/protectedStats.jsx'
import ProtectedWithdraw from './routes/protected/protectedWithdraw.jsx'
import ListaCostes from './routes/extraFooterInfo/listaCostes.jsx'
import ProtectedBan from './routes/protected/protectedBan.jsx'
import ProtectedSeeEmailTemplate from './routes/protected/protectedSeeEmailTemplate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} errorElement={<ErrorPage />} />
          <Route path="libros/crear" element={<CrearLibro />} />
          <Route path="popUp/:info" element={<App />} />
          <Route path="libros/:bookId" element={<BookView />} />
          <Route path="/buscar" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios/:idVendedor" element={<Usuario />} />
          <Route path="/usuarios/editarUsuario" element={<EditarUsuario />} />
          <Route path="/checkout/:bookId" element={<Checkout />} />
          <Route path="/favoritos/:idVendedor" element={<Usuario />} />
          <Route path="/mensajes" element={<Mensajes />} />
          <Route path="/notificaciones" element={<Notificaciones />} />
          <Route path="/notificaciones/:notificationId" element={<Notificaciones />} />
          <Route path="/protected/review" element={<ProtectedReviewBook />} />
          <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />
          <Route path="/sobre-nosotros" element={<SobreNosotros />} />
          <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
          <Route path="/aviso-de-privacidad" element={<AvisoPrivacidad />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/politica-de-datos-personales" element={<PoliticaDatosPersonales />} />
          <Route path="/uso-cookies" element={<UsoDeCookies />} />
          <Route path="/cuenta" element={<Cuenta />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/cuenta/:extension" element={<Cuenta />} />
          <Route path="/verificar" element={<EnviarCorreoAVerificar />} />
          <Route path="/opciones/olvido-contraseña" element={<EnviarCorreoCambiarContraseña />} />
          <Route path="/opciones/cambiarContraseña/:token" element={<CambiarContraseña />} />
          <Route path="/para-ti" element={<Fyp />} />
          <Route path="/para-ti/colecciones" element={<FypCollections />} />
          <Route path="/colecciones/:collectionId" element={<ColeccionEspecificoPage />} />
          <Route path="/protected/stats" element={<ProtectedStats />} />
          <Route path="/protected/withdraw" element={<ProtectedWithdraw />} />
          <Route path="/protected/ban" element={<ProtectedBan />} />
          <Route path="/lista-costes" element={<ListaCostes />} />
          <Route path="/protected/seeEmailTemplate" element={<ProtectedSeeEmailTemplate />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
        <ToastContainer
          position='top-center'
          autoClose={5000}
          hideProgressBar={false}
          pauseOnHover={false}
          closeOnClick
          theme='light'
        />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
)
