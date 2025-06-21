import axios from "axios"


// eslint-disable-next-line no-unused-vars
export default async function getDepartments (country = "Colombia") {
      try {
        const response = await axios.get("/colombia.csv")
        if (response.data.error || response.data.length === 0) {
          throw new Error("Error fetching data from API")
        }
        let departamentos = new Set()
        response.data.split("\n").slice(1)
        .forEach((item) => {
          const parts = item.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/) // Split by commas outside quotes
          if (parts.length < 3) return
          departamentos.add(parts[2].replace(/"/g, "").trim()) // Remove quotes and trim
        })
        departamentos = Array.from(departamentos).sort((a, b) => a.localeCompare(b))

        return departamentos
      } catch (error) {
        console.error("Error fetching departments:", error)
      }


}