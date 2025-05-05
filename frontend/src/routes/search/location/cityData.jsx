import useSelectCities from "./useSelectCities"

// eslint-disable-next-line react/prop-types
export default function CityData ({ selectedDepartment, setSelectedCity, setPopUpLocation, setFiltros }) {
   const { cities } = useSelectCities(selectedDepartment)
   return (<>
    <h2>Seleccionar ciudad</h2>
    <hr style={{margin: '0'}}/>
   {cities.map((city, index) => (
     <div key={index} className="city" onClick={() => {
      setSelectedCity(city)
      setPopUpLocation(false)
      setFiltros((prev) => {
        return {
          ...prev,
          ciudad: [city],
          departamento: [selectedDepartment]
        }
      })
     }}>
       {city}
     </div>
   ))}
   </>)
}