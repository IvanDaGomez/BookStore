/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { isObjectEmpty } from "../../../assets/isObjectEmpty"
import getDepartments from "./getDepartments"

export default function DepartmentData ({ setSelectedDepartment }) {
  const [departments, setDepartments] = useState([])
  useEffect(() => {
    if (isObjectEmpty(departments)) {
      getDepartments().then((data) => {
        setDepartments(data)
      })
    }
  }, [departments])
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