import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes"
import { BookObjectType } from "../types/book"
import { TransactionObjectType } from "../types/transaction"
import { ID, ISOString } from "../types/objects"

/* eslint-disable camelcase */
// TODO: Cambiar el nombre de la función a handlePaymentResponse
export function handlePaymentResponse (response:
  PaymentResponse & {
    sellerId: string
    userId: string
    book: Partial<BookObjectType>
    // Shipping details is the response from Envia or Servientrega API
    shippingDetails: any
}): Partial<TransactionObjectType> {
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
      message = `El pago está pendiente. Por favor, realiza el pago utilizando el enlace proporcionado: ${transaction_details?.external_resource_url ?? 'No disponible'}`
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
    userId: userId as ID,
    sellerId: sellerId as ID,
    bookId: book._id as ID,
    success,
    status: status as TransactionObjectType['status'] ?? 'unknown',
    fee_details: fee_details ?? [],
    charges_details: charges_details ?? [],
    message,
    shippingDetails,
    installments : installments ?? 1,
    card,
    paymentDetails: {
      method: payment_method_id,
      type: payment_type_id ?? 'credit_card',
      amount: transaction_amount,
      description,
      createdIn: date_created as ISOString ?? new Date().toISOString() as ISOString,
      paymentLink: transaction_details?.external_resource_url ?? 'No disponible'
    }
  }
}
