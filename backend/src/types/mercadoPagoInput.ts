import { ID } from "./objects";
import { ShippingDetailsType } from "./shippingDetails";

export type MercadoPagoInput = {
  formData: {
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
  partialData: {
    userId: ID
    bookId: ID
    sellerId: ID
    shippingDetails: ShippingDetailsType
    transaction_amount: number
    application_fee: number
    description: string
    callback_url: string
  }
  payment_method: string
}
