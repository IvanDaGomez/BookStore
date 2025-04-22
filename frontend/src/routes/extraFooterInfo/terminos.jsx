import Footer from '../../components/footer'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'

export default function TerminosYCondiciones () {
  return (
    <>
      <Header />
      <div className='extraFooterInfoContainer'>
        <h1>Términos y Condiciones de Uso</h1>
        <h1><big>Meridian</big></h1>

        <div className='extraFooterInfoContainer'>
          <section>
            <h2>1. Introducción</h2>
            <p>
              Bienvenido a <strong>Meridian</strong>, una plataforma para la compra y venta de libros nuevos y usados. Al utilizar nuestro sitio, aceptas los términos aquí descritos. Si no estás de acuerdo, te pedimos no utilizar nuestros servicios.
            </p>
          </section>
          <section>
            <h2>2. Uso de la Plataforma</h2>
            <ul>
              <li>Los usuarios deben registrarse proporcionando información veraz.</li>
              <li>
                <strong>Prohibiciones:</strong> No está permitido listar contenido ofensivo, ilegal o que no corresponda a libros.
              </li>
            </ul>
          </section>
          <section>
            <h2>3. Funcionalidad del Servicio</h2>
            <ul>
              <li><strong>Para compradores:</strong> Los libros se adquieren tal cual se describen en la publicación del vendedor.</li>
              <li><strong>Para vendedores:</strong> Eres responsable de garantizar la veracidad de la descripción y el estado del libro.</li>
              <li>
                <strong>Transacciones:</strong> Meridian facilita el espacio para conectar a compradores y vendedores, pero no garantiza ni es responsable del cumplimiento de las condiciones pactadas entre las partes.
              </li>
            </ul>
          </section>
          <section>
            <h2>4. Pagos y Comisiones</h2>
            <ul>
              <li>
                La plataforma puede aplicar comisiones por las ventas realizadas. Dichas comisiones se informarán al momento de la transacción.
              </li>
              <li>
                Los pagos se procesan a través de métodos seguros, y los vendedores recibirán el monto acordado menos la comisión aplicable.
              </li>
            </ul>
          </section>
          <section>
            <h2>5. Envíos y Entregas</h2>
            <ul>
              <li>
                Los vendedores deben garantizar un empaque adecuado y el envío del libro dentro del tiempo acordado.
              </li>
              <li>
                Los compradores son responsables de proporcionar datos correctos para la entrega.
              </li>
            </ul>
          </section>
          <section>
            <h2>6. Garantías y Reembolsos</h2>
            <ul>
              <li>
                Dado que los libros usados pueden presentar desgaste, los compradores deben revisar detalladamente las descripciones.
              </li>
              <li>
                Los reembolsos se evaluarán caso por caso, dependiendo de las circunstancias (ej.: daño no reportado).
              </li>
            </ul>
          </section>
          <section>
            <h2>7. Limitación de Responsabilidad</h2>
            <p>
              Meridian no se hace responsable por:
            </p>
            <ul>
              <li>Pérdida o daño de productos durante el envío.</li>
              <li>Incumplimiento de los términos entre compradores y vendedores.</li>
            </ul>
          </section>
          <section>
            <h2>8. Privacidad y Datos</h2>
            <p>
              El uso de datos personales se regula conforme a nuestro <a href='/aviso-de-privacidad'>Aviso de Privacidad</a>, garantizando su protección.
            </p>
          </section>
          <section>
            <h2>9. Cambios a los Términos y Condiciones</h2>
            <p>
              Nos reservamos el derecho a modificar estos términos en cualquier momento. Las actualizaciones se comunicarán en la plataforma.
            </p>
          </section>
          <section>
            <h2>10. Contacto</h2>
            <p>
              Para dudas o soporte, puedes escribirnos a <a href='mailto:soporte@meridian.com'>soporte@meridian.com</a>.
            </p>
          </section>
          <p><strong>Fecha de la última revisión:</strong> 20 de noviembre de 2024</p>
        </div>
      </div>
      <SideInfo />
      <Footer />
    </>
  )
}
