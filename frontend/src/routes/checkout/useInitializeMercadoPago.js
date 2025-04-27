import { initMercadoPago } from "@mercadopago/sdk-react"
import { useEffect } from "react"
import { onError, onReady, onSubmit } from "./callbacks"

export default function useInitializeMercadoPago ({
  PUBLIC_KEY,
  preferenceId,
  libro,
  form,
  user,
  setStatusScreen,
  setPaymentId,
  setStatus
}) {
  useEffect(() => {
    initMercadoPago(PUBLIC_KEY)
  }, [PUBLIC_KEY])

  // Render Payment Brick only when `preferenceId` is set and stable
  useEffect(() => {
    if (preferenceId) {
      const renderPaymentBrick = async () => {
        try {
          const bricksBuilder = window.MercadoPago.bricks()
          const initialization = {
            amount: libro.oferta ? libro.oferta : libro.precio,
            preferenceId,
            marketplace: true
          }

          const customization = {
            paymentMethods: {
              ticket: 'all',
              bankTransfer: 'all',
              creditCard: 'all',
              debitCard: 'all',
              mercadoPago: 'all'
            }
          }

          await bricksBuilder.create('payment', 'paymentBrick_container', {
            initialization,
            customization,
            callbacks: {
              onSubmit: (formData) => onSubmit({
                formData,
                form,
                libro,
                user,
                setStatusScreen,
                setPaymentId,
                setStatus
              }),
              onError,
              onReady
            }
          })
        } catch (error) {
          console.error('Error rendering Payment Brick:', error)
        }
      }

      renderPaymentBrick()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenceId, libro, form, user]) // Ensure `renderPaymentBrick` only depends on `preferenceId` and `libro` values

}