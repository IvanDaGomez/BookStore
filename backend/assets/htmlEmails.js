import dotenv from 'dotenv'
dotenv.config()
function createEmail (data, template) {
  switch (template) {
    case 'thankEmail': {
      return `
        <html>
            <head>
            <style>
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
                color: #4CAF50;
                text-align: center;
                }
                p {
                font-size: 1.1em;
                line-height: 1.6;
                }
                .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
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
                color: #4CAF50;
                text-align: center;
                }
                p {
                font-size: 1.1em;
                line-height: 1.6;
                }
                .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
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
            </style>
            </head>
            <body>
            <div class="container">
                <h1>Tu libro ha sido publicado con éxito!</h1>
                <p>Hola <strong>${data.vendedor}</strong>,</p>
                <p>Felicidades! Tu libro "<strong>${data.titulo}</strong>" ha sido publicado exitosamente en nuestra plataforma.</p>
                <p>Estamos emocionados de compartir tu publicación con nuestros amantes de libros!. TU libro ya se puede buscar y está listo para ser vendido.</p>
                <p>Puedes ver tu libro aquí:</p>
                <p><a href="${process.env.FRONTEND_URL}/libros/${data._id}" class="button">Ver libro</a></p>
                <div class="footer">
                <p>Si tienes preguntas o necesitas asistencia, contáctate con <a href="mailto:support@meridianbookstore.com">nosotros</a>.</p>
                </div>
            </div>
            </body>
        </html>
        `
    }
  }
}

export { createEmail }
