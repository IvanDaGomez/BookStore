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
    path:"/",
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"libros/crear",
    element: <CrearLibro />
  },
  {
    path:"popUp/:info",
    element: <App/>
  },
  {
    
    path:"libros/:bookId",
    element:<BookView />,
        
  },
  {
    path: "/buscar",
    element:<Search />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/usuarios/:idVendedor",
    element:  <Usuario />
  },
  {
    path: '/usuarios/editarUsuario',
    element: <EditarUsuario/>
  },
  {
    path: '/checkout/:libroId',
    element: <Checkout />
  },
  {
    path: '/favoritos',
    element: <Favorites />
  },
  {
    path: '/mensajes',
    element: <Mensajes/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
