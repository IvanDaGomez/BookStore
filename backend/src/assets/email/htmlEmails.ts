import dotenv from 'dotenv'
import { ISOString } from '../../types/objects'
import { BookObjectType } from '../../types/book'
import { UserInfoType } from '../../types/user'
import { TransactionObjectType } from '../../types/transaction'
import { Barcode } from 'mercadopago/dist/clients/payment/commonTypes'
import { ShippingDetailsType } from '../../types/shippingDetails'
dotenv.config()

const styles = `
                :root{
                  --color: #42376E;
                  --using4: #3689e7; /* Accent */
                }
                body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f9;
                padding: 20px;
                
                }
                .header {
                  width:100%;
                  height: 50px;
                  background: #3689e7;
                  display:flex;
                  justify-content:flex-start;
                  align-items: center;
                  margin-bottom
                }
                header img{
                  height: 100%;
                  aspect-ratio: 1 / 1;
                  transform: translateY(25px);
                  background: #f4f4f9;
                  border-radius: 50%;
                  padding: 10px;
                }
                .container {
                width: calc(100% - 40px);
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                color: #42376E;
                text-align: center;
                }
                p {
                font-size: 1.1em;
                line-height: 1.6;
                }
                .button {
                display: inline-block;
                padding: 12px;
                background: #42376E;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                text-align: center;
                }
                .footer {
                margin-top: 20px;
                font-size: 0.9em;
                color: #aaa;
                text-align: center;
                }
                a.button{
                  text-decoration:none;
                  color: white;
                }
                `
type emailToSendType =
  | 'thankEmail'
  | 'bookPublished'
  | 'newQuestion'
  | 'validationEmail'
  | 'changePassword'
  | 'paymentDoneBill'
  | 'paymentDoneThank'
  | 'bookSold'
  | 'efectyPendingPayment'
function createEmail (data: {
  book?: Partial<BookObjectType>
  user?: UserInfoType | Partial<UserInfoType>
  seller?: Partial<UserInfoType>
  transaction?: Partial<TransactionObjectType>
  shippingDetails?: ShippingDetailsType
  metadata?: {
    guia?: string
    validationCode?: number
    validationLink?: string
    barcode?: Barcode
    date_of_expiration?: string
  }
}, template: emailToSendType): string {
  switch (template) {
    case 'thankEmail': {
      return `
        <html>
            <head>
            <style>
                ${styles}
            </style>
            </head>
            <body>
            <div class="container">
              <header>
                <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
              <header>
              <h1>Gracias por unirte a Meridian!</h1>
              <p>Hola <strong>${data.user?.nombre ?? ''}</strong>,</p>
              <p>Nos emociona que hayas decidido ser parte de nuestra comunidad de amantes de libros! En Meridian, creemos en el poder de los libros para inspirar, educar y entretener. 
              En nuestro catálogo podrás encontrar todos los libros que necesites, en un sólo lugar.</p>
              <p>Como miembro nuevo, tendrás acceso a todo el catálogo de libros, noticias y colecciones que sabremos que te encantarán.</p>
              <p>Para comenzar a explorar, <a href="${process.env.FRONTEND_URL}" class="button">Echa un vistazo a nuestra colección</a></p>
              <div class="footer">
              <p>Si tienes preguntas o necesitas asistencia, contáctate con <a href="mailto:support@meridianbookstore.com">nosotros</a>.</p>
              <p>Que tengas un feliz día!</p>
              </div>
            </div>
            </body>
        </html>
        `
    }
    case 'bookPublished': {
      return `
        <html>
            <head>
            <style>
                ${styles}
            </style>
            </head>
            <body>
            <div class="container">
              <div class='header'>
                <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
              </div>
              <h1>Tu libro ha sido publicado con éxito!</h1>
              <p>Hola <strong>${data.book?.vendedor ?? ''}</strong>,</p>
              <p>Felicidades! Tu libro "<strong>${data.book?.titulo ?? ''}</strong>" ha sido publicado exitosamente en nuestra plataforma.</p>
              <p>Estamos emocionados de compartir tu publicación con nuestros amantes de libros!. TU libro ya se puede buscar y está listo para ser vendido.</p>
              <p>Puedes ver tu libro aquí:</p>
              <a href="${process.env.FRONTEND_URL}/libros/${data.book?.id ?? ''}"><div class='button'>Ver libro</div></a>
              <div class="footer">
              <p>Si tienes preguntas o necesitas asistencia, contáctate con <a href="mailto:support@meridianbookstore.com">nosotros</a>.</p>
              </div>
            </div>
            </body>
        </html>
        `
    }
    // case 'newQuestion': {
    //   return `
    //   <html>
    //         <head>
    //         <style>
    //             ${styles}
    //         </style>
    //         </head>
    //         <body>
    //           <div class='container'>
    //             <div class='header'>
    //               <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
    //             </div>
    //             <h1>Tienes una nueva pregunta!</h1>
    //             <p>Hola <strong>${data.vendedor}</strong>,</p>
    //             <p>Un usuario tiene una pregunta sobre tu libro:</p>
    //             <blockquote>
    //               <p>${data.pregunta}</p>
    //             </blockquote>
    //             <p>Puedes responder a esta pregunta haciendo clic en el siguiente enlace:</p>
    //             <p><a href="${process.env.FRONTEND_URL}/notificaciones/${data.id}">Responder pregunta</a></p>
    //             <p>Si tienes otras preguntas o necesitas asistencia, puedes responder a este correo o contactarnos <a href="mailto:support@meridianbookstore.com">aquí</a>.</p>
    //           </div>

    //         </body>
    //     </html>
    //   `
    // }
    case 'validationEmail': {
      return `
      <html>
            <head>
            <style>
                ${styles}
            </style>
            </head>
            <body>
              <div class='container'>
                <div class='header'>
                  <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
                </div>
                <h1>¡Código de verificación!</h1>
                <p>Hola <strong>${data.user?.nombre ?? ''}</strong>,</p>
                <p>El código de verificación es ${data.metadata?.validationCode}</p>
                <hr/>
                <<p>Si no te registraste en ${process.env.BRAND_NAME} Bookstore, ignora este correo o contáctanos para informarnos.</p>>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en responder a este correo o <a href="mailto:support@meridianbookstore.com">contactarnos aquí</a>.</p>
              </div>
            </body>
        </html>
      `
    }
    case 'changePassword': {
      return `
      <html>
          <head>
              <style>
                  ${styles}
              </style>
          </head>
          <body>
              <div class='container'> 
                <div class='header'>
                  <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
                </div>
                <h1>Solicitud para Cambiar Contraseña</h1>
                <p>Hola <strong>${data.user?.nombre ?? ''}</strong>,</p>
                <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en Meridian Bookstore.</p>
                <p>Por favor, pulsa el siguiente botón para completar el proceso de cambio de contraseña:</p>
                <a href='${data.metadata?.validationLink}'><div class='button'>Cambiar Contraseña</div></a>
                <p>Este código es válido por 15 minutos.</p>
                <hr/>
                <p>Si no solicitaste este cambio, ignora este correo o contáctanos para informarnos.</p>
                <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en responder a este correo o <a href="mailto:support@meridianbookstore.com">contactarnos aquí</a>.</p>
              </div>
          </body>
      </html>
      `
    }
    case 'paymentDoneBill': {
      return `
      <html>
        <head>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          <div class="container">
              <div class='header'>
                <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
              </div>
            <main>
            <h1>¡Pago Realizado con Éxito!</h1>
              <p>Hola,</p>
              <p>Tu pago ha sido procesado correctamente. Aquí tienes los detalles de tu factura:</p>
              <table>
                <tr>
                  <td><strong>ID de la Transacción:</strong></td>
                  <td>${data.transaction?.id}</td>
                </tr>
                <tr>
                  <td><strong>Fecha:</strong></td>
                  <td>${new Date().toLocaleString('es-CO', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</td>
                </tr>
                <tr>
                  <td><strong>Monto:</strong></td>
                  <td>$${data.transaction?.response?.transaction_amount ?? 'N/A'}</td>
                </tr>
                <tr>
                  <td><strong>Método de pago:</strong></td>
                  <td>${data.transaction?.response?.payment_method_id ?? 'N/A'}</td>
                </tr>
              </table>
              <p>Gracias por tu confianza en ${process.env.BRAND_NAME}.</p>
            </main>
            <footer>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </footer>
          </div>
        </body>
      </html>
      `
    }
    case 'paymentDoneThank': {
      return `
      <html>
        <head>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          <div class="container">
            <div class='header'>
              <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
            </div>
            <main>
              <h1>¡Gracias por tu Compra!</h1>
              <p>Hola,${data.user?.nombre}</p>
              <p>Queremos agradecerte por realizar tu compra con ${process.env.BRAND_NAME}. Tu pago ha sido confirmado.</p>
              <p>Pronto recibirás más información sobre tu pedido.</p>
              <p>Si necesitas más ayuda, por favor contáctanos.</p>
            </main>
            <footer>
              <p>Atentamente,</p>
              <p>El equipo de ${process.env.BRAND_NAME}</p>
            </footer>
          </div>
        </body>
      </html>
      `
    }
    case 'bookSold': {
      return `
      <html>
        <head>
          <style>
            ${styles}
          </style>
        </head>
        <body>
          <div class="container">
            <div class='header'>
              <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
            </div>
            <main>
              <h1>¡Tu libro se ha vendido!</h1>
              <p>Hola, ${data.user?.nombre}</p>
              <p>Nos complace informarte que tu libro <strong>${data.book?.titulo}</strong> ha sido vendido exitosamente en ${process.env.BRAND_NAME}.</p>
              <p>Por favor, prepáralo para el envío lo antes posible y llévalo al punto de "Empresa" más cercano. Aquí tienes algunos detalles importantes:</p>
              <ul>
                <li><strong>Comprador:</strong> ${data.seller?.nombre}</li>
                <li><strong>Guía de envío:</strong> ${data.metadata?.guia ?? ''}</li>
                <li><strong>Fecha de la compra:</strong> ${new Date(data.transaction?.response?.date_created ?? '').toLocaleString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</li>
              </ul>
              <p>Si necesitas ayuda con el proceso de envío o tienes alguna pregunta, no dudes en contactarnos.</p>
            </main>
            <footer>
              <p>¡Gracias por confiar en nosotros!</p>
              <p>Atentamente,</p>
              <p>El equipo de ${process.env.BRAND_NAME}</p>
            </footer>
          </div>
        </body>
      </html>
      `
    }
    case 'efectyPendingPayment': {
      return `
      <html>
        <head>
          <style>
            ${styles}
          </style>
        </head>
          <div class="container">
            <div class='header'>
              <img src='cid:logo@meridian' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
            </div>
            <main>
              <h1>¡Gracias por tu compra, ${data?.user?.nombre}</h1>
              <p>Para completar tu pedido, debes realizar el pago en cualquier sucursal de <strong>Efecty</strong>.</p>
              <p>Indica al operador de Efecty que deseas realizar un pago y proporciona el código de pago junto con el monto exacto.</p>
                  <ul>
                    <li><strong>Monto a pagar:</strong> $${data.transaction?.response?.transaction_amount}</li>
                    <li><strong>Vencimiento:</strong> ${new Date(data.metadata?.date_of_expiration ?? '').toLocaleString('es-CO', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</li>
                  </ul>
                  <p>
                    Presenta este código de pago en el punto de Efecty: <strong>${data.metadata?.barcode?.content}</strong>
                  </p>
              <p>Si necesitas ayuda con el proceso de envío o tienes alguna pregunta, no dudes en contactarnos.</p>
            </main>
            <footer>
              <p>¡Gracias por confiar en nosotros!</p>
              <p>Atentamente,</p>
              <p>El equipo de ${process.env.BRAND_NAME}</p>
            </footer>
          </div>
        </body>
      </html>
      `
    }
    default: {
      return ''
    }
  }
}

export { createEmail }
