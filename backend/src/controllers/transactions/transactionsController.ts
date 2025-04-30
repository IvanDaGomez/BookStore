import { validateTransaction } from '../../assets/validate.js'
import { IBooksModel, ITransactionsModel, IUsersModel } from '../../types/models.js'
import express from 'express'
import { ID } from '../../types/objects.js'
import { TransactionObjectType } from '../../types/transaction.js'
import { validateSignature } from '../../assets/validateSignature.js'
import { sendProcessPaymentEmails } from '../users/sendProcessPaymentEmails.js'
import { CreateOrdenDeEnvío } from '../../assets/createOrdenDeEnvio.js'
import { createMercadoPagoPayment } from '../users/createMercadoPagoPayment.js'
import { payment, preference } from '../../assets/config.js'
import { MercadoPagoInput } from '../../types/mercadoPagoInput.js'
import { ShippingDetailsType } from '../../types/shippingDetails.js'
// TODO
export class TransactionsController {
  private TransactionsModel: ITransactionsModel
  private UsersModel: IUsersModel
  private BooksModel: IBooksModel
  constructor ({ TransactionsModel, UsersModel, BooksModel }: { 
    TransactionsModel: ITransactionsModel 
    UsersModel: IUsersModel
    BooksModel: IBooksModel
  }) {
    this.TransactionsModel = TransactionsModel
    this.UsersModel = UsersModel
    this.BooksModel = BooksModel
  }

