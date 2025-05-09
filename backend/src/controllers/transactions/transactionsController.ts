import { validateTransaction } from '../../assets/validate.js'
import {
  IBooksModel,
  ITransactionsModel,
  IUsersModel
} from '../../types/models.js'
import express from 'express'
import { ID, ISOString } from '../../types/objects.js'
import { TransactionObjectType } from '../../types/transaction.js'
import { validateSignature } from '../../assets/validateSignature.js'
import { sendProcessPaymentEmails } from '../users/sendProcessPaymentEmails.js'
import { CreateOrdenDeEnvío } from '../../assets/createOrdenDeEnvio.js'
import { createMercadoPagoPayment } from '../users/createMercadoPagoPayment.js'
import { payment, preference } from '../../assets/config.js'
import { MercadoPagoInput } from '../../types/mercadoPagoInput.js'
import { ShippingDetailsType } from '../../types/shippingDetails.js'
import { sendEmail } from '../../assets/email/sendEmail.js'
import { createEmail } from '../../assets/email/htmlEmails.js'
// TODO
export class TransactionsController {
  private TransactionsModel: ITransactionsModel
  private UsersModel: IUsersModel
  private BooksModel: IBooksModel
  constructor ({
    TransactionsModel,
    UsersModel,
    BooksModel
  }: {
    TransactionsModel: ITransactionsModel
    UsersModel: IUsersModel
    BooksModel: IBooksModel
  }) {
    this.TransactionsModel = TransactionsModel
    this.UsersModel = UsersModel
    this.BooksModel = BooksModel
  }

