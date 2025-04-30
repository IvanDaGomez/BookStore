import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes"
import { ID, ISOString } from "./objects"
import { ShippingDetailsType } from "./shippingDetails"

export type TransactionObjectType = {
  _id?: number | string // Unique ID for the transaction
  userId: ID // ID of the user making the purchase
  sellerId: ID // ID of the seller
  bookId: ID // ID of the book being purchased
  status: string,
  // status: 'pending' | 'approved' | 'failed' | 'unknown' // Transaction status
  shippingDetails: ShippingDetailsType // Full shipping address and details
  response: Omit<PaymentResponse, 'api_response'> // Response from the payment gateway (MercadoPago) without the api_response field
  order?: any // Reference to the order model or object
}
