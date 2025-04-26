export function handleDropwdown(showDropdown, setShowDropdown) {
  const dropdown = document.querySelector('.nav-dropdown')
  if (showDropdown) {
    dropdown.style.filter = 'opacity(0)'
    setTimeout(() => {
    dropdown.style.display = 'none'
  },100)
    setShowDropdown(false)
  }
  else {
    dropdown.style.filter = 'opacity(100%)'
    setTimeout(() => {
    dropdown.style.display = 'flex'
  },100)
    setShowDropdown(true)
  }
  
}