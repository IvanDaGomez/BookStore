import { useContext, useState, useRef } from "react"
import { useReturnIfNoUser } from "../../assets/useReturnIfNoUser"
import { UserContext } from "../../context/userContext"
import "./protectedSeeEmailTemplate.css"
export default function ProtectedSeeEmailTemplate () {
  const { user, loading } = useContext(UserContext)
  useReturnIfNoUser(user, loading, true)
  const [content, setContent] = useState('')
  // Declaro un ref para el debounce
  const debounceRef = useRef(null)

  async function fetchData (e) {
    const template = e.target.value

    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      if (!template) {
        setContent('')
        return
      }
      const response = await fetch(`http://localhost:3030/api/emailTemplate/${template}`)
      const data = await response.json()
      setContent(data.content)
    }, 500) // 500ms debounce
  }

  return (
    <div className="protectedContainer">
      <input type="text" placeholder="Escribe la plantilla a observar" onChange={fetchData} />
      <div
        className="templateVisualization"
        dangerouslySetInnerHTML={{ __html: content || "<p>No content available</p>" }}
      />
    </div>
  )
}