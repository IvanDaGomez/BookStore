import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes"
import { ID, ISOString } from "../../types/objects"
import { ShippingDetailsType } from "../../types/shippingDetails"
import { TransactionObjectType } from "../../types/transaction"
import { TransactionInputType } from "../../types/transactionInput"

// TODO: Cambiar el tipo de shippingDetails
const transactionObject = (data: Partial<TransactionInputType>): TransactionObjectType => {
  const { api_response, ...importantData } = data.response as PaymentResponse
  return {
    id: data.response?.id, // ID único de la transacción
    userId: data.userId ?? crypto.randomUUID(), // ID del usuario que realiza la compra
    sellerId: data.sellerId ?? crypto.randomUUID(),
    bookId: data.bookId ?? crypto.randomUUID(),
    status: data.status ?? data.response?.status ?? 'pending',
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
    response: {
      id: data.response?.id || 0,
      status: data.response?.status || '',
      status_detail: data.response?.status_detail || '',
      payment_method_id: data.response?.payment_method_id || '',
      transaction_amount: data.response?.transaction_amount || 0,
      installments: data.response?.installments || 0,
      date_created: data.response?.date_created as ISOString || new Date().toISOString(),
      date_approved: data.response?.date_approved as ISOString || new Date().toISOString(),
      date_last_updated: data.response?.date_last_updated as ISOString || new Date().toISOString(),
      date_of_expiration: data.response?.date_of_expiration as ISOString || new Date().toISOString(),
      money_release_date: data.response?.money_release_date as ISOString || new Date().toISOString(),
      money_release_status: data.response?.money_release_status || '',
      issuer_id: data.response?.issuer_id || '',
      payment_type_id: data.response?.payment_type_id || '',
      payment_method: {
        id: data.response?.payment_method?.id || '',
        type: data.response?.payment_method?.type || '',
        data: data.response?.payment_method?.data || {},

      },
      currency_id: data.response?.currency_id || '',
      description: data.response?.description || '',
      live_mode: data.response?.live_mode || false,
      sponsor_id: data.response?.sponsor_id || 0,
      authorization_code: data.response?.authorization_code || '',
      money_release_schema: data.response?.money_release_schema || '',
      taxes_amount: data.response?.taxes_amount || 0,
      counter_currency: data.response?.counter_currency || '',
      ...importantData
    }
  }
}

export { transactionObject }