import { createEmail } from "../../assets/email/htmlEmails.js";
import { sendEmail } from "../../assets/email/sendEmail.js";
import { createNotification } from "../../assets/notifications/createNotification.js";
import { sendNotification } from "../../assets/notifications/sendNotification.js";
import { BookObjectType } from "../../types/book";
import { ISOString } from "../../types/objects";
import { TransactionObjectType } from "../../types/transaction";
import { PartialUserInfoType } from "../../types/user";

export async function sendProcessPaymentEmails({
  user,
  seller,
  book,
  transaction,
  shippingDetails
}: {
  user: PartialUserInfoType,
  seller: PartialUserInfoType,
  book: BookObjectType,
  transaction: TransactionObjectType,
  shippingDetails: any // TODO: Define the type for shippingDetails
}){
  try {
    const data = {
      user,
      seller,
      book,
      transaction,
      shippingDetails
    }
    await Promise.all([
      sendEmail(
        user.nombre,
        '¡Gracias por tu compra!',
        createEmail(data, 'paymentDoneThank')
      ),
      sendEmail(
        seller.nombre,
        '¡Tu libro ha sido vendido con éxito!',
        createEmail(data, 'bookSold')
      ),
      sendEmail(
        user.nombre,
        'Comprobante de pago en Meridian',
        createEmail(data, 'paymentDoneBill')
      ),
      sendEmail(
        seller.nombre,
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