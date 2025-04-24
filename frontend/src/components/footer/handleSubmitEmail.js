import axios from "axios"
import { toast } from "react-toastify"

export async function handleSubmitEmail (e) {
  e.preventDefault()
  const { email } = e.target
  const URL = 'http://localhost:3030/api/emails'
  const response = await axios.post(URL, JSON.stringify({ email: email.value }), { withCredentials: true})

  if (response.data.error) {
    toast.error('Error al enviar el correo')
    // toast.success(data.error)
    return
  }
  toast.success('Correo enviado exitosamente')
  document.querySelector('.inputFooter').value = ''
}