import { ID, ISOString } from "./objects"
export type ShippingDetailsType = any

export type TransactionObjectType = {
  _id?: number | string// ID único de la transacción
  userId: ID // ID del usuario que realiza la compra
  sellerId: ID
  bookId: ID
  fee_details: any[]
  description: string
  charges_details: any[]
  paymentLink: string
  transactionId: string // ID de la transacción en la plataforma de Efecty
  transaction_amount: number // Monto de la transacción
  paymentMethod: string | undefined
  installments: number
  card: any
  success: boolean
  message: string
  shippingDetails: ShippingDetailsType
  status: 'pending' | 'approved' | 'failed' | 'unknown' // Estado de la transacción
  createdIn: ISOString // Fecha de creación de la transacción
  updatedIn: ISOString // Fecha de la última actualización (cuando cambie el estado)
  paymentDetails?: {
    description?: string
    paymentLink?: string
    amount?: number
    method?: string
    type: string
    createdIn?: ISOString
    barcode?: string
  }
}