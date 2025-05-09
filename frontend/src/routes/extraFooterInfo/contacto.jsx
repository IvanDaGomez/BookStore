import { useEffect, useRef, useState } from 'react'
import emailjs from '@emailjs/browser'
import Header from '../../components/header/header.jsx'
import SideInfo from '../../components/sideInfo'
import Footer from '../../components/footer/footer.jsx'
import { toast, ToastContainer } from 'react-toastify'

export default function Contacto () {
  const form = useRef()
  const [status, setStatus] = useState(null) // null, 'success', 'error'
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    const formElements = form.current.elements

    if (!formElements.from_name.value) {
      errors.from_name = <div className='errorContact'>El nombre es requerido</div>
    }
    if (!formElements.email.value) {
      errors.email = <div className='errorContact'>El correo es requerido</div>
    } else if (!/\S+@\S+\.\S+/.test(formElements.email.value)) {
      errors.email = <div className='errorContact'>El correo no es válido</div>
    }
    if (!formElements.message.value) {
      errors.message = <div className='errorContact'>El mensaje es requerido</div>
    }

    return errors
  }

  const sendEmail = (e) => {
    e.preventDefault()

    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    emailjs.sendForm('service_hbcf0pc', 'template_vjn5jkj', form.current, 'cgBID5GSQ7CE6GgyR')
      .then(() => {
        setStatus('success')
        setFormErrors({})
        form.current.reset()
      }).catch(() => setStatus('error'))
  }
  useEffect(() => {
    if (status === 'success') {
      toast.success('Tu Correo ha sido enviado con Éxito')
    } else if (status === 'error') {
      toast.error('Error al enviar el correo, intenta más tarde')
    }
  }, [status])

  return (
    <>
      <Header />
      <div className='paraFondo'>
        <img src='/mundo.png' alt='Mundo' />
        <div className='contactContainer'>

          <div className='form-container'>

            <form className='form' ref={form} onSubmit={sendEmail}>
              <div className='form-group'>
                <label htmlFor='nombre'>Nombre:</label>
                <input type='text' id='nombre' name='from_name' />
                {formErrors.from_name && formErrors.from_name}
              </div>
              <div className='form-group'>
                <label htmlFor='email'>Correo:</label>
                <input type='text' id='email' name='email' />
                {formErrors.email && formErrors.email}
              </div>
              <div className='form-group'>
                <label htmlFor='textarea'>Mensaje:</label>
                <textarea name='message' id='textarea' rows='30' cols='50' />
                {formErrors.message && formErrors.message}
              </div>
              <h3>Meridian Colombia, S.A.S. es el responsable de tus datos que serán tratados para atender la
                consulta según su naturaleza y contactarte si es necesario, y enviarte comunicaciones comerciales
                sobre nuestros servicios, promociones y novedades. Puedes ejercer tus derechos, así como retirar
                el consentimiento en cualquier
                momento en protecciondedatos@meridian.com.co.
                Más información en nuestro <a href='/aviso-de-privacidad'>Aviso de Privacidad</a>
              </h3>
              <button className='boton' style={{margin: 'auto'}} type='submit'>Enviar</button>

            </form>
          </div>
          <div className='contactInfo'>
            <h1>¿Necesitas ayuda?</h1>
            <hr />
            <p>Escribe tus preguntas, dudas o recomendaciones.
              ¡Te ayudaremos con mucho gusto!
            </p>
            <div>
              <a href='https://wa.me/+573024690359' target='_blank' rel='noreferrer'>
                <svg style={{ marginRight: '5px' }} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' color='#42376E' width={16} height={16} fill='none'>
                  <path d='M17 10.8045C17 10.4588 17 10.286 17.052 10.132C17.2032 9.68444 17.6018 9.51076 18.0011 9.32888C18.45 9.12442 18.6744 9.02219 18.8968 9.0042C19.1493 8.98378 19.4022 9.03818 19.618 9.15929C19.9041 9.31984 20.1036 9.62493 20.3079 9.87302C21.2513 11.0188 21.7229 11.5918 21.8955 12.2236C22.0348 12.7334 22.0348 13.2666 21.8955 13.7764C21.6438 14.6979 20.8485 15.4704 20.2598 16.1854C19.9587 16.5511 19.8081 16.734 19.618 16.8407C19.4022 16.9618 19.1493 17.0162 18.8968 16.9958C18.6744 16.9778 18.45 16.8756 18.0011 16.6711C17.6018 16.4892 17.2032 16.3156 17.052 15.868C17 15.714 17 15.5412 17 15.1955V10.8045Z' stroke='currentColor' strokeWidth='1.5' />
                  <path d='M7 10.8046C7 10.3694 6.98778 9.97821 6.63591 9.6722C6.50793 9.5609 6.33825 9.48361 5.99891 9.32905C5.55001 9.12458 5.32556 9.02235 5.10316 9.00436C4.43591 8.9504 4.07692 9.40581 3.69213 9.87318C2.74875 11.019 2.27706 11.5919 2.10446 12.2237C1.96518 12.7336 1.96518 13.2668 2.10446 13.7766C2.3562 14.6981 3.15152 15.4705 3.74021 16.1856C4.11129 16.6363 4.46577 17.0475 5.10316 16.996C5.32556 16.978 5.55001 16.8757 5.99891 16.6713C6.33825 16.5167 6.50793 16.4394 6.63591 16.3281C6.98778 16.0221 7 15.631 7 15.1957V10.8046Z' stroke='currentColor' strokeWidth='1.5' />
                  <path d='M5 9C5 5.68629 8.13401 3 12 3C15.866 3 19 5.68629 19 9' stroke='currentColor' strokeWidth='1.5' strokeLinecap='square' strokeLinejoin='round' />
                  <path d='M19 17V17.8C19 19.5673 17.2091 21 15 21H13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                </svg>
                Chat de ayuda
              </a>
            </div>
            <hr />
            <span>Horario: Lun-Vie 9am-6pm</span>
          </div>
        </div>
      </div>
      <SideInfo />
      <Footer />
      <ToastContainer
        position='top-center'
        autoClose={5000}
        hideProgressBar={false}
        pauseOnHover={false}
        closeOnClick
        theme='light'
      />
    </>
  )
}
