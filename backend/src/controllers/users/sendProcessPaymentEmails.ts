import { createEmail } from "../../assets/email/htmlEmails.js";
import { sendEmail } from "../../assets/email/sendEmail.js";
import { createNotification } from "../../assets/notifications/createNotification.js";
import { sendNotification } from "../../assets/notifications/sendNotification.js";
import { BookObjectType } from "../../types/book";
import { IUsersModel } from "../../types/models.js";
import { TransactionObjectType } from "../../types/transaction";
import { PartialUserInfoType } from "../../types/user";

export async function sendProcessPaymentEmails({
  user,
  seller,
  book,
  transaction,
  shippingDetails,
  order,
  UsersModel
}: {
  user: PartialUserInfoType,
  seller: PartialUserInfoType,
  book: BookObjectType,
  transaction: TransactionObjectType,
  shippingDetails: any, // TODO: Define the type for shippingDetails
  order: any // TODO: Define the type for order
  UsersModel: IUsersModel
}){
  try {
    const data = {
      user,
      seller,
      book,
      transaction,
      shippingDetails,
      order
    }
    if (data.transaction?.status !== 'approved') {
      console.log('El pago no fue aprobado, no se enviarán correos ni notificaciones.')
      return
    }

    const userEmail = await UsersModel.getEmailById(user._id)
    const sellerEmail = await UsersModel.getEmailById(seller._id)
    if (data.transaction.paymentDetails?.method === 'efecty' && userEmail) {
      await sendEmail(`${user.nombre} ${userEmail.correo}`, 'Información de tu pago en Efecty', createEmail({
        ...data,
        user: data.user,
        shippingDetails: data.shippingDetails,
        // order: data.order
      }, 'efectyPendingPayment'))
    } 

    await Promise.all([
      sendEmail(
        `${user.nombre} ${userEmail.correo}`,
        '¡Gracias por tu compra!',
        createEmail(data, 'paymentDoneThank')
      ),
      sendEmail(
        `${seller.nombre} ${sellerEmail.correo}`,
        '¡Tu libro ha sido vendido con éxito!',
        createEmail(data, 'bookSold')
      ),
      sendEmail(
        `${user.nombre} ${userEmail.correo}`,
        'Comprobante de pago en Meridian',
        createEmail(data, 'paymentDoneBill')
      ),
      sendEmail(
        `${seller.nombre} ${sellerEmail.correo}`,
        'Comprobante de pago en Meridian',
        createEmail({
          ...data,
          user: seller
        }, 'paymentDoneBill')
      ),
      sendNotification(createNotification(user, 'bookBought',)),
      sendNotification(createNotification(seller, 'bookSold',)),
    ])
  } catch (error) {
    console.error('Error al enviar correos o notificaciones:', error)
  }
}