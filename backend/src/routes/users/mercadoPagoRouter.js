import { Router } from 'express'
import { MercadoPagoConfig, Payment } from 'mercadopago' // Asegúrate de tener el SDK de Mercado Pago instalado

const MercadoPagoRouter = Router()

// Endpoint para recibir los webhooks
const webHooks = async (req, res) => {
  try {
    // 1. Verificar la autenticidad del webhook (opcional)
    const signature = req.headers['x-mercadopago-signature']
    const body = JSON.stringify(req.body)
    const isValid = validateSignature(signature, body) // Función para validar la firma

    if (!isValid) {
      return res.status(400).json({ error: 'Firma no válida' })
    }

    // 2. Procesar la notificación (evento de pago)
    const paymentData = req.body

    // Verificar el estado del pago (puedes ajustar este bloque según los eventos que necesitas)
    if (paymentData.action === 'payment') {
      const paymentStatus = paymentData.data.status
      const paymentId = paymentData.data.id

      if (paymentStatus === 'approved') {
        // El pago fue aprobado
        console.log(`Pago aprobado. ID de pago: ${paymentId}`)
        // Aquí puedes actualizar tu base de datos con el estado del pago, etc.
      } else if (paymentStatus === 'rejected') {
        // El pago fue rechazado
        console.log(`Pago rechazado. ID de pago: ${paymentId}`)
      }
      // Puedes manejar otros estados como 'pending', 'in_process', etc.
    }

    // 3. Responder correctamente a Mercado Pago para evitar reintentos
    res.status(200).json({ status: 'success' })
  } catch (error) {
    console.error('Error al procesar el webhook:', error.message)
    res.status(500).json({ error: 'Error interno al procesar el webhook' })
  }
}

// Función para validar la firma de la notificación (opcional)
function validateSignature (signature, body) {
  // Aquí deberías implementar la lógica para validar la firma usando el secreto de tu cuenta
  // Esto depende de la documentación de Mercado Pago para verificar la autenticidad de las solicitudes.
  return signature === 'firma_valida_generada'
}

export { MercadoPagoRouter }
