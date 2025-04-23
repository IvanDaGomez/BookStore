import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useHandleHashChange() {
  const location = useLocation(); // Get current location from React Router

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#comments') {
        const comments = document.querySelector('#comments');
        
        if (comments) {
          const rect = comments.getBoundingClientRect();
          window.scrollTo(0, rect.top + window.scrollY); // Scroll to the comments section
        }
      }
    };

    // Run immediately when the component mounts or when location changes
    handleHashChange();

  }, [location]); // Dependency on `location`, so it runs whenever the location changes
}
