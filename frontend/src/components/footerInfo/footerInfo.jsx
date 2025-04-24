import useUpdateBreakpoint from '../../assets/useUpdateBreakPoint'
import './footerInfo.css'
export default function FooterInfo () {
  const isMobile = useUpdateBreakpoint(734)
  const contact = () => <div className='contact'>
  <a target='_blank' href="https://www.ivangomez.dev"><span>Contáctame</span>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={16} height={16} color={"#000000"} fill={"none"}><path d="M20.0001 11.9998L4.00012 11.9998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
</div>
  const allRightsReserved = () => <div className='allRightsReserved'>
  <span>© 2025 Ivan Gomez. Todos los derechos reservados.</span>
</div>
  const email = () => <a href="mailto:ivandavidgomezsilva@hotmail.com"><div className="email">
  <span>ivandavidgomezsilva@hotmail.com</span>
</div></a>
  const developedBy = () => <div className='developedBy'>
  <span>Desarrollado por: <a target='_blank' href="www.ivangomez.dev" className='accent'>Ivan Gomez</a></span>
  </div>
  return (
    <div className='footerInfo'>
      {isMobile ?
      <>
      {developedBy()}
      {contact()}
      {email()}
      {allRightsReserved()}
      </>:
      <>
      {allRightsReserved()}
      {contact()}
      {email()}
      {developedBy()}
      
      
      
      </>
    }
      
    </div>
  )
}