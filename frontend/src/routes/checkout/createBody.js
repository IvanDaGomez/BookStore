import { calculateComission } from "../../assets/calculateComission"

export function createBody ({ user, libro, formData = null, form, selectedPaymentMethod }) {
  const totalAmount = libro.oferta || libro.precio
  const commissionAmount = calculateComission(totalAmount)
  const partialData = {
    userId: user._id,
    bookId: libro._id,
    sellerId: libro.idVendedor,  
    shippingDetails: form,
    transaction_amount: totalAmount || 0, // Definido como 0 si no se proporciona
    application_fee: commissionAmount || 0, // Comisión de la aplicación, 0 si no se proporciona
    description: `Pago de libro "${libro.titulo || 'desconocido'}" en Meridian`, // Título del libro, con valor por defecto si es undefined
    callback_url: 'https://www.youtube.com'
  } 
  if (!formData) {
    return partialData
  }
  return {
    formData,
    partialData,
    payment_method: selectedPaymentMethod, // Método de pago seleccionado
  }
}