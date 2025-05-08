import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'
import { ID } from './objects'
import { ShippingDetailsType } from './shippingDetails'

export type TransactionInputType = {
  user_id: ID
  book_id: ID
  seller_id: ID
  shipping_details: ShippingDetailsType
  response: Omit<PaymentResponse, 'api_response'>
  order: any
  transaction_amount?: number
  status?: string
}
