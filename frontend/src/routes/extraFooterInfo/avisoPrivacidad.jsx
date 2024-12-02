
import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

const PrivacyPolicy = () => {

    return (
        <>
        <Header />
        <div className="extraFooterInfoContainer">
            <h1>Aviso de Privacidad</h1>
            <p><strong>Fecha de la última revisión:</strong> 20 de noviembre de 2024</p>

            <p>
                De acuerdo con la Ley Estatutaria 1581 de 2012 de Protección de Datos, la Ley 1266 de 2008,
                la Circular Única de la Superintendencia de Industria y Comercio título V, sus decretos reglamentarios
                y demás disposiciones aplicables y concordantes, te informamos, tal como se define en los
                <strong> Términos y Condiciones</strong> de los sitios web, acerca de la existencia de las políticas de tratamiento
                de información indicadas a continuación, la forma de acceder a las mismas, las finalidades del
                tratamiento que se pretende dar a los datos personales y los derechos que le asisten a los titulares
                de los datos.
            </p>

            <p>
                <strong>Meridian Colombia, S.A.S.</strong> (en adelante, “Meridian”), administrador del sitio www.meridianbooks.co
                y las aplicaciones disponibles para dispositivos móviles (en adelante y conjuntamente, los “Sitios”),
                trabaja de manera constante para resguardar y garantizar la seguridad de tu información personal en nuestros sistemas.
            </p>

            <h2>1. Responsable del Tratamiento</h2>
            <p>
                El responsable del tratamiento es quien decide la finalidad para la que se utilizan sus datos personales:
            </p>
            <p>
                <strong>Meridian Colombia, S.A.S.</strong><br />
                Domicilio: Calle 117 nº 6a-60 Oficina 502 - Bogotá<br />
                Teléfono de contacto: 310 302 0306<br />
                Dirección de correo electrónico: protecciondedatos@meridianbooks.co
            </p>

            <h2>2. Recopilación y Tratamiento de los Datos</h2>
            <p>
                Meridian recolecta, usa y comparte tu información obtenida en línea y fuera de línea.
                El uso de los servicios ofrecidos en los Sitios (en adelante, los “Servicios”) indica
                que has aceptado la <strong>Política de Tratamiento de la Información</strong>, en los términos y condiciones
                señalados en este aviso.
            </p>

            <h3>2.1 Naturaleza de los Datos y Finalidad del Tratamiento</h3>
            <p>Meridian puede recopilar y procesar los siguientes datos personales:</p>
            <ul>
                <li>
                    Datos para el registro como usuario: Nombre, apellidos, email, contraseña, entre otros.
                    Finalidad: gestionar el alta como usuario registrado y permitir el acceso a funcionalidades
                    personalizadas.
                </li>
                <li>
                    Datos para compras: Nombre, dirección, teléfono y datos bancarios.
                    Finalidad: formalizar compras, gestionar envíos y comunicaciones relacionadas con los productos adquiridos.
                </li>
                <li>
                    Datos para el formulario de contacto: Datos de contacto y detalles de consulta.
                    Finalidad: atender solicitudes y enviar comunicaciones comerciales relacionadas con libros usados.
                </li>
                <li>
                    Datos de navegación: Información sobre visitas al sitio, tráfico, preferencias.
                    Finalidad: mejorar la accesibilidad, personalizar contenido y analizar hábitos de consumo.
                </li>
            </ul>

            <p>
                La base que legitima el tratamiento de los datos será tu autorización previa y expresa
                que se recoge una vez se te ha informado acerca de los detalles del tratamiento.
            </p>

            <h2>3. Seguridad y Conservación de Datos</h2>
            <p>
                Meridian adopta medidas físicas, tecnológicas y administrativas para garantizar la seguridad
                de tus datos. Sin embargo, no podemos garantizar completamente la seguridad de los datos transmitidos
                por internet.
            </p>
            <p>
                Los datos serán almacenados mientras sean necesarios para las finalidades indicadas o hasta que solicites
                su supresión, salvo cuando exista un deber legal de conservación.
            </p>

            <h2>4. Derechos del Titular de los Datos</h2>
            <p>
                Como titular de tus datos, tienes derecho a conocer, actualizar, rectificar, solicitar
                la eliminación de tus datos y revocar tu autorización, entre otros, conforme a la Ley 1581 de 2012.
            </p>

            <h2>5. Cambios en el Aviso de Privacidad</h2>
            <p>
                Meridian se reserva el derecho de modificar este aviso en cualquier momento. Cualquier cambio será
                notificado a través de los Sitios y se te solicitará una nueva autorización si corresponde.
            </p>

            <h2>Contacto</h2>
            <p>
                Para consultas sobre este aviso, comunícate al correo: <strong><a href="mailto:soporte@meridian.com">protecciondedatos@meridianbooks.co</a></strong>.
            </p>

            
        </div>
        <SideInfo />
        <Footer />
        </>
    );
};

export default PrivacyPolicy;