  // Obtener todas las transacciones
  getAllTransactions = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transactions = await this.TransactionsModel.getAllTransactions()
      res.json(transactions)
    } catch (err) {
      next(err)
    }
  }

  getTransactionsByUser = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.params.user_id as ID | undefined
      if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' })
      }
      const transactions =
        await this.TransactionsModel.getAllTransactionsByUser(userId)

      res.json(transactions)
    } catch (err) {
      next(err)
    }
  }

  getTransactionById = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transactionId = req.params.transaction_id
        ? parseInt(req.params.transaction_id, 10)
        : undefined
      if (!transactionId) {
        return res
          .status(400)
          .json({ error: 'ID de transacción no proporcionado' })
      }
      const transaction = await this.TransactionsModel.getTransactionById(
        transactionId
      )

      res.json(transaction)
    } catch (err) {
      next(err)
    }
  }

  // Filtrar transaccións
  createTransaction = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const data = req.body as TransactionObjectType

    // Validación
    const validated = validateTransaction(data)
    if (!validated.success) {
      return res.status(400).json({ error: validated.error })
    }
    // TODO: No se si el id es necesario, ya que se genera en mercadoPago
    // data.id = crypto.randomUUID()
    const transaction =
      await this.TransactionsModel.createSuccessfullTransaction(data)

    res.json(transaction)
  }

  deleteTransaction = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const transactionId = req.params.transaction_id
        ? parseInt(req.params.transaction_id, 10)
        : undefined
      if (!transactionId) {
        return res
          .status(400)
          .json({ error: 'ID de transacción no proporcionado' })
      }

      // Obtener los detalles del transacción para encontrar al vendedor (idVendedor)
      const transaction = await this.TransactionsModel.getTransactionById(
        transactionId
      )
      if (!transaction) {
        return res.status(404).json({ error: 'Transacción no encontrada' })
      }
      // Verificar si el usuario es el vendedor
      const userId = transaction.user_id
      const user = await this.UsersModel.getUserById(userId)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
      // Eliminar el transacción de la base de datos
      const result = await this.TransactionsModel.deleteTransaction(
        transactionId
      )

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
            currencyid: 'COP'
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
      const { form_data, partial_data, payment_method } =
        req.body as MercadoPagoInput
      const sellerId = partial_data.seller_id
      const userId = partial_data.user_id
      const bookId = partial_data.book_id
      const shippingDetails = partial_data.shipping_details
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
        form_data,
        partial_data,
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
            por_llegar:
              (seller.balance.por_llegar ?? 0) + form_data.transaction_amount
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
      const transaction =
        await this.TransactionsModel.createSuccessfullTransaction({
          user_id: userId,
          book_id: book.id,
          shipping_details: shippingDetails,
          response,
          order
        })

      // Enviar notificaciones y correos al vendedor y comprador
      await sendProcessPaymentEmails({
        user,
        seller,
        book,
        transaction,
        shipping_details: shippingDetails,
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
      const { partial_data } = req.body as MercadoPagoInput
      const {
        user_id,
        seller_id,
        book_id,
        shipping_details,
        transaction_amount
      } = partial_data as {
        user_id: ID
        seller_id: ID
        book_id: ID
        shipping_details: ShippingDetailsType
        transaction_amount: number
      }
      if (!user_id || !transaction_amount || !book_id) {
        console.log('Faltan datos requeridos')
        return res.status(400).json({ error: 'Faltan datos requeridos' })
      }
      // Actualizar el saldo del usuario y vendedor
      const [user, seller, book] = await Promise.all([
        this.UsersModel.getUserById(user_id),
        this.UsersModel.getUserById(seller_id),
        this.BooksModel.getBookById(book_id)
      ])

      // Verificar que el usuario tenga saldo suficiente
      if (user.balance.disponible < transaction_amount) {
        return res.status(400).json({ error: 'Saldo insuficiente' })
      }
      // Actualizar el saldo del usuario y vendedor
      const [updatedUser, updatedSeller, updatedBook] = await Promise.all([
        this.UsersModel.updateUser(user_id, {
          compras_ids: [...seller.compras_ids, book.id],
          balance: {
            disponible: user.balance.disponible - transaction_amount
          }
        }),
        this.UsersModel.updateUser(seller_id, {
          balance: {
            por_llegar: (seller.balance.por_llegar ?? 0) + transaction_amount
          }
        }),
        this.BooksModel.updateBook(book_id, {
          disponibilidad: 'Vendido'
        })
      ])
      // PENDIENTE
      const order = await CreateOrdenDeEnvío({
        ...shipping_details
      })
      // Crear la transacción
      // TODO
      const transaction =
        await this.TransactionsModel.createSuccessfullTransaction({
          user_id,
          book_id,
          shipping_details,
          transaction_amount,
          status: 'approved'
        })
      // Enviar notificaciones y correos al vendedor y comprador
      await sendProcessPaymentEmails({
        user: updatedUser,
        seller: updatedSeller,
        book,
        transaction,
        shipping_details,
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
  // TODO: mejorar legibilidad
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

      let paymentResponse: {
        status: string
        message: string
        transaction?: TransactionObjectType
      } = {
        status: 'error',
        message: 'Error al procesar el pago'
      }
      if (type === 'payment') {
        const response = await payment.get({ id: paymentData.id })

        // Verificar si ya se procesó esta transacción
        const existingTransaction =
          await this.TransactionsModel.getTransactionById(response.id ?? 0)
        if (existingTransaction.status === 'approved') {
          console.log('Webhook: transacción ya procesada:', response.id)
          return res.status(200).json({ status: 'success' })
        }
        const [user, seller, book] = await Promise.all([
          this.UsersModel.getUserById(existingTransaction.user_id),
          this.UsersModel.getUserById(existingTransaction.seller_id),
          this.BooksModel.getBookById(existingTransaction.book_id)
        ])
        if (response.status === 'approved') {
          // Actualizar el saldo del usuario y vendedor

          // Actualizar el saldo del usuario y vendedor
          await Promise.all([
            this.UsersModel.updateUser(user.id, {
              compras_ids: [...user.compras_ids, book.id]
            }),
            this.UsersModel.updateUser(seller.id, {
              balance: {
                por_llegar:
                  (seller.balance.por_llegar ?? 0) +
                  (response?.transaction_amount ?? 0)
              }
            }),
            this.BooksModel.updateBook(book.id, {
              disponibilidad: 'Vendido'
            })
          ])
          // Crear la transacción
          const transaction =
            await this.TransactionsModel.createSuccessfullTransaction({
              user_id: existingTransaction.user_id,
              book_id: existingTransaction.book_id,
              shipping_details: existingTransaction.shipping_details,
              response,
              order: existingTransaction.order
            })
          // Enviar notificaciones y correos al vendedor y comprador
          await sendProcessPaymentEmails({
            user,
            seller,
            book,
            transaction,
            shipping_details: existingTransaction.shipping_details,
            order: existingTransaction.order,
            UsersModel: this.UsersModel
          })
          paymentResponse = {
            status: 'success',
            message: 'Pago procesado con éxito',
            transaction
          }
        }

        res.status(200).json(paymentResponse)
      }
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
    } catch (err) {
      next(err)
    }
  }
  getSafeCode = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const userId = req.params.user_id as ID | undefined

      if (!userId) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' })
      }
      const validationCode = Math.floor(Math.random() * 1000000)
      const user = await this.UsersModel.getEmailById(userId)

      // Send the email
      // await sendEmail(
      //   `${user.nombre} <${user.correo}>`,
      //   'Correo de validación en Meridian',
      //   createEmail(
      //     {
      //       user: {
      //         ...user
      //       },
      //       metadata: {
      //         validationCode
      //       }
      //     },
      //     'validationEmail'
      //   )
      // )
      res.json({ code: validationCode })
    } catch (err) {
      next(err)
    }
  }
  withdrawMoney = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { user_id, numero_cuenta, monto, password, phone_number, bank } =
        req.body as {
          user_id: ID
          numero_cuenta: string
          monto: string
          phone_number: string
          password: string
          bank: string
        }

      if (!user_id || !monto || !numero_cuenta || !password || !bank) {
        return res
          .status(400)
          .json({ error: 'ID de usuario o monto no proporcionado' })
      }
      const ammount = parseInt(monto, 10)
      const accountNumber = parseInt(numero_cuenta, 10)
      const phone = parseInt(phone_number, 10)
      const userEmail = await this.UsersModel.getEmailById(user_id)
      const user = await this.UsersModel.login(userEmail.correo, password)
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      if (user.balance.disponible < ammount) {
        return res.status(400).json({ error: 'Saldo insuficiente' })
      }
      await this.TransactionsModel.createWithdrawTransaction({
        id: crypto.randomUUID(),
        user_id,
        numero_cuenta: accountNumber,
        monto: ammount,
        fecha: new Date().toISOString() as ISOString,
        bank,
        status: 'pending',
        phone_number: phone
      })

      const updatedUser = await this.UsersModel.updateUser(user_id, {
        balance: {
          disponible: user.balance.disponible - ammount,
          pendiente: (user.balance.pendiente ?? 0) + ammount
        }
      })

      res.json(updatedUser)
    } catch (err) {
      next(err)
    }
  }
  getWithdrawMoney = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const withdrawTransactions =
        await this.TransactionsModel.getAllWithdrawTransactions()

      res.json(
        withdrawTransactions.filter(
          transaction => transaction.status === 'pending'
        )
      )
    } catch (err) {
      next(err)
    }
  }
  updateWithdrawMoney = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const id = req.params.user_id as ID | undefined

      if (!id) {
        return res.status(400).json({ error: 'ID de usuario no proporcionado' })
      }
      await this.TransactionsModel.markWithdrawTransaction(id)
      res.json({ message: 'Transacción de retiro aprobada con éxito' })
    } catch (err) {
      next(err)
    }
  }
}
