import { calculateComission } from "../../assets/calculateComission"

export function createBody ({ user, libro, formData = null, form, selectedPaymentMethod }) {
  const totalAmount = libro.oferta || libro.precio
  const commissionAmount = calculateComission(totalAmount)
  const partial_data = {
    user_id: user.id,
    book_id: libro.id,
    seller_id: libro.idVendedor,  
    shipping_details: form,
    transaction_amount: totalAmount || 0, // Definido como 0 si no se proporciona
    application_fee: commissionAmount || 0, // Comisión de la aplicación, 0 si no se proporciona
    description: `Pago de libro "${libro.titulo || 'desconocido'}" en Meridian`, // Título del libro, con valor por defecto si es undefined
    callback_url: window.location.hostname
  } 
  if (!formData) {
    return partial_data
  }
  return {
    form_data: formData,
    partial_data,
    payment_method: selectedPaymentMethod, // Método de pago seleccionado
  }
}