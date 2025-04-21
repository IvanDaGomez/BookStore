import { ISOString } from "../../types/objects"
import { TransactionObjectType } from "../../types/transaction"

const transactionObject = (data: Partial<TransactionObjectType>): TransactionObjectType => {
  return {
    _id: data._id ?? 0, // ID único de la transacción
    userId: data.userId ?? crypto.randomUUID(), // ID del usuario que realiza la compra
    sellerId: data.sellerId ?? crypto.randomUUID(),
    bookId: data.bookId ?? crypto.randomUUID(),
    fee_details: data.fee_details || [],
    description: data?.paymentDetails?.description || '',
    charges_details: data.charges_details || [],
    paymentLink: data?.paymentDetails?.paymentLink || '',
    transactionId: data.transactionId || '', // ID de la transacción en la plataforma de Efecty
    amount: data?.paymentDetails?.amount || 0, // Monto de la transacción
    paymentMethod: data?.paymentDetails?.method,
    installments: data.installments || 1,
    card: data.card || {},
    success: data.success || false,
    message: data.message || '',
    shippingDetails: {
      receiverAddress: data.shippingDetails?.receiverAddress || '',
      receiverCity: data.shippingDetails?.receiverCity || '',
      receiverState: data.shippingDetails?.receiverState || '',
      receiverCountry: data.shippingDetails?.receiverCountry || '',
      receiverPhone: data.shippingDetails?.receiverPhone || '',
      receiverName: data.shippingDetails?.receiverName || ''
    },
    status: data.status || 'pending', // Estado del pago (pendiente, confirmado, entregado)
    createdIn: data.createdIn || new Date().toISOString() as ISOString, // Fecha de creación de la transacción
    updatedIn: data.updatedIn || new Date().toISOString() as ISOString // Fecha de la última actualización (cuando cambie el estado)
  }
}

export { transactionObject }