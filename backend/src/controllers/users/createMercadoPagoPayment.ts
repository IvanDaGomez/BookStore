import { PaymentCreateRequest } from "mercadopago/dist/clients/payment/create/types"
import type { Options } from "mercadopago/dist/types.d.ts"
import { MercadoPagoInput } from "../../types/mercadoPagoInput"
import { Shipments } from "mercadopago/dist/clients/commonTypes"
import { BookObjectType } from "../../types/book"
import { PartialUserInfoType } from "../../types/user"
export function createMercadoPagoPayment({
  formData,
  partialData,
  payment_method,
  book,
  user
}: MercadoPagoInput & { book: BookObjectType, user: PartialUserInfoType}): {
  body: PaymentCreateRequest,
  requestOptions: Options
} {
  const XidempotencyKey = crypto.randomUUID()
  return {
    body: {
      transaction_amount: formData.transaction_amount, // Monto total de la transacción
      payment_method_id: formData.payment_method_id,
      payer: {
        email: formData.payer.email,
        identification: {
          type: formData.payer?.identification?.type ?? '',
          number: formData.payer?.identification?.number ?? ''
        }
      },
      description: partialData.description,
      installments: formData?.installments || 1,
      token: formData.token || '',
      issuer_id: parseInt(formData?.issuer_id ?? '0', 10) || 0,
      additional_info: {
        items: [
          {
            id: book.id,
            title: book.titulo,
            description: book.descripcion,
            picture_url: book.images[0],
            category_id: book.genero,
            quantity: 1,
            unit_price: book?.oferta || book?.precio,
          }
        ],
        ip_address: partialData.shippingDetails.additional_info.ip_address,
        shipments: {
          receiver_address: {
            zip_code: partialData.shippingDetails.address.zip_code,
            street_name: partialData.shippingDetails.address.street_name,
            street_number: parseInt(partialData.shippingDetails.address.street_number, 10),
            // apartment: partialData.shippingDetails.apartment,
            city_name: partialData.shippingDetails.address.city,
            state_name: partialData.shippingDetails.address.department
          }
        }
      },
      callback_url: partialData.callback_url || '', // URL de retorno después del pago
      application_fee: partialData.application_fee ?? 0, // Tarifa de la aplicación
      /* marketplace: {
        collector_id: process.env.MERCADOPAGO_COLLECTOR_ID // ID de tu cuenta colectora principal
      }, */
      external_reference: `book_${partialData.bookId}_${partialData.userId}`, // Referencia para identificar el pago
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