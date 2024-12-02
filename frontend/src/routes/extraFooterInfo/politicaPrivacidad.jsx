import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function PoliticaPrivacidad() {
    return (
        <>
        <Header />
        <div className="extraFooterInfoContainer">
            <h1>Política de Privacidad</h1>

            <h2>1. Introducción</h2>
            <p>
                En Meridian, respetamos tu privacidad y estamos comprometidos a proteger tus datos personales.
                Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos tu información
                cuando usas nuestro sitio web y servicios.
            </p>

            <h2>2. Información que Recopilamos</h2>
            <p>
                Podemos recopilar la siguiente información personal cuando interactúas con nuestro sitio web:
            </p>
            <ul>
                <li><strong>Datos personales:</strong> Nombre, correo electrónico, dirección, etc.</li>
                <li><strong>Datos de uso:</strong> Información sobre cómo usas nuestro sitio web, como páginas visitadas, tiempo de navegación, etc.</li>
                <li><strong>Cookies:</strong> Utilizamos cookies para mejorar la experiencia de usuario y analizar el tráfico en el sitio.</li>
            </ul>

            <h2>3. Cómo Usamos Tu Información</h2>
            <p>
                Utilizamos la información recopilada para:
            </p>
            <ul>
                <li>Proporcionar, operar y mantener nuestro sitio web y servicios.</li>
                <li>Mejorar, personalizar y expandir nuestros servicios.</li>
                <li>Comunicarnos contigo, incluyendo para responder a tus solicitudes y enviarte notificaciones importantes.</li>
                <li>Analizar el uso de nuestros servicios para mejorar la calidad y la experiencia del usuario.</li>
            </ul>

            <h2>4. Compartir y Divulgar Tu Información</h2>
            <p>
                No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en las siguientes circunstancias:
            </p>
            <ul>
                <li>Cuando sea necesario para proporcionar nuestros servicios, por ejemplo, con proveedores de servicios externos.</li>
                <li>Cuando sea requerido por la ley o en respuesta a un proceso legal.</li>
                <li>Para proteger nuestros derechos, propiedad o la seguridad de nuestros usuarios.</li>
            </ul>

            <h2>5. Tus Derechos</h2>
            <p>
                Dependiendo de tu ubicación, tienes ciertos derechos con respecto a tus datos personales, incluidos:
            </p>
            <ul>
                <li>Derecho a acceder a tus datos personales.</li>
                <li>Derecho a corregir datos incorrectos o incompletos.</li>
                <li>Derecho a eliminar o restringir el procesamiento de tus datos.</li>
                <li>Derecho a oponerte al procesamiento de tus datos en ciertas circunstancias.</li>
            </ul>
            <p>
                Para ejercer estos derechos, por favor contáctanos a través de los medios indicados en esta política.
            </p>

            <h2>6. Seguridad de los Datos</h2>
            <p>
                Tomamos medidas razonables para proteger la información personal que recopilamos, pero no podemos garantizar
                la seguridad absoluta de los datos transmitidos por Internet.
            </p>

            <h2>7. Cambios a Esta Política</h2>
            <p>
                Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos sobre cualquier cambio importante
                publicando la nueva política en esta página. Te recomendamos que revises esta política regularmente para
                estar informado sobre cómo protegemos tu información.
            </p>

            <p className="actualizacionFecha"><strong>Fecha de última actualización:</strong> 20 de noviembre de 2024</p>
        </div>
        <Footer />
        <SideInfo />
        </>
    );
}
