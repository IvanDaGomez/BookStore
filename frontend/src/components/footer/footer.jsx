
import FooterInfo from '../footerInfo/footerInfo.jsx'
import { handleSubmitEmail } from './handleSubmitEmail'
const Footer = () => {
  // const AppStoreIcon = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={40} height={40} color={"#ffffff"} fill={"none"}><path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M11 7L12 8.66667M17 17L13.4 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 7L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6.5 14H12.5M17.5 14L15.5 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  const footerSections = [
    {
      title: 'Explora',
      components: [
        {
          name: 'Categorías de Libros',
          href: '/categories',
        },
        {
          name: 'Más Vendidos',
          href: '/best-sellers',
        },
        {
          name: 'Nuevas Llegadas',
          href: '/new-arrivals',
        },
        {
          name: 'Ofertas Especiales',
          href: '/sale',
        },
        {
          name: 'Eventos y Firmas',
          href: '/events',
        }
      ]
    },
    {
      title: 'Nosotros',
      components: [
          {
            name: 'Sobre Nosotros',
            href: '/sobre-nosotros',
          },
          {
            name: 'Preguntas Frecuentes',
            href: '/faq',
          },
          {
            name: 'Contáctanos',
            href: '/contacto',
          }
        ]
    },
    {
      title: 'Legal',
      components: [
        {
          name: 'Términos y Condiciones',
          href: '/terminos-y-condiciones',
        },
        {
          name: 'Aviso de Privacidad',
          href: '/aviso-de-privacidad',
        },
        {
          name: 'Uso de Cookies',
          href: '/uso-cookies',
        },
        {
          name: 'Política de Datos Personales',
          href: '/politica-de-datos-personales',
        },
        {
          name: 'Lista de Costes',
          href: '/lista-costes',
        }
      ]
    }
  ]
  return (<>
    <footer className='footer'>
      <div className='footer-content'>
        <div className='footer-section brand'>
          <h1>Meridian</h1>
          <p>
            Leer es poder
          </p>
          {/* Realizar la app
          <div className="app-buttons">
            <button className="app-button">{AppStoreIcon}App Store</button>
            <button className="app-button"><img src="/playstorelogo.png"/> Google Play</button>
          </div>
          */}
        </div>

        {footerSections.map((section, index) => (
          <div className='footer-section' key={index}>
            <h2>{section.title}</h2>
            <ul>
              {section.components.map((component, index) => (
                <li key={index}>
                  <a href={component.href}>{component.name}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className='footer-bottom'>
        <div className='newsletter'>
          <form onSubmit={handleSubmitEmail} onKeyDown={(e) => e.key === 'Enter' ? handleSubmitEmail : ''}>
            <input type='email' name='email' className='inputFooter' placeholder='Escribe tu correo aquí' />
            <button type='submit'>Recibe novedades</button>
          </form>
        </div>
        <div className='social-icons'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={34} height={34} color='#ffffff' fill='none'>
            <path fillRule='evenodd' clipRule='evenodd' d='M6.18182 10.3333C5.20406 10.3333 5 10.5252 5 11.4444V13.1111C5 14.0304 5.20406 14.2222 6.18182 14.2222H8.54545V20.8889C8.54545 21.8081 8.74951 22 9.72727 22H12.0909C13.0687 22 13.2727 21.8081 13.2727 20.8889V14.2222H15.9267C16.6683 14.2222 16.8594 14.0867 17.0631 13.4164L17.5696 11.7497C17.9185 10.6014 17.7035 10.3333 16.4332 10.3333H13.2727V7.55556C13.2727 6.94191 13.8018 6.44444 14.4545 6.44444H17.8182C18.7959 6.44444 19 6.25259 19 5.33333V3.11111C19 2.19185 18.7959 2 17.8182 2H14.4545C11.191 2 8.54545 4.48731 8.54545 7.55556V10.3333H6.18182Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
          </svg>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={34} height={34} color='#ffffff' fill='none'>
            <path d='M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={34} height={34} color='#ffffff' fill='none'>
            <path d='M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z' stroke='currentColor' strokeWidth='1.5' strokeLinejoin='round' />
            <path d='M16.5 12C16.5 14.4853 14.4853 16.5 12 16.5C9.51472 16.5 7.5 14.4853 7.5 12C7.5 9.51472 9.51472 7.5 12 7.5C14.4853 7.5 16.5 9.51472 16.5 12Z' stroke='currentColor' strokeWidth='1.5' />
            <path d='M17.5078 6.5L17.4988 6.5' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </div>
      </div>
    </footer>
    <FooterInfo />
    </>
  )
}

export default Footer
