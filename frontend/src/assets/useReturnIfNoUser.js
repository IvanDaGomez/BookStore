import { useEffect } from "react"
import { useNavigate } from "react-router"


export function useReturnIfNoUser (user, loading, admin = false) {
  /*
  This hook is used to redirect the user to the home page if they are not logged in.
  It checks the user context and if the user is not logged in, it navigates to the specified route.
  It is used in the CrearLibro component to ensure that only logged-in users can access the book creation page.
  */
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      
      navigate(`/popUp/noUser`)
    }
    
    if (!loading && user && admin && user?.rol !== 'admin') {
      navigate(`/popUp/noAdmin`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, admin])
}