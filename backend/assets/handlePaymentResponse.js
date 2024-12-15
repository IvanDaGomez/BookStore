/* eslint-disable camelcase */
export function handlePaymentResponse (response) {
  const {
    userId,
    sellerId,
    id,
    book,
    status,
    status_detail,
    payment_method_id,
    payment_type_id,
    transaction_amount,
    description,
    date_created,
    transaction_details,
    fee_details,
    charges_details,
    installments,
    shippingDetails,
    card
  } = response

  let message = ''
  let success = false

  // Determinar el estado de la transacción
  switch (status) {
    case 'approved':
      message = 'El pago fue aprobado exitosamente.'
      success = true
      break
    case 'pending':
      message = `El pago está pendiente. Por favor, realiza el pago utilizando el enlace proporcionado: ${transaction_details.external_resource_url || 'No disponible'}`
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
    _id: id,
    userId,
    sellerId,
    bookId: book._id,
    success,
    status,
    fee_details,
    charges_details,
    message,
    shippingDetails,
    installments,
    card,
    paymentDetails: {
      method: payment_method_id,
      type: payment_type_id,
      amount: transaction_amount,
      description,
      createdIn: date_created,
      paymentLink: transaction_details.external_resource_url
    }
  }
}
