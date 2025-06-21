/* eslint-disable react/prop-types */
export default function CityData ({cities, selectedDepartment, setSelectedCity, setPopUpLocation, setFiltros }) {
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