import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes"
import { ID } from "./objects"
import { ShippingDetailsType } from "./shippingDetails"

export type TransactionInputType = {
  userId: ID,
  bookId: ID,
  sellerId: ID,
  shippingDetails: ShippingDetailsType,
  response: Omit<PaymentResponse, 'api_response'>,
  order: any,
  transaction_amount?: number
  status?: string
}