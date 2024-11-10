import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/main/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import BookView from './routes/bookView/bookView.jsx'
import ErrorPage from './components/errorPage.jsx'
import Search from './routes/search/search.jsx'
import Login from './routes/login/login.jsx'
import CrearLibro from './routes/crearLibro/CrearLibro.jsx'
import Usuario from './routes/usuarios/Usuario.jsx'
import Favorites from './routes/favorites/favorites.jsx'
import Mensajes from './routes/mensajes/mensajes.jsx'
import './index.css'
import EditarUsuario from './routes/usuarios/editarUsuario.jsx'
import Checkout from './routes/checkout/checkout.jsx'



const router = createBrowserRouter([
  {
    path:"/", // Main path
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"libros/crear", // Post  book
    element: <CrearLibro />
  },
  {
    path:"popUp/:info", // Notifications
    element: <App/>
  },
  {
    
    path:"libros/:bookId", // Specific Book
    element:<BookView />,
        
  },
  {
    path: "/buscar", // Search book with filters
    element:<Search />
  },
  {
    path: "/login", // Login and Signup
    element: <Login />
  },
  {
    path: "/usuarios/:idVendedor", // Specific user UI
    element:  <Usuario />
  },
  {
    path: '/usuarios/editarUsuario', // Update user
    element: <EditarUsuario/>
  },
  {
    path: '/checkout/:bookId', //Checkout
    element: <Checkout />
  },
  {
    path: '/favoritos', // My favorites
    element: <Favorites />
  },
  {
    path: '/mensajes', // Messages
    element: <Mensajes initialStatus={'mensajes'}/>
  },
  {
    path: '/notificaciones/:notificationId',
    element: <Mensajes initialStatus={'notificaciones'}/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
