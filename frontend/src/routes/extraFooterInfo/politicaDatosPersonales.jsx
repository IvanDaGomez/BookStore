import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function PoliticaDatosPersonales() {
    return (
        <><Header />
        <div className="extraFooterInfoContainer">
            <h1>Política de Tratamiento de Datos Personales</h1>
            <p><strong>Fecha de última actualización:</strong> 20 de noviembre de 2024</p>

            <h2>1. Introducción</h2>
            <p>
                En cumplimiento de la Ley Estatutaria 1581 de 2012, la Ley 1266 de 2008, y demás disposiciones
                aplicables sobre protección de datos personales, Meridian Colombia, S.A.S. (en adelante, “Meridian”),
                establece la presente política para garantizar la protección y adecuada gestión de los datos personales
                recopilados en sus operaciones.
            </p>

            <h2>2. Responsable del Tratamiento</h2>
            <p>
                <strong>Meridian Colombia, S.A.S.</strong><br />
                Dirección: Calle 117 nº 6a-60 Oficina 502 - Bogotá<br />
                Teléfono: 310 302 0306<br />
                Correo electrónico: protecciondedatos@meridianbooks.co
            </p>

            <h2>3. Finalidades del Tratamiento de Datos</h2>
            <p>Los datos personales serán tratados para los siguientes fines:</p>
            <ul>
                <li>Gestionar la relación contractual y comercial con los usuarios.</li>
                <li>Procesar la compra y venta de libros usados a través de nuestros sitios.</li>
                <li>Ofrecer soporte al cliente y gestionar solicitudes relacionadas con nuestros servicios.</li>
                <li>Enviar información promocional y comercial, previa autorización.</li>
                <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>

            <h2>4. Derechos del Titular de los Datos</h2>
            <p>
                De acuerdo con la legislación aplicable, como titular de los datos personales tienes derecho a:
            </p>
            <ul>
                <li>Conocer, actualizar y rectificar tus datos personales.</li>
                <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
                <li>Ser informado acerca del uso que se ha dado a tus datos.</li>
                <li>Presentar quejas ante la Superintendencia de Industria y Comercio en caso de infracciones.</li>
                <li>Revocar la autorización y/o solicitar la eliminación de los datos.</li>
            </ul>

            <h2>5. Procedimiento para Ejercer tus Derechos</h2>
            <p>
                Para ejercer cualquiera de tus derechos, puedes comunicarte al correo electrónico:
                <strong> protecciondedatos@meridianbooks.co</strong>, indicando tu solicitud de manera detallada.
            </p>

            <h2>6. Seguridad de los Datos</h2>
            <p>
                Meridian adopta medidas técnicas, administrativas y organizativas para proteger la información personal
                frente a acceso no autorizado, pérdida, alteración o destrucción.
            </p>

            <h2>7. Modificaciones a la Política</h2>
            <p>
                Meridian se reserva el derecho de actualizar esta política en cualquier momento. Las actualizaciones
                serán notificadas a través de los canales correspondientes y publicadas en nuestros sitios web.
            </p>

            <p><strong>Fecha de entrada en vigor:</strong> 20 de noviembre de 2024</p>
        </div>
        <Footer />
        <SideInfo />
        </>
    );
}
