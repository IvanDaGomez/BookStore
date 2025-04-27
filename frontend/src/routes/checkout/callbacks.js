import { toast } from "react-toastify"
import { calculateComission } from "../../assets/calculateComission"

const handlePayWithBalance = async ({ libro, user, setLoading }) => {
  if (user.balance < libro.precio) {
    toast.error('No tienes el suficiente dinero!')
    return
  }

  setLoading(true)

  try {
    const response = await fetch('http://localhost:3030/api/books/pay_with_balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: 'user-id', // Replace with actual user ID
        bookId: libro.id,
        amount: libro.oferta || libro.precio
      })
    })

    const result = await response.json()

    if (result.status === 'success') {
      toast.success('Payment successful with balance!')
    } else {
      throw new Error(result.message || 'Payment failed')
    }
  } catch (error) {
    console.error('Balance payment error:', error)
    toast.error('Payment failed. Please try again.')
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
    const totalAmount = libro.oferta || libro.precio
    const commissionAmount = calculateComission(totalAmount)
    // Preparar datos del usuario y dirección
    const body = {
      ...formData,
      userId: user._id,
      book: libro,
      sellerId: libro.idVendedor,
      shippingDetails: form,
      token: formData.token || null, // El token generado por Mercado Pago
      issuer_id: formData.issuer_id || null, // Puede ser null si no aplica
      payment_method_id: formData.payment_method_id || '', // Definido como cadena vacía si no se aplica
      transaction_amount: totalAmount || 0, // Definido como 0 si no se proporciona
      installments: formData.installments || 1, // Definido como 1 si no se proporciona
      application_fee: commissionAmount || 0, // Comisión de la aplicación, 0 si no se proporciona
      payer: {
        ...formData.payer,
        email: formData.payer.email || '', // Email del usuario, vacío si no se proporciona
        identification: {
          type: formData?.payer?.identification?.identificationType || 'CC', // Tipo de identificación por defecto "CC"
          number: formData?.payer?.identification?.identificationNumber || '' // Número de identificación vacío si no se proporciona
        },
        address: {
          street_name: form.address.street_name || '', // Nombre de la calle, vacío si no se proporciona
          street_number: form.address.street_number || '', // Número de la calle, vacío si no se proporciona
          zip_code: form.address.zip_code || '', // Código postal, vacío si no se proporciona
          neighborhood: form.address.neighborhood || '', // Barrio, vacío si no se proporciona
          city: form.address.city || '' // Ciudad, vacío si no se proporciona
        },
        phone: {
          area_code: form.phone.area_code || '', // Código de área, vacío si no se proporciona
          number: form.phone.number || '' // Número de teléfono, vacío si no se proporciona
        },
        first_name: form.first_name || null,
        last_name: form.last_name || null
      },
      additional_info: {
        ip_address: form.additional_info.ip_address || '' // IP Address, vacío si no se proporciona
      },
      description: `Pago de libro "${libro.titulo || 'desconocido'}" en Meridian`, // Título del libro, con valor por defecto si es undefined
      callback_url: 'https://www.youtube.com'
    }
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