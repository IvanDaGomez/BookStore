import { useState } from 'react'
import Footer from '../../components/footer/footer.jsx'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
// ARREGLAR EL BUG DE QUE SE ABRE TODOS LOS INDICES
export default function Faq () {
  const frequentlyAsked = [
    {
      title: 'Envío',
      questions: [
        {
          title: '¿Qué precio tiene el envío?',
          answer: 'El precio del envío depende de tu ubicación y del tamaño del pedido. Puedes calcular el costo de envío al finalizar la compra.'
        },
        {
          title: '¿En qué países realizamos envíos?',
          answer: 'Realizamos envíos a varios países alrededor del mundo. Consulta nuestra página de envíos internacionales para más detalles.'
        },
        {
          title: '¿Cómo puedo hacer el seguimiento de mi envío?',
          answer: 'Una vez que tu pedido haya sido enviado, recibirás un correo electrónico con un número de seguimiento que podrás utilizar en el sitio web del servicio de mensajería.'
        },
        {
          title: '¿Cuánto tiempo tarda en llegar mi pedido?',
          answer: 'El tiempo de entrega depende de la ubicación y del tipo de envío que elijas. Por lo general, los envíos nacionales tardan entre 3 y 7 días hábiles.'
        },
        {
          title: '¿Puedo cambiar la dirección de envío después de realizar el pedido?',
          answer: 'Una vez que el pedido ha sido procesado y enviado, no es posible cambiar la dirección de envío. Sin embargo, puedes intentar contactarnos lo antes posible para revisar posibles soluciones.'
        }
      ]
    },
    {
      title: 'Cuenta',
      questions: [
        {
          title: '¿Cómo puedo crear una cuenta?',
          answer: 'Haz clic en el botón de "Registrarse" en la esquina superior derecha de nuestra página de inicio, completa los campos requeridos y haz clic en "Crear cuenta".'
        },
        {
          title: 'Olvidé mi contraseña, ¿qué debo hacer?',
          answer: 'Haz clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Recibirás un correo para restablecerla.'
        },
        {
          title: '¿Cómo puedo cambiar mi dirección de correo electrónico?',
          answer: 'Para cambiar tu correo electrónico, inicia sesión en tu cuenta, ve a "Configuración de cuenta" y actualiza tu correo en la sección de "Información personal".'
        },
        {
          title: '¿Puedo eliminar mi cuenta?',
          answer: 'Sí, si deseas eliminar tu cuenta, puedes hacerlo desde la sección de "Configuración" o contactando con nuestro soporte.'
        }
      ]
    },
    {
      title: 'Pedidos',
      questions: [
        {
          title: '¿Puedo modificar mi pedido después de realizarlo?',
          answer: 'Una vez que un pedido ha sido confirmado y procesado, no es posible modificarlo. Sin embargo, puedes cancelarlo dentro de las primeras 24 horas y realizar uno nuevo.'
        },
        {
          title: '¿Cómo puedo cancelar mi pedido?',
          answer: 'Si aún no ha sido enviado, puedes cancelar tu pedido desde tu cuenta en la sección "Mis Pedidos". Si ya fue enviado, tendrás que rechazarlo al momento de la entrega.'
        },
        {
          title: '¿Por qué mi pedido fue cancelado?',
          answer: 'El pedido puede haber sido cancelado por varias razones, como problemas con el pago, falta de existencias o problemas en la dirección de envío. Te notificaremos por correo electrónico si esto sucede.'
        },
        {
          title: '¿Puedo agregar más productos a un pedido ya realizado?',
          answer: 'No es posible agregar productos a un pedido después de que haya sido confirmado. Si deseas más productos, tendrás que hacer un nuevo pedido.'
        }
      ]
    },
    {
      title: 'Devoluciones y Reembolsos',
      questions: [
        {
          title: '¿Cuál es la política de devoluciones?',
          answer: 'Puedes devolver los productos dentro de los 30 días posteriores a la compra para un reembolso completo. El producto debe estar en su estado original y sin usar.'
        },
        {
          title: '¿Cómo puedo devolver un artículo?',
          answer: 'Para devolver un artículo, inicia sesión en tu cuenta, ve a "Mis Pedidos", selecciona el pedido y el artículo que deseas devolver, y sigue las instrucciones proporcionadas.'
        },
        {
          title: '¿Puedo devolver un artículo si ya lo abrí?',
          answer: 'Sí, los productos que han sido abiertos también pueden ser devueltos, siempre y cuando estén en su estado original y no sean productos personalizados o en oferta.'
        },
        {
          title: '¿Cuánto tiempo tarda en procesarse el reembolso?',
          answer: 'Una vez que recibimos el artículo devuelto y verificamos su estado, el reembolso se procesará en un plazo de 7 a 10 días hábiles.'
        }
      ]
    },
    {
      title: 'Pagos',
      questions: [
        {
          title: '¿Qué métodos de pago aceptan?',
          answer: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal, y otros métodos de pago en línea.'
        },
        {
          title: '¿Es seguro ingresar mis datos de pago en su sitio?',
          answer: 'Sí, utilizamos una conexión segura (SSL) para proteger todos los datos de pago y garantizar que tu información esté segura durante el proceso de pago.'
        },
        {
          title: '¿Puedo usar un cupón de descuento?',
          answer: 'Sí, puedes usar un cupón de descuento en el proceso de pago. Asegúrate de ingresar el código en el campo correspondiente para aplicar el descuento.'
        },
        {
          title: '¿Qué hago si mi pago fue rechazado?',
          answer: 'Si tu pago fue rechazado, asegúrate de que los datos de tu tarjeta estén correctos o intenta con otro método de pago. Si el problema persiste, contacta a tu banco o a nuestro soporte.'
        }
      ]
    },
    {
      title: 'Seguridad',
      questions: [
        {
          title: '¿Cómo sé que mi información está segura en su sitio?',
          answer: 'Utilizamos un cifrado SSL de 256 bits para garantizar la seguridad de tus datos personales y financieros. También seguimos las mejores prácticas de seguridad para protegerte.'
        },
        {
          title: '¿Qué hago si sospecho que alguien tiene acceso a mi cuenta?',
          answer: 'Si sospechas que tu cuenta ha sido comprometida, cambia tu contraseña de inmediato. Si tienes problemas, contáctanos y podemos ayudarte a proteger tu cuenta.'
        }
      ]
    }
  ]

  // Estado para controlar qué pregunta está expandida
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleAnswer = (index) => {
    // Si la misma pregunta se selecciona, se cierra. Si se selecciona una nueva, se abre
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <>
      <Header />
      <div className='faqContainer'>
        <h1>Preguntas frecuentes</h1>
        {frequentlyAsked.map((section, index) => (
          <div className='faqSection' key={index}>
            <h2>{section.title}</h2>
            <div className='faqSectionContainers'>
              {section.questions.map((faq, faqIndex) => (
                <div className='faqPair' key={faqIndex}>
                  <div className='faqQuestion' onClick={() => toggleAnswer(faqIndex)}>
                    <h3>{faq.title}</h3>
                  </div>
                  {/* Solo muestra la respuesta si la pregunta está activa */}
                  {activeIndex === faqIndex && (
                    <div className='faqAnswer'>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <Footer />
      <SideInfo />
    </>
  )
}
