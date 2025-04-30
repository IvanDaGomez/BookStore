import { toast } from "react-toastify"
import { createBody } from "./createBody"
import axios from "axios"
const handlePayWithBalance = async ({ libro, user, form, setLoading }) => {
  if (user.balance.disponible < libro.precio) {
    toast.error('No tienes el suficiente dinero!')
    return
  }

  setLoading(true)

  try {
    const body = createBody({
      user,
      libro,
      formData: {},
      form
    })
    const response = await axios.post('http://localhost:3030/api/transactions/pay_with_balance', body)


    if (response.data.error) {
      toast.error('Error al procesar el pago con balance')
      return
    }
    toast.success('Pago exitoso con balance!')
  } catch (error) {
    console.error('Balance payment error:', error)
    toast.error('Ocurrió un error al procesar el pago con balance')
  } finally {
    setLoading(false)
  }
}

const onSubmit = async ({ 
  selectedPaymentMethod,
  formData,
  form,
  libro,
  user,
  setStatusScreen,
  setPaymentId,
  setStatus
 }) => {
  try {
    // Calcular monto total y comisión
    // Preparar datos del usuario y dirección
    const body = createBody({
      user,
      libro,
      formData,
      form,
      selectedPaymentMethod
    })
    const response = await axios.post('http://localhost:3030/api/transactions/process_payment', body)
    console.log('Response:', response.data)
    setStatus(response.data.response.status)
    setStatusScreen(true)
    setPaymentId(response.data.response.id)
  } catch (error) {
    console.error('Payment error:', error)
    toast.error('Ocurrió un error al enviar los datos, vuelve a intentar.')
  }
}
const onError = (error) => {
  console.error('Payment Brick Error:', error)
}
const onReady = () => {
  console.log('Payment Brick is ready')
}

export { onSubmit, onError, onReady, handlePayWithBalance }