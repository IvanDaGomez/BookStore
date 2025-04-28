import { toast } from "react-toastify"
import { createBody } from "./createBody"

const handlePayWithBalance = async ({ libro, user, form, setLoading }) => {
  if (user.balance < libro.precio) {
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
    const response = await fetch('http://localhost:3030/api/users/pay_with_balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()

    if (result.data.error) {
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
      form
    })
    const response = await fetch('http://localhost:3030/api/users/process_payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const result = await response.json()
    setStatus(result.status)
    setStatusScreen(true)
    setPaymentId(result.id)
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