import dotenv from 'dotenv'
dotenv.config()

const styles = `
                :root{
                  --color: #42376E;
                }
                body {
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #f4f4f9;
                padding: 20px;
                
                }
                .container {
                width: 600px;
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
function createEmail (data, template) {
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
                <h1>Gracias por unirte a Meridian!</h1>
                <p>Hola <strong>${data.nombre}</strong>,</p>
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
                <h1>Tu libro ha sido publicado con éxito!</h1>
                <p>Hola <strong>${data.vendedor}</strong>,</p>
                <p>Felicidades! Tu libro "<strong>${data.titulo}</strong>" ha sido publicado exitosamente en nuestra plataforma.</p>
                <p>Estamos emocionados de compartir tu publicación con nuestros amantes de libros!. TU libro ya se puede buscar y está listo para ser vendido.</p>
                <p>Puedes ver tu libro aquí:</p>
                <a href="${process.env.FRONTEND_URL}/libros/${data._id}"><div class='button'>Ver libro</div></a>
                <div class="footer">
                <p>Si tienes preguntas o necesitas asistencia, contáctate con <a href="mailto:support@meridianbookstore.com">nosotros</a>.</p>
                </div>
            </div>
            </body>
        </html>
        `
    }
    case 'newQuestion': {
      return `
      <html>
            <head>
            <style>
                ${styles}
            </style>
            </head>
            <body>
            
                <div class='container'>
                  <h1>Tienes una nueva pregunta!</h1>
                  <p>Hola <strong>${data.vendedor}</strong>,</p>
                  <p>Un usuario tiene una pregunta sobre tu libro:</p>
                  <blockquote>
                    <p>${data.pregunta}</p>
                  </blockquote>
                  <p>Puedes responder a esta pregunta haciendo clic en el siguiente enlace:</p>
                  <p><a href="${process.env.FRONTEND_URL}/notificaciones/${data._id}">Responder pregunta</a></p>
                  <p>Si tienes otras preguntas o necesitas asistencia, puedes responder a este correo o contactarnos <a href="mailto:support@meridianbookstore.com">aquí</a>.</p>
                </div>

            </body>
        </html>
      `
    }
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
                  <h1>¡Validación de cuenta requerida!</h1>
                  <p>Hola <strong>${data.nombre}</strong>,</p>
                  <p>¡Gracias por registrarte en Meridian Bookstore!</p>
                  <p>El código de verificación es ${data.validationCode}</p>
                  <hr/>
                  <<p>Si no te registraste en Meridian Bookstore, ignora este correo o contáctanos para informarnos.</p>>
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
                  <h1>Solicitud para Cambiar Contraseña</h1>
                  <p>Hola <strong>${data.nombre}</strong>,</p>
                  <p>Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en Meridian Bookstore.</p>
                  <p>Por favor, pulsa el siguiente botón para completar el proceso de cambio de contraseña:</p>
                  <a href='${data.validationLink}'><div class='button'>Cambiar Contraseña</div></a>
                  <p>Este código es válido por 15 minutos.</p>
                  <hr/>
                  <p>Si no solicitaste este cambio, ignora este correo o contáctanos para informarnos.</p>
                  <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en responder a este correo o <a href="mailto:support@meridianbookstore.com">contactarnos aquí</a>.</p>
              </div>
          </body>
      </html>
      `
    }
  }
}

export { createEmail }
