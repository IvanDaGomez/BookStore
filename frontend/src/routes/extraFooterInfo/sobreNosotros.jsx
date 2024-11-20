import Footer from "../../components/footer";
import Header from "../../components/header";
import SideInfo from "../../components/sideInfo";

export default function SobreNosotros() {
    return (
        <>
        <Header/>
        <div className="extraFooterInfoContainer">
            <h1>Sobre Nosotros</h1>
            <p>
                En Meridian, nuestra misión es proporcionar soluciones innovadoras que mejoren la vida
                de nuestros clientes. Desde nuestra fundación en 2024, nos hemos comprometido a ofrecer
                productos/servicios de alta calidad que se adaptan a las necesidades cambiantes del mercado.
            </p>

            <h2>Nuestra Historia</h2>
            <p>
                [Nombre de la Empresa] fue fundada por [nombre del fundador] con la visión de [breve descripción de la visión inicial].
                A lo largo de los años, hemos crecido y evolucionado, consolidándonos como un líder en [industria o sector].
                Nuestro enfoque ha sido siempre mantener un fuerte compromiso con la innovación, la calidad y la satisfacción del cliente.
            </p>

            <h2>Nuestros Valores</h2>
            <ul>
                <li><strong>Integridad:</strong> Actuamos con honestidad y ética en todas nuestras relaciones comerciales.</li>
                <li><strong>Innovación:</strong> Buscamos constantemente formas de mejorar y ofrecer nuevas soluciones a nuestros clientes.</li>
                <li><strong>Compromiso:</strong> Estamos dedicados a proporcionar un servicio excepcional y una experiencia memorable.</li>
            </ul>

            <h2>El Equipo</h2>
            <p>
                Nuestro equipo está compuesto por profesionales apasionados y experimentados que trabajan incansablemente para
                cumplir nuestra misión. Desde nuestros fundadores hasta cada miembro de nuestro equipo, todos compartimos una
                visión común: lograr la excelencia en todo lo que hacemos.
            </p>

            <h2>Visión a Futuro</h2>
            <p>
                A medida que avanzamos hacia el futuro, nos comprometemos a seguir expandiendo nuestra presencia en el mercado
                global, manteniendo siempre nuestra promesa de innovación y excelencia.
            </p>

            <p>
                Gracias por visitarnos. Estamos emocionados de poder servirte y ayudarte a lograr [beneficio que ofrecen sus productos/servicios].
            </p>
        </div>
        <Footer/>
        <SideInfo />
        </>
    );
}
