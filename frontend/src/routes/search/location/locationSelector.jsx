/* eslint-disable react/prop-types */
import { useState } from "react"
import getLocation from "../../../assets/getLocation"
import DepartmentData from "./departmentData"
import CityData from "./cityData"
export default function LocationSelector ({ setFiltros, filtros }) {
  const [popUpLocation, setPopUpLocation] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const handleSetLocation = async () => {
    document.querySelector('.getLocation').innerText = "Cargando..."
    const locationData = await getLocation()
    setFiltros((prev) => {
      
      return {
        ...prev,
        ciudad: [locationData?.ciudad],
        departamento: [locationData?.departamento]
      }
    })
    setPopUpLocation(false)
  }
  const handleSetDepartment = (e) => {
    if (e.target.classList.contains("active")) {
      e.target.classList.remove("active")
    }
    else {
      e.target.classList.add("active")
    } 
      setSelectedDepartment(null)
      setSelectedCity(null)
      if (!e.target.classList.contains("active")) {
        document.querySelector(".city").classList.add("active")
      }
      
  }
  return (<>
  {popUpLocation && <>
    <div className="popUp">
      <svg onClick={()=> setPopUpLocation(!popUpLocation)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#ffffff"} fill={"none"}><path d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <div className="selectLocation">
        <h2>Seleccionar ubicación</h2>
        <button className="getLocation"  onClick={handleSetLocation}>
          Utilizar mi ubicación

        </button>
        <div onClick={(e) => handleSetDepartment(e)} className="department active">
          Departamento:
          {selectedDepartment &&<span className=""> {selectedDepartment}</span>}
        </div>
        <div>
          Ciudad:
          {selectedCity &&<span className="city"> {selectedCity}</span>}
        </div>
      </div>
      <div className="locationView">
        {!selectedDepartment ? <>
        <DepartmentData setSelectedDepartment={setSelectedDepartment} />
        </>:
        <CityData selectedDepartment={selectedDepartment} 
        setSelectedCity={setSelectedCity} 
        setPopUpLocation={setPopUpLocation}
        setFiltros={setFiltros}
        />
        }

      </div>
    </div>
  </>
  }
  <div className="locationSelector" onClick={() => setPopUpLocation(!popUpLocation)}>
    <span>{
      filtros?.ciudad?.length > 0 &&
      filtros?.departamento?.length > 0
      ? 
      
      `${filtros?.departamento} - ${filtros?.ciudad}`
      
      : "Ubicación"
      }</span>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color={"#000"} fill={"none"}><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
  </div>
  </>)

}