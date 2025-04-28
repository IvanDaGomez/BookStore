import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types"
import type { Options } from "mercadopago/dist/types.d.ts"
export function createMercadoPagoPayment({
  book,
  userId,
  data,
  transaction_amount,
  application_fee
}: {
  book: any
  userId: string
  data: any
  transaction_amount: number
  application_fee?: number
}): {
  body: PaymentCreateRequest,
  requestOptions: Options
} {
  const XidempotencyKey = crypto.randomUUID()
  return {
    body: {
      transaction_amount, // Monto total de la transacción
      payment_method_id: data.payment_method_id,
      payer: data.payer,
      description: data.description,
      installments: data.installments || 1,
      token: data.token || null,
      issuer_id: data.issuer_id || null,
      additional_info: data.additional_info || {},
      callback_url: data.callback_url || null,
      application_fee: application_fee || 0, // Tarifa de la aplicación
      /* marketplace: {
        collector_id: process.env.MERCADOPAGO_COLLECTOR_ID // ID de tu cuenta colectora principal
      }, */
      external_reference: `book_${book._id}_${userId}`, // Referencia para identificar el pago
      notification_url: `${process.env.BACKEND_DOMAIN}/api/users/mercadoPagoWebHooks?source_news=webhooks` // Webhook para notificaciones
      /* payments: [
        {
          collector_id: sellerId, // ID de la página de gestiones
          amount: transaction_amount - application_fee, // Lo que queda para el vendedor
          payment_method_id: data.payment_method_id
        },
        {
          collector_id: marketplaceCollectorId, // ID del marketplace (comisiones)
          amount: application_fee, // Comisión del marketplace
          payment_method_id: data.payment_method_id
        }
      ] */
    },
    requestOptions: { idempotencyKey: XidempotencyKey }
  }
}