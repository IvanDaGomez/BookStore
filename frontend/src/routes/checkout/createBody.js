import { calculateComission } from "../../assets/calculateComission"

export function createBody ({ user, libro, formData = null, form }) {
  const totalAmount = libro.oferta || libro.precio
  const commissionAmount = calculateComission(totalAmount)

  const partialData = {
    userId: user._id,
    bookId: libro._id,
    sellerId: libro.idVendedor,
    shippingDetails: form,
    transaction_amount: totalAmount || 0, // Definido como 0 si no se proporciona
    application_fee: commissionAmount || 0, // Comisión de la aplicación, 0 si no se proporciona
    payer: {
      email: user?.correo || '', // Email del usuario, vacío si no se proporciona
    },
    description: `Pago de libro "${libro.titulo || 'desconocido'}" en Meridian`, // Título del libro, con valor por defecto si es undefined
    callback_url: 'https://www.youtube.com'
  }
  if (!formData) {
    return partialData
  }
  console.dir(formData, { depth: null})
  console.dir(form, { depth: null})
  return {
    ...formData,
    ...partialData,
    token: formData.token || null, // El token generado por Mercado Pago
    issuer_id: formData.issuer_id || null, // Puede ser null si no aplica
    payment_method_id: formData.payment_method_id || '', // Definido como cadena vacía si no se aplica
    installments: formData.installments || 1, // Definido como 1 si no se proporciona
    payer: {
      ...formData.payer,
      email: formData?.payer?.email || '', // Email del usuario, vacío si no se proporciona
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
    }

  }
}