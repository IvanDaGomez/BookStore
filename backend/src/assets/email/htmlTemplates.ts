import { BookObjectType } from '../../types/book'
import { UserInfoType } from '../../types/user'
import { TransactionObjectType } from '../../types/transaction'
import { ShippingDetailsType } from '../../types/shippingDetails'
import { Barcode } from 'mercadopago/dist/clients/payment/commonTypes'
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
                  /*background: #f4f4f9;*/
                  display:flex;
                  justify-content:flex-start;
                  align-items: center;
                }
                .header img{
                  height: 100%;
                  aspect-ratio: 1 / 1;
                  border-radius: 50%;
                  margin:0 !important;
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
                h2 {
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
                color: white;
                border-radius: 5px;
                background:#3689e7;
                }
                a {
                  font-family: inherit;
                  color: #42376E;
                  font-weight: 600;
                }
                a.button{
                  text-decoration:none;
                  color: white;
                  font-family: inherit;
                }
                `
const footer = `                
  <div class='footer'>
    <p>Si no te registraste en ${
      process.env.BRAND_NAME
    }, ignora este correo o contáctanos para informarnos.</p>
    <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en responder a este correo o <a href="mailto:support@meridianbookstore.com">contactarnos aquí</a>.</p>
    <p>Gracias por ser parte de nuestra comunidad!</p>
    <p>Para más información, pregunta a nuestro equipo de soporte o <a target='_blank' href="${process.env.FRONTEND_URL}/contacto">contáctanos</a></p>
  </div>
`
let logoMeridian = 'cid:logo@meridian'
logoMeridian = '/logo.png'
type DataType = {
    book?: Partial<BookObjectType>
    user?: UserInfoType | Partial<UserInfoType>
    seller?: Partial<UserInfoType>
    transaction?: Partial<TransactionObjectType>
    shipping_details?: ShippingDetailsType
    metadata?: {
      guia?: string
      validation_code?: number
      validation_link?: string
      barcode?: Barcode
      date_of_expiration?: string,
      pregunta?: string
      respuesta?: string
    }
  }
const thankEmailTemplate = (data: DataType) => {
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
                <img src='${logoMeridian}' alt='Logo de ${
                  process.env.BRAND_NAME
                }' title='Logo de ${process.env.BRAND_NAME}'/>
              </div>
              <h1>¡Gracias por unirte a Meridian!</h1>
              <p>Hola <strong>${data.user?.nombre ?? 'amante de libros'}</strong>,</p>
              <p>Nos emociona que hayas decidido ser parte de nuestra comunidad de amantes de los libros.</p>
              <p>En Meridian, creemos en el poder de los libros para inspirar, educar y entretener.</p>
              <p>En nuestro catálogo podrás encontrar todos los libros que necesites, en un solo lugar.</p>
              <p>Como miembro nuevo, tendrás acceso a todo el catálogo de libros, noticias y colecciones que sabemos que te encantarán.</p>
              <p>Para comenzar a explorar:</p>
              <a target='_blank' href="${process.env.FRONTEND_URL}/para-ti"><button class='button'>Explora nuestra colección</button></a>
              ${footer}

            </div>
            </body>
        </html>
        `
}
const bookPublishedTemplate = (data: DataType) => {
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
                <img src='${logoMeridian}' alt='Logo de ${
                  process.env.BRAND_NAME
                }' title='Logo de ${process.env.BRAND_NAME}'/>
              </div>
              <h1>Tu libro ha sido publicado con éxito!</h1>
              <p>Hola <strong>${data.book?.vendedor ?? ''}</strong>,</p>
              <p>Felicidades! Tu libro "<strong>${
                data.book?.titulo ?? ''
              }</strong>" ha sido publicado exitosamente en nuestra plataforma.</p>
              <p>Estamos emocionados de compartir tu publicación con nuestros amantes de libros!. Tu libro ya se puede buscar y está listo para ser vendido.</p>
              <p>Puedes ver tu libro aquí:</p>
              <a target='_blank' href="${process.env.FRONTEND_URL}/libros/${
                data.book?.id ?? ''
              }"><div class='button'>Ver libro</div></a>
              ${footer}
      
            </div>
            </body>
        </html>
        `
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
    //               <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
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
}
const validationEmailTemplate = (data: DataType) => {
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
                  <img src='${logoMeridian}' alt='Logo de ${
                    process.env.BRAND_NAME
                  }' title='Logo de ${process.env.BRAND_NAME}'/>
                </div>
                <h1>Valida tu correo electrónico!</h1>
                <p>Hola <strong>${data.user?.nombre ?? ''}</strong>,</p>
                <p>Gracias por registrarte en ${process.env.BRAND_NAME}! Para completar tu registro, por favor valida tu correo electrónico con ayuda del siguiente código:</p>
                <h2><strong>${
                  data.metadata?.validation_code
                }</strong></h2>
                <p>Atentamente,</p>
                <p>El equipo de ${process.env.BRAND_NAME}</p>
                <hr/>
                ${footer}
              </div>
            </body>
        </html>
      `
}