  // Obtener todas las transacciones
  getAllTransactions = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const transactions = await this.TransactionsModel.getAllTransactions()
      res.json(transactions)
    } catch (err) {
      next(err)
    }
  }

  getTransactionsByUser = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const userId = req.params.userId as ID | undefined
      if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' })
      }
      const transaction = await this.TransactionsModel.getAllTransactionsByUser(userId)
      res.json(transaction)
    } catch (err) {
      next(err)
    }
  }

  getTransactionById = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const transactionId = req.params.transactionId ? parseInt(req.params.transactionId, 10) : undefined
      if (!transactionId) {
        return res.status(400).json({ error: 'ID de transacción no proporcionado' })
      }
      const transaction = await this.TransactionsModel.getTransactionById(transactionId)

      res.json(transaction)
    } catch (err) {
      next(err)
    }
  }

  // Filtrar transaccións
  createTransaction = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    const data = req.body as TransactionObjectType

    // Validación
    const validated = validateTransaction(data)
    if (!validated.success) {
      return res.status(400).json({ error: validated.error })
    }
    // TODO: No se si el id es necesario, ya que se genera en mercadoPago
    data._id = crypto.randomUUID()
    let transaction

    if (data.status === 'approved') {
      transaction = await this.TransactionsModel.createSuccessfullTransaction(data)
    } else {
      transaction = await this.TransactionsModel.createFailureTransaction(data)
    }

    res.json(transaction)
  }

  deleteTransaction = async (req: express.Request, res: express.Response, next:express.NextFunction) => {
    try {
      const transactionId = req.params.transactionId ? parseInt(req.params.transactionId, 10) : undefined
      if (!transactionId) {
        return res.status(400).json({ error: 'ID de transacción no proporcionado' })
      }

      // Obtener los detalles del transacción para encontrar al vendedor (idVendedor)
      const transaction = await this.TransactionsModel.getTransactionById(transactionId)
      if (!transaction) {
        return res.status(404).json({ error: 'Transacción no encontrada' })
      }
      // Verificar si el usuario es el vendedor
      const userId = transaction.userId

      // Eliminar el transacción de la base de datos
      const result = await this.TransactionsModel.deleteTransaction(transactionId)

      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  
  getPreferenceId = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {


    try {
      const body = {
        items: [
          {
            title: req.body.title,
            quantity: 1,
            unit_price: Number(req.body.price),
            currency_id: 'COP'
          }
        ] as any
        // Dont know if it works
        /* ,
        back_urls: {
          success: 'localhost/popUp/successBuying',
          failure: 'localhost/popUp/failureBuying',
          pending: 'localhost/popUp/pendingBuying'
        } */
        // auto_return: 'approved'
      }
      const result = await preference.create({ body })
      res.json({
        id: result.id
      })
    } catch (err) {
      next(err)
    }
  }

  processPayment = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
    TODO: Sequelize transaction
    Steps
    1. Registrar el pago en la base de datos
    2. Actualizar el saldo del usuario y vendedor
    3. Cambiar la disponibilidad del libro a vendido
    4. Crear la orden de envío
    4. Crear la transacción
    5. Enviar notificación al vendedor y comprador
    6. Enviar correo al vendedor y comprador
    7. Devolver el resultado
    */
    try {
      const {
        formData,
        partialData,
        payment_method
      } = req.body as MercadoPagoInput
      const sellerId = partialData.sellerId
      const userId = partialData.userId
      const bookId = partialData.bookId
      const shippingDetails = partialData.shippingDetails
      console.log(!sellerId || !userId || !bookId || !shippingDetails)
      if (!sellerId || !userId || !bookId || !shippingDetails) {
        return res
          .status(400)
          .json({ error: 'Faltan datos requeridos en la solicitud' })
      }

      const [user, seller, book] = await Promise.all([
        this.UsersModel.getUserById(userId),
        this.UsersModel.getUserById(sellerId),
        this.BooksModel.getBookById(bookId)
      ])     

      // Configuración del pago con split payments
      const info = createMercadoPagoPayment({
        formData,
        partialData,
        payment_method,
        book,
        user
      })

      // Crear el pago en MercadoPago 
      const response = await payment.create(info)

      // Actualizar el saldo del usuario y vendedor
      // I dont update the user balance because if the payment is with mercadopago, the user balance is not updated
      await Promise.all([
        this.UsersModel.updateUser(sellerId, {
          balance: {
            porLlegar: (seller.balance.porLlegar ?? 0) + formData.transaction_amount
          }
        }),
        this.BooksModel.updateBook(bookId, {
          disponibilidad: 'Vendido'
        })
      ])
      // PENDIENTE
      const order = await CreateOrdenDeEnvío({
        ...shippingDetails
      })
      // Crear la transacción
      // TODO
          // Registrar la transacción (éxito o fracaso)
      let transaction
      if (response.status === 'approved') {
        transaction = await this.TransactionsModel.createSuccessfullTransaction({
          userId,
          bookId: book._id,
          shippingDetails,
          response,
          order
        })
      } else {
        transaction = await this.TransactionsModel.createFailureTransaction({
          userId,
          bookId: book._id,
          shippingDetails,
          response,
          order
        })
      } 

      // Enviar notificaciones y correos al vendedor y comprador
      await sendProcessPaymentEmails({
        user,
        seller,
        book,
        transaction,
        shippingDetails,
        order,
        UsersModel: this.UsersModel
      })
      res.json({ message: 'Pago exitoso', response })
    } catch (err) {
      console.error('Error al procesar el pago:', err)
      res.status(500).json({
        error: 'Error al procesar el pago',
        details: err
      })
    }
  }
  payWithBalance = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    /*
    TODO: Sequelize transaction
    Steps
    1. Verificar que el usuario tenga saldo suficiente
    2. Buscar el libro por ID
    2. Actualizar el saldo del usuario y vendedor
    3. Cambiar la disponibilidad del libro a vendido
    4. Crear la orden de envío
    4. Crear la transacción
    5. Enviar notificación al vendedor y comprador
    6. Enviar correo al vendedor y comprador
    7. Devolver el resultado
    */
    try {
      // const transaction = sequelize.transaction()
      const { partialData } = req.body as MercadoPagoInput
      const {
        userId,
        sellerId,
        bookId,
        shippingDetails,
        transaction_amount
      } = partialData as {
        userId: ID
        sellerId: ID
        bookId: ID
        shippingDetails: ShippingDetailsType
        transaction_amount: number
      }
      if (!userId || !transaction_amount || !bookId) {
        console.log('Faltan datos requeridos')
        return res.status(400).json({ error: 'Faltan datos requeridos' })
      }
      // Actualizar el saldo del usuario y vendedor
      const [user, seller, book] = await Promise.all([
        this.UsersModel.getUserById(userId),
        this.UsersModel.getUserById(sellerId),
        this.BooksModel.getBookById(bookId)
      ])
      
      // Verificar que el usuario tenga saldo suficiente
      if (user.balance.disponible < transaction_amount) {
        return res.status(400).json({ error: 'Saldo insuficiente' })
      }
      // Actualizar el saldo del usuario y vendedor
      const [updatedUser, updatedSeller, updatedBook] = await Promise.all([
        this.UsersModel.updateUser(userId, {
          balance: {
            disponible: user.balance.disponible - transaction_amount
          }
        }),
        this.UsersModel.updateUser(sellerId, {
          balance: {
            porLlegar: (seller.balance.porLlegar ?? 0) + transaction_amount
          }
        }),
        this.BooksModel.updateBook(bookId, {
          disponibilidad: 'Vendido'
        })
      ])
      // PENDIENTE
      const order = await CreateOrdenDeEnvío({
        ...shippingDetails

      })
      // Crear la transacción
      // TODO
      const transaction = await this.TransactionsModel.createSuccessfullTransaction({
        userId,
        bookId,
        shippingDetails,
        transaction_amount,
        status: 'approved'
      })
      // Enviar notificaciones y correos al vendedor y comprador
      await sendProcessPaymentEmails({
        user: updatedUser,
        seller: updatedSeller,
        book,
        transaction,
        shippingDetails,
        order,
        UsersModel: this.UsersModel
      })
      res.json({ message: 'Pago exitoso' })
    } catch (err) {
      res.status(500).json({
        error: 'Error al procesar el pago',
        details: err
      })
    }
  }
  MercadoPagoWebhooks = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { type } = req.query
      const paymentData = req.body
      const signature = req.headers['x-signature'] ?? '' 
      const reqId = req.headers['x-request-id'] ?? '' 
      if (Array.isArray(signature) || Array.isArray(reqId)) {
        return res.status(400).json({ error: 'Firma no válida' })
      }
      const isValid = validateSignature({ signature, reqId, body: paymentData })
      if (!isValid) {
        return res.status(400).json({ error: 'Firma no válida' })
      }

      // let paymentResponse = {
      //   status: 'error',
      //   message: 'Error al procesar el pago'
      // }
      // if (type === 'payment') {
      //   const data = await payment.get({ id: paymentData.id })
 
      //   // Verificar si ya se procesó esta transacción
      //   const existingTransaction =
      //     await this.TransactionsModel.getTransactionById(data.id ?? '')
      //   if (existingTransaction) {
      //     console.log('Webhook: transacción ya procesada:', data.id)
      //     return res.status(200).json({ status: 'success' })
      //   }

      //   const book = await this.TransactionsModel.getBookByTransactionId(
      //     paymentData.id
      //   )
      //   paymentResponse = await processPaymentResponse({
      //     result: data,
      //     sellerId: book.idVendedor,
      //     book,
      //     data,
      //     res
      //   })
      // }

      // res.status(200).json(paymentResponse)
    } catch (err) {
      next(err)
    }
  }
  shippingWebhook = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<express.Response | void> => {
    try {
      const { type } = req.query
      const data = req.body

    } 
    catch (err) {
      next(err)
    }
  }
}
