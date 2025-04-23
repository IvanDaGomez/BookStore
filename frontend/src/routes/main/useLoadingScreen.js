import { useEffect, useState } from "react"

export default function useLoadingScreen () {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },1500)
  })
  return loading
}