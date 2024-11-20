import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function UsoDeCookies() {
    return (
        <>
        <Header />
        <div className="extraFooterInfoContainer">
            <h1>Política de Cookies</h1>
            <p><strong>Fecha de última actualización:</strong> 20 de noviembre de 2024</p>

            <h2>1. Introducción</h2>
            <p>
                Este sitio web utiliza cookies para mejorar la experiencia de usuario, analizar el tráfico y
                personalizar el contenido. La presente política detalla cómo utilizamos estas tecnologías y cómo
                puedes gestionarlas.
            </p>

            <h2>2. ¿Qué son las cookies?</h2>
            <p>
                Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo al visitar un sitio web.
                Sirven para recordar tus preferencias, optimizar el rendimiento del sitio y ofrecerte contenido
                personalizado.
            </p>

            <h2>3. Tipos de cookies que utilizamos</h2>
            <p>En nuestro sitio utilizamos las siguientes categorías de cookies:</p>
            <ul>
                <li>
                    <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio web, como el acceso
                    a áreas seguras.
                </li>
                <li>
                    <strong>Cookies de rendimiento:</strong> Recopilan información sobre cómo los usuarios interactúan
                    con nuestro sitio para mejorar su funcionalidad.
                </li>
                <li>
                    <strong>Cookies de funcionalidad:</strong> Recuerdan tus preferencias, como el idioma o la región.
                </li>
                <li>
                    <strong>Cookies de publicidad:</strong> Utilizadas para mostrar anuncios personalizados según tus
                    intereses.
                </li>
            </ul>

            <h2>4. Cómo gestionar las cookies</h2>
            <p>
                Puedes gestionar y deshabilitar las cookies a través de las configuraciones de tu navegador. Ten en
                cuenta que bloquear ciertas cookies puede afectar la funcionalidad del sitio.
            </p>
            <p>Enlaces para gestionar cookies en navegadores populares:</p>
            <ul>
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
                <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
                <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a></li>
            </ul>

            <h2>5. Cookies de terceros</h2>
            <p>
                Este sitio puede utilizar cookies de terceros, como Google Analytics, para recopilar estadísticas de
                uso. Consulta las políticas de privacidad de estos terceros para más información sobre cómo gestionan
                tus datos.
            </p>

            <h2>6. Cambios a esta política</h2>
            <p>
                Nos reservamos el derecho de actualizar esta política en cualquier momento. Recomendamos revisarla
                periódicamente para estar informado sobre cómo utilizamos las cookies.
            </p>

            <p><strong>Fecha de entrada en vigor:</strong> 20 de noviembre de 2024</p>
        </div>
        <Footer/>
        <SideInfo />
        </>
    );
}
