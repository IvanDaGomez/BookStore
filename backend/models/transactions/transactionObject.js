export const transactionObject = (data) => {
  return {
    _id: data._id || '', // ID único de la transacción
    userId: data.userId || '', // ID del usuario que realiza la compra
    sellerId: data.sellerId || '',
    bookId: data.bookId || '',
    fee_details: data.fee_details || [],
    description: data?.paymentDetails?.description || '',
    charges_details: data.charges_details || [],
    paymentLink: data?.paymentDetails?.paymentLink || '',
    transactionId: data.transactionId || '', // ID de la transacción en la plataforma de Efecty
    amount: data?.paymentDetails?.amount || 0, // Monto de la transacción
    paymentMethod: data?.paymentDetails?.method,
    installments: data.installments || 1,
    card: data.card || {},
    status: data.status || 'pending', // Estado del pago (pendiente, confirmado, entregado)
    createdIn: data.createdIn || new Date().toISOString(), // Fecha de creación de la transacción
    updatedIn: data.updatedIn || new Date().toISOString() // Fecha de la última actualización (cuando cambie el estado)
  }
}
