import axios from "axios"
import { useState } from "react"

export default function useFetchAddPreferenceId() {
  const [preferenceId, setPreferenceId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function addPreferenceId() {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:3030/api/transactions/getAddMoneyPreferenceId', null, { withCredentials: true })

      setPreferenceId(response.data.id)
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return { preferenceId, loading, error, addPreferenceId }
}