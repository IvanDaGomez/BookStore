import { ISOString } from "../../types/objects"
import { TransactionObjectType } from "../../types/transaction"

// TODO: Cambiar el tipo de shippingDetails
const transactionObject = (data: any): TransactionObjectType => {
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
    transaction_amount: data?.paymentDetails?.transaction_amount || 0, // Monto de la transacción
    payment_method: data?.paymentDetails?.method || '',
    installments: data.installments || 1,
    card: data.card || {},
    success: data.success || false,
    message: data.message || '',
    shippingDetails: {
      additional_info: {
      ip_address: data?.shippingDetails?.additional_info?.ip_address || ''
      },
      address: {
      city: data?.shippingDetails?.address?.city || '',
      department: data?.shippingDetails?.address?.department || '',
      neighborhood: data?.shippingDetails?.address?.neighborhood || '',
      street_name: data?.shippingDetails?.address?.street_name || '',
      street_number: data?.shippingDetails?.address?.street_number || '',
      zip_code: data?.shippingDetails?.address?.zip_code || ''
      },
      first_name: data?.shippingDetails?.first_name || '',
      last_name: data?.shippingDetails?.last_name || '',
      phone: {
      area_code: data?.shippingDetails?.phone?.area_code || '',
      number: data?.shippingDetails?.phone?.number || ''
      }
    },
    status: data.status || 'pending', // Estado del pago (pendiente, confirmado, entregado)
    createdIn: data.createdIn || new Date().toISOString() as ISOString, // Fecha de creación de la transacción
    updatedIn: data.updatedIn || new Date().toISOString() as ISOString // Fecha de la última actualización (cuando cambie el estado)
  }
}

export { transactionObject }