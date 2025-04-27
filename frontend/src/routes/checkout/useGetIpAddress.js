import { useEffect, useState } from "react"

export default function useGetIpAddress () {

    const [ip_address, setIp_address] = useState(null)
  
    const getIPAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        setIp_address(data.ip) // Returns the public IP address
      } catch (error) {
        console.error('Error fetching IP address:', error)
        return null
      }
    }
  
    useEffect(() => {
      getIPAddress()
    }, [])
    return ip_address
  }