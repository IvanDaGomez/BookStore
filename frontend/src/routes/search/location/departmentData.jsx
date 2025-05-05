/* eslint-disable react/prop-types */
import useGetDepartments from "./useGetDepartments"

export default function DepartmentData ({ setSelectedDepartment }) {
  const departments = useGetDepartments()
  return (<>
  <h2>Seleccionar departamento</h2>
  <hr style={{margin: '0'}}/>
  {departments.map((department, index) => (
    <div key={index} className="department" onClick={() => {
      setSelectedDepartment(department)
      document.querySelector(".department").classList.add("active") 
    }}>
      {department}
    </div>
  ))}
  </>)
}