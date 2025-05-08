import { Request, Response, Router, NextFunction } from 'express'
import { MercadoPagoConfig, Payment } from 'mercadopago' // Asegúrate de tener el SDK de Mercado Pago instalado
import { validateSignature } from '../../assets/validateSignature.js'
const MercadoPagoRouter = Router()

// Endpoint para recibir los webhooks
const webHooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Verificar la autenticidad del webhook (opcional)
    const signature = req.headers['x-mercadopago-signature']
    const body = JSON.stringify(req.body)
    if (!signature || !body) {
      return res.status(400).json({ error: 'Firma no válida' })
    }
    if (typeof signature !== 'string') {
      return res.status(400).json({ error: 'Firma no válida' })
    }
    const isValid = validateSignature({
      signature,
      body: {
        id: req.body.id
      },
      reqId: req.headers['x-request-id'] as string
    }) // Función para validar la firma

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
    next(error)
  }
}

export { MercadoPagoRouter }
