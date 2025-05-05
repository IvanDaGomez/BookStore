import axios from "axios"
import { useEffect, useState } from "react"


export default function useGetDepartments (country = "Colombia") {
  const [departmentsList, setDepartmentsList] = useState([])
  useEffect(() => {
    async function fetchDepartments () {
      try {
        const response = await axios.get("/colombia.csv")
        if (response.data.error || response.data.length === 0) {
          throw new Error("Error fetching data from API")
        }
        const deparments = new Set()
        response.data.split("\n").slice(1)
        .forEach((item) => {
          const parts = item.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) // Split by commas outside quotes
          if (parts.length < 3) return
          deparments.add(parts[2].replace(/"/g, "").trim()) // Remove quotes and trim
        })
        const departamentos = Array.from(deparments).sort((a, b) => a.localeCompare(b))
        
        setDepartmentsList(departamentos)
      } catch (error) {
        console.error("Error fetching departments:", error)
      }
    }
    fetchDepartments()
  
  },[country])
  return departmentsList
}