/* eslint-disable react/prop-types */

import SelectButton from "./selectButton"

export default function Filter ({ filter, setFiltros, index }) {
  function handleSetFilter (e) {
    const value = e.target.innerText

    if (e.target.classList.contains('choosen')) {
      e.target.classList.remove('choosen')
      const param = filter.param
      setFiltros((prevFilters) => ({
        ...prevFilters,
        [param]: prevFilters[param].filter((item) => item !== value)
      }))
      return
    }
    else {
      e.target.classList.add('choosen')
      const param = filter.param
      

      setFiltros((prevFilters) => {
        console.log(prevFilters[param])
        const existingValues = prevFilters[param] ?? []
        return ({
        ...prevFilters,
        [param]: [...existingValues, value]
      })})
    }
    
  }
  return (<>
  <SelectButton filter={filter} callback={handleSetFilter} index={index}/>
  </>)
}
