import { useEffect, useState } from "react"

export default function useLoadingScreen (time) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },time ?? 2000)
  })
  return loading
}