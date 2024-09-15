import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './routes/main/App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

const router = createBrowserRouter([
  {
    path:"/",
    element: <App/>,
    errorElement: <></>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
