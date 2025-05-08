import { PaymentResponse } from 'mercadopago/dist/clients/payment/commonTypes'
import { ID, ISOString } from './objects'
import { ShippingDetailsType } from './shippingDetails'

export type TransactionObjectType = {
  id?: number // Unique ID for the transaction
  user_id: ID // ID of the user making the purchase
  seller_id: ID // ID of the seller
  book_id: ID // ID of the book being purchased
  status: string
  // status: 'pending' | 'approved' | 'failed' | 'unknown' // Transaction status
  shipping_details: ShippingDetailsType // Full shipping address and details
  response: Omit<PaymentResponse, 'api_response'> // Response from the payment gateway (MercadoPago) without the api_response field
  order?: any // Reference to the order model or object
}
