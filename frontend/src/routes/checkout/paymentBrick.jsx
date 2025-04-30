/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Payment, StatusScreen } from '@mercadopago/sdk-react'
import { handlePayWithBalance, onError, onReady, onSubmit } from './callbacks'
import useInitializeMercadoPago from './useInitializeMercadoPago'
import { MERCADOPAGO_PUBLIC_KEY } from '../../assets/config.js'
import { Link } from 'react-router-dom'
function PaymentBrick ({ libro, preferenceId, user, form, setFase }) {
  const [statusScreen, setStatusScreen] = useState(false)
  const [paymentId, setPaymentId] = useState('')
  const [status, setStatus] = useState(null)
  const PUBLIC_KEY = MERCADOPAGO_PUBLIC_KEY

  // Initialize MercadoPago once
  useInitializeMercadoPago({
    PUBLIC_KEY,
    preferenceId,
    libro,
    form,
    user,
    setStatusScreen,
    setPaymentId,
    setStatus
  })
  

  const [selectedMethod, setSelectedMethod] = useState('mercadoPago') // Default payment method
  const [loading, setLoading] = useState(false)



  // --------------------------------------------------------------STATUS SCREEN-----------------------------------------------------

  const initializationStatus = {
    paymentId // payment id to show
  }


  return (
    <>
      <div className='paymentMethodsContainer'>
        {libro && preferenceId ? (
          <>
            {(selectedMethod === 'balance' && !statusScreen)
              && <>
            <div
              className='payWithBalance'
              onClick={() => { selectedMethod === 'balance' ? setSelectedMethod('') : setSelectedMethod('balance') }}
            >
              {/* Pay with Balance Option */}
              <input type='radio' checked={selectedMethod === 'balance'} className={`${selectedMethod === 'balance' ? 'active' : ''}`} />
              <div className='imageLogoContainer'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'><path d='M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z' stroke='currentColor' strokeWidth='1.5' /><path d='M4 20C2.89543 20 2 19.1046 2 18C2 16.8954 2.89543 16 4 16C5.10457 16 6 17.3333 6 18C6 18.6667 5.10457 20 4 20Z' stroke='currentColor' strokeWidth='1.5' /><path d='M8 20C6.89543 20 6 18.5 6 18C6 17.5 6.89543 16 8 16C9.10457 16 10 16.8954 10 18C10 19.1046 9.10457 20 8 20Z' stroke='currentColor' strokeWidth='1.5' /><path d='M13 20H16C18.8284 20 20.2426 20 21.1213 19.1213C22 18.2426 22 16.8284 22 14V13C22 10.1716 22 8.75736 21.1213 7.87868C20.48 7.23738 19.5534 7.06413 18 7.01732M10 7H16C16.7641 7 17.425 7 18 7.01732M18 7.01732C18 6.06917 18 5.5951 17.8425 5.22208C17.6399 4.7421 17.2579 4.36014 16.7779 4.15749C16.4049 4 15.9308 4 14.9827 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 7.22876 2 11V13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' /></svg>
              </div>
              <div>
                <h2>Pagar con mi balance</h2>
                <h3>Balance disponible: ${user?.balance?.disponible ?? 0}</h3>
              </div>
            </div>
            
                <button
                  style={{ margin: '10px auto 10px 15px', width: 'calc(100% - 30px)' }}
                  className=''
                  onClick={() => handlePayWithBalance({ libro, user, setLoading, form })}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Pagar con mi balance'}
                </button>
                )</>}</>):
                <span>Cargando...</span>}
            <div className="bricks">
            {(!statusScreen && selectedMethod !== 'balance')
            && (
              <Payment
                initialization={{
                  amount: libro.oferta ? libro.oferta : libro.precio,
                  preferenceId,
                  marketplace: true
                }}
                customization={{
                  paymentMethods: {
                    ticket: 'all',
                    bankTransfer: 'all',
                    creditCard: 'all',
                    debitCard: 'all',
                    mercadoPago: 'all',
                    atm: 'all'
                  }
                }}
                onSubmit={({ selectedPaymentMethod, formData }) => onSubmit({ 
                  selectedPaymentMethod,
                  formData,
                  form,
                  libro,
                  user,
                  setStatusScreen,
                  setPaymentId,
                  setStatus
                })}
                onReady={onReady}
                onError={onError}
              />
              )}
             {(statusScreen && selectedMethod !== 'balance') && <StatusScreen
                initialization={initializationStatus}
                onReady={onReady}
                onError={onError}
                customization={{
                  visual: {
                    style: {
                      theme: 'flat'
                    }

                  }
                }}
              />}
              </div>
      </div>
      {console.log(status)}
      {(status === 'pending') && <span>El libro no se comprará hasta que realices el pago</span>}
      {!statusScreen && <button type='button' style={{ margin: 'auto' }} onClick={() => setFase(2)}>Atrás</button>}
      {statusScreen && status === 'rejected' && <button type='button' onClick={() => setFase(2)}>Volver a intentar</button>}
      {statusScreen && <Link to='/'><button type='button'>Seguir Comprando</button></Link>}
    </>
  )
}

export default PaymentBrick
