import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/main/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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

const router = createBrowserRouter([
  {
    path: '/', // Main path
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: 'libros/crear', // Post  book
    element: <CrearLibro />
  },
  {
    path: 'popUp/:info', // Notifications
    element: <App />
  },
  {

    path: 'libros/:bookId', // Specific Book
    element: <BookView />

  },
  {
    path: '/buscar', // Search book with filters
    element: <Search />
  },
  {
    path: '/login', // Login and Signup
    element: <Login />
  },
  {
    path: '/usuarios/:idVendedor', // Specific user UI
    element: <Usuario />
  },
  {
    path: '/usuarios/editarUsuario', // Update user
    element: <EditarUsuario />
  },
  {
    path: '/checkout/:bookId', // Checkout
    element: <Checkout />
  },
  {
    path: '/favoritos/:idVendedor', // My favorites
    element: <Usuario />
  },
  {
    path: '/mensajes', // Messages
    element: <Mensajes />
  },

  {
    path: '/notificaciones',
    element: <Notificaciones />
  },
  {
    path: '/notificaciones/:notificationId',
    element: <Notificaciones />
  },
  {
    path: '/protected/review',
    element: <ProtectedReviewBook />
  },
  {
    path: '/terminos-y-condiciones',
    element: <TerminosYCondiciones />
  },
  {
    path: '/sobre-nosotros',
    element: <SobreNosotros />
  },
  {
    path: '/politica-privacidad',
    element: <PoliticaPrivacidad />
  },
  {
    path: '/aviso-de-privacidad',
    element: <AvisoPrivacidad />
  },
  {
    path: '/contacto',
    element: <Contacto />
  },
  {
    path: '/politica-de-datos-personales',
    element: <PoliticaDatosPersonales />
  },
  {
    path: '/sobre-nosotros',
    element: <SobreNosotros />
  },
  {
    path: '/uso-cookies',
    element: <UsoDeCookies />
  },
  {
    path: '/cuenta',
    element: <Cuenta />
  },
  {
    path: '/faq',
    element: <Faq />
  },
  {
    path: '/cuenta/:extension',
    element: <Cuenta />
  }, {
    path: '/verificar',
    element: <EnviarCorreoAVerificar />
  }, {
    path: '/opciones/olvido-contraseña',
    element: <EnviarCorreoCambiarContraseña />
  }, {
    path: '/opciones/cambiarContraseña/:token',
    element: <CambiarContraseña />
  },
  {
    path: '/para-ti',
    element: <Fyp />
  },
  {
    path: '/para-ti/colecciones',
    element: <FypCollections />
  },
  {
    path: '/colecciones/:collectionId',
    element: <ColeccionEspecificoPage />
  },
  {
    path: '/protected/stats',
    element: <ProtectedStats />
  },
  {
    path: '/protected/withdraw',
    element: <ProtectedWithdraw />
  },
  {
    path: '/lista-costes',
    element: <ListaCostes />
  }
], {
  future: {
    v7_relativeSplatPath: true
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
    </UserProvider>
  </StrictMode>
)
