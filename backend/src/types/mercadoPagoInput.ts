import { ID } from './objects'
import { ShippingDetailsType } from './shippingDetails'

export type MercadoPagoInput = {
  form_data: {
    token?: string
    issuer_id?: string
    payment_method_id: string
    transaction_amount: number
    installments?: number
    payer: {
      email?: string
      entity_type?: string
      identification?: {
        type?: string
        number?: string
      }
    }
    transaction_details?: {
      financial_institution?: string
    }
  }
  partial_data: {
    user_id: ID
    book_id: ID
    seller_id: ID
    shipping_details: ShippingDetailsType
    transaction_amount: number
    application_fee: number
    description: string
    callback_url: string
  }
  payment_method: string
}
