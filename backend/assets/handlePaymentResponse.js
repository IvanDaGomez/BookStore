/* eslint-disable camelcase */
export function handlePaymentResponse (response) {
  const { status, status_detail, payment_method_id, payment_type_id, transaction_amount, description, date_created, external_resource_url } = response

  let message = ''
  let success = false

  // Determinar el estado de la transacción
  switch (status) {
    case 'approved':
      message = 'El pago fue aprobado exitosamente.'
      success = true
      break
    case 'pending':
      message = `El pago está pendiente. Por favor, realiza el pago utilizando el enlace proporcionado: ${external_resource_url || 'No disponible'}`
      break
    case 'rejected':
      message = 'El pago fue rechazado. Razón: ' + (status_detail || 'Razón desconocida.')
      break
    default:
      message = 'Estado desconocido del pago.'
      break
  }

  // Retornar el resultado procesado
  return {
    success,
    message,
    paymentDetails: {
      method: payment_method_id,
      type: payment_type_id,
      amount: transaction_amount,
      description,
      createdIn: date_created,
      paymentLink: external_resource_url
    }
  }
}