const changePasswordTemplate = (data: DataType) => {
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
                  <img src='${logoMeridian}' alt='Logo de ${
                    process.env.BRAND_NAME
                  }' title='Logo de ${process.env.BRAND_NAME}'/>
                </div>
                <h1>Solicitud para Cambiar Contraseña</h1>
                <p>Hola <strong>${data.user?.nombre ?? ''}</strong>,</p>
                <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en Meridian Bookstore.</p>
                <p>Por favor, pulsa el siguiente botón para completar el proceso de cambio de contraseña:</p>
                <a href='${
                  data.metadata?.validation_link
                }'><div class='button'>Cambiar Contraseña</div></a>
                <p>Este código es válido por 15 minutos.</p>
                <hr/>
                <p>
                  ${process.env.BRAND_NAME} nunca enviará un correo electrónico en el que solicite que se revele o verifique una contraseña, una tarjeta de crédito o un número de cuenta bancaria. Si recibe un correo electrónico sospechoso con un enlace para actualizar la información de la cuenta, no haga clic en el enlace. En su lugar, reporte el correo electrónico a ${process.env.BRAND_NAME} para que se investigue.
                </p>
                <hr/>
                ${footer}
              </div>
          </body>
      </html>
      `
}
const paymentDoneBillTemplate = (data: DataType) => {
  return `
    <html>
      <head>
        <style>
          ${styles}
          .bill-summary {
            margin: 30px auto;
            max-width: 420px;
            border-radius: 8px;
            background: #f8f8fc;
            padding: 24px 18px;
            box-shadow: 0 2px 8px rgba(66,55,110,0.07);
          }
          .bill-summary h2 {
            color: #42376E;
            margin-bottom: 18px;
            text-align: left;
          }
          .bill-summary .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 1.05em;
          }
          .bill-summary .row strong {
            color: #42376E;
          }
          .bill-summary .total {
            border-top: 1px solid #e0e0e0;
            margin-top: 16px;
            padding-top: 12px;
            font-size: 1.15em;
            font-weight: bold;
            color: #3689e7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='header'>
            <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
          </div>
          <main>
            <h1>¡Pago realizado!</h1>
            <p>Hola${data.user?.nombre ? `, ${data.user.nombre}` : ''}:</p>
            <p>Hemos recibido tu pago exitosamente. Aquí tienes el resumen de tu compra:</p>
            <div class="bill-summary">
              <h2>Resumen de Factura</h2>
              <div class="row">
                <span><strong>Libro:</strong></span>
                <span>${data.book?.titulo ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Vendedor:</strong></span>
                <span>${data.seller?.nombre ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>ID Transacción:</strong></span>
                <span>${data.transaction?.id ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Fecha:</strong></span>
                <span>${data.transaction?.response?.date_created ? new Date(data.transaction.response.date_created).toLocaleString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : new Date().toLocaleString('es-CO')}</span>
              </div>
              <div class="row">
                <span><strong>Método de pago:</strong></span>
                <span>${data.transaction?.response?.payment_method_id ?? 'N/A'}</span>
              </div>
              <div class="row total">
                <span>Total pagado:</span>
                <span>$${data.transaction?.response?.transaction_amount ?? 'N/A'}</span>
              </div>
            </div>
            <p>¡Gracias por confiar en ${process.env.BRAND_NAME}!</p>
          </main>
          ${footer}
        </div>
      </body>
    </html>
  `
}
const paymentDoneThankTemplate = (data: DataType) => {
  return `
    <html>
      <head>
        <style>
          ${styles}
          .thank-summary {
            margin: 30px auto;
            max-width: 420px;
            border-radius: 8px;
            background: #f8f8fc;
            padding: 24px 18px;
            box-shadow: 0 2px 8px rgba(66,55,110,0.07);
          }
          .thank-summary h2 {
            color: #42376E;
            margin-bottom: 18px;
            text-align: left;
          }
          .thank-summary .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 1.05em;
          }
          .thank-summary .row strong {
            color: #42376E;
          }
          .thank-summary .total {
            border-top: 1px solid #e0e0e0;
            margin-top: 16px;
            padding-top: 12px;
            font-size: 1.15em;
            font-weight: bold;
            color: #3689e7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='header'>
            <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
          </div>
          <main>
            <h1>¡Gracias por tu Compra!</h1>
            <p>Hola${data.user?.nombre ? `, ${data.user.nombre}` : ''}:</p>
            <p>Queremos agradecerte por realizar tu compra con ${process.env.BRAND_NAME}. Tu pago ha sido confirmado.</p>
            <div class="thank-summary">
              <h2>Resumen de tu Pedido</h2>
              <div class="row">
                <span><strong>Libro:</strong></span>
                <span>${data.book?.titulo ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Vendedor:</strong></span>
                <span>${data.seller?.nombre ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>ID Transacción:</strong></span>
                <span>${data.transaction?.id ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Fecha:</strong></span>
                <span>${data.transaction?.response?.date_created ? new Date(data.transaction.response.date_created).toLocaleString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : new Date().toLocaleString('es-CO')}</span>
              </div>
              <div class="row">
                <span><strong>Método de pago:</strong></span>
                <span>${data.transaction?.response?.payment_method_id ?? 'N/A'}</span>
              </div>
              <div class="row total">
                <span><strong>Total pagado:</strong></span>
                <span>$${data.transaction?.response?.transaction_amount ?? 'N/A'}</span>
              </div>
            </div>
            <p>Pronto recibirás más información sobre tu pedido.</p>
            <p>Si necesitas más ayuda, por favor contáctanos.</p>
            <p>Atentamente,</p>
            <p>El equipo de ${process.env.BRAND_NAME}</p>
          </main>
          ${footer}
        </div>
      </body>
    </html>
    `
}
const bookSoldTemplate = (data: DataType) => {
  return `
    <html>
      <head>
        <style>
          ${styles}
          .sold-summary {
            margin: 30px auto;
            max-width: 420px;
            border-radius: 8px;
            background: #f8f8fc;
            padding: 24px 18px;
            box-shadow: 0 2px 8px rgba(66,55,110,0.07);
          }
          .sold-summary h2 {
            color: #42376E;
            margin-bottom: 18px;
            text-align: left;
          }
          .sold-summary .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 1.05em;
          }
          .sold-summary .row strong {
            color: #42376E;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='header'>
            <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
          </div>
          <main>
            <h1>¡Tu libro se ha vendido!</h1>
            <p>Hola${data.user?.nombre ? `, ${data.user.nombre}` : ''}:</p>
            <p>Nos complace informarte que tu libro <strong>${data.book?.titulo ?? 'N/A'}</strong> ha sido vendido exitosamente en ${process.env.BRAND_NAME}.</p>
            <div class="sold-summary">
              <h2>Detalles de la Venta</h2>
              <div class="row">
                <span><strong>Comprador:</strong></span>
                <span>${data.seller?.nombre ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Guía de envío:</strong></span>
                <span>${data.metadata?.guia ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Fecha de la compra:</strong></span>
                <span>${data.transaction?.response?.date_created ? new Date(data.transaction.response.date_created).toLocaleString('es-CO', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                }) : new Date().toLocaleString('es-CO')}</span>
              </div>
              <div class="row">
                <span><strong>Libro vendido:</strong></span>
                <span>${data.book?.titulo ?? 'N/A'}</span>
              </div>
            </div>
            <p>Por favor, prepáralo para el envío lo antes posible y llévalo al punto de "Empresa" más cercano.</p>
            <p>Si necesitas ayuda con el proceso de envío o tienes alguna pregunta, no dudes en contactarnos.</p>
          </main>
          ${footer}
        </div>
      </body>
    </html>
  `
}
const efectyPendingPaymentTemplate = (data: DataType) => {
  return `
    <html>
      <head>
        <style>
          ${styles}
          .efecty-summary {
            margin: 30px auto;
            max-width: 420px;
            border-radius: 8px;
            background: #f8f8fc;
            padding: 24px 18px;
            box-shadow: 0 2px 8px rgba(66,55,110,0.07);
          }
          .efecty-summary h2 {
            color: #42376E;
            margin-bottom: 18px;
            text-align: left;
          }
          .efecty-summary .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 1.05em;
          }
          .efecty-summary .row strong {
            color: #42376E;
          }
          .efecty-summary .total {
            border-top: 1px solid #e0e0e0;
            margin-top: 16px;
            padding-top: 12px;
            font-size: 1.15em;
            font-weight: bold;
            color: #3689e7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='header'>
            <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
          </div>
          <main>
            <h1>¡Gracias por tu compra${data?.user?.nombre ? `, ${data.user.nombre}` : ''}!</h1>
            <p>Para completar tu pedido, realiza el pago en cualquier sucursal de <strong>Efecty</strong> antes de la fecha de vencimiento.</p>
            <div class="efecty-summary">
              <h2>Detalles de Pago en Efecty</h2>
              
              
              <div class="row">
                <span><strong>Código de pago:</strong></span>
                <span>${data.metadata?.barcode?.content ?? 'N/A'}</span>
              </div>
              <div class="row">
                <span><strong>Vencimiento:</strong></span>
                <span>${
                  data.metadata?.date_of_expiration
                    ? new Date(data.metadata.date_of_expiration).toLocaleString('es-CO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'N/A'
                }</span>
              </div>
              <div class="row total">
                <span><strong>Monto a pagar:</strong></span>
                <span>$${data.transaction?.response?.transaction_amount ?? 'N/A'}</span>
              </div>
            </div>
            <p>Indica al operador de Efecty que deseas realizar un pago y proporciona el código de pago junto con el monto exacto.</p>
            <p>Si necesitas ayuda con el proceso de pago o tienes alguna pregunta, no dudes en contactarnos.</p>
          </main>
          ${footer}
        </div>
      </body>
    </html>
  `
}
const messageQuestionTemplate = (data: DataType) => {
  return `
    <html>
      <head>
        <style>
          ${styles}
          .question-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background: #f8f8fc;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(66,55,110,0.07);
          }
          .question-table th, .question-table td {
            padding: 14px 18px;
            text-align: left;
          }
          .question-table th {
            background: #42376E;
            color: #fff;
            font-weight: 600;
            border-bottom: 2px solid #e0e0e0;
          }
          .question-table td {
            color: #333;
            border-bottom: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='header'>
            <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
          </div>
          <main>
            <h1>¡Tienes un nuevo mensaje!</h1>
            <p>Hola ${data.user?.nombre ?? ''}:</p>
            <p>Has recibido una nueva pregunta de un usuario interesado en tu libro <a href=${process.env.FRONTEND_URL}/libros/${data?.book?.id}>"${data.book?.titulo}".</a></p>
            <table class="question-table">
              <tr>
                <th>Pregunta</th>
                <td>${data.metadata?.pregunta ?? 'N/A'}</td>
              </tr>
            </table>
            <p>Para responder a este mensaje, por favor visita tus notificaciones en ${process.env.BRAND_NAME}.</p>
            <p>Si necesitas ayuda con el proceso de pago o tienes alguna pregunta, no dudes en contactarnos.</p>
          </main>
          ${footer}
        </div>
      </body>
    </html>
  `
}
const messageResponseTemplate = (data: DataType) => {
  return `
    <html>
      <head>
        <style>
          ${styles}
          .question-table {
            width: 100%;
            border-collapse: collapse;
            margin: 24px 0;
            background: #f8f8fc;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(66,55,110,0.07);
          }
          .question-table th, .question-table td {
            padding: 14px 18px;
            text-align: justify;
          }
          .question-table th {
            background: #42376E;
            color: #fff;
            font-weight: 600;
            border-bottom: 2px solid #e0e0e0;
          }
          .question-table td {
            color: #333;
            border-bottom: 1px solid #e0e0e0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class='header'>
            <img src='${logoMeridian}' alt='Logo de ${process.env.BRAND_NAME}' title='Logo de ${process.env.BRAND_NAME}'/>
          </div>
          <main>
            <h1>¡Tienes una nueva respuesta!</h1>
            <p>Hola ${data.user?.nombre ?? ''}:</p>
            <p>Has recibido una respuesta a tu pregunta sobre el libro <a href=${process.env.FRONTEND_URL}/libros/${data?.book?.id}>"${data.book?.titulo}".</a></p>
            <table class="question-table">
              <tr>
                <th>Tu pregunta</th>
                <td>${data.metadata?.pregunta ?? 'N/A'}</td>
              </tr>
              <tr>
                <th>Respuesta</th>
                <td>${data.metadata?.respuesta ?? 'N/A'}</td>
              </tr>
            </table>
            <p>Para ver más detalles, visita tus notificaciones en ${process.env.BRAND_NAME}.</p>
            <p>Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos.</p>
          </main>
          ${footer}
        </div>
      </body>
    </html>
  `
}
const templates = [ thankEmailTemplate, bookPublishedTemplate, 
  validationEmailTemplate, changePasswordTemplate,
paymentDoneBillTemplate, paymentDoneThankTemplate,
bookSoldTemplate, efectyPendingPaymentTemplate,
messageQuestionTemplate, messageResponseTemplate
]

export { templates, 
  thankEmailTemplate, bookPublishedTemplate, 
  validationEmailTemplate, changePasswordTemplate,
  paymentDoneBillTemplate, paymentDoneThankTemplate,
  bookSoldTemplate, efectyPendingPaymentTemplate,
  messageQuestionTemplate, messageResponseTemplate, 
DataType}