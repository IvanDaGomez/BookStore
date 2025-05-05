import { useEffect, useState } from "react"
import axios from "axios"
export default function useSelectCities (selectedDepartment) {
  const [cities, setCities] = useState([])


  useEffect(() => {
    async function fetchCities () {
      if (selectedDepartment) {
        try {
        
        const response = await axios.get("/colombia.csv")
        if (response.data.error) {
          throw new Error("Error fetching data from API")
        }
        const cities = new Set()
        response.data.split("\n").slice(1)
        .forEach((item) => {
          const parts = item.split(",")
          if (parts[2] === selectedDepartment) {
            cities.add(parts[4])
          }
        })
        const citiesArray = Array.from(cities).sort((a, b) => a.localeCompare(b))
        setCities(citiesArray)


        } catch (error) {
          console.error("Error fetching cities:", error)
        }
      }
    }
    fetchCities()
  }, [selectedDepartment])

  return { cities }
}