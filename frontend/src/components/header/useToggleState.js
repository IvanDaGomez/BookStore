import { useState } from "react";

export default function useToggleState(initialValue) {
  const [state, setState] = useState(initialValue);

  const toggleState = () => {
    const sidebar = document.querySelector('.menuSideBar')
    
    sidebar.style.display = 'flex'
    if (state) {
      sidebar.style.transform = 'translateX(0)'
      setState(false)
    }
    else {
      sidebar.style.transform = 'translateX(-100%)'
      setState(true)
    }
  }

  return [state, toggleState];
}