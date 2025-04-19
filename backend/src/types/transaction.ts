import { ID, ISOString } from "./objects"

export type TransactionObjectType = {
  _id: number // ID único de la transacción
  userId: ID // ID del usuario que realiza la compra
  sellerId: ID
  bookId: ID
  fee_details: any[]
  description: string
  charges_details: any[]
  paymentLink: string
  transactionId: string // ID de la transacción en la plataforma de Efecty
  amount: number // Monto de la transacción
  paymentMethod: string | undefined
  installments: number
  card: any
  status: string // Estado del pago (pendiente, confirmado, entregado)
  createdIn: ISOString // Fecha de creación de la transacción
  updatedIn: ISOString // Fecha de la última actualización (cuando cambie el estado)
  paymentDetails?: {
    description?: string
    paymentLink?: string
    amount?: number
    method?: string
    type: string
    createdIn?: ISOString
  }
}