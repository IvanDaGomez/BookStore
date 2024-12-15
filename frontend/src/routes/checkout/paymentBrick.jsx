/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { initMercadoPago, Payment, StatusScreen } from '@mercadopago/sdk-react'
import { calculateComission } from '../../assets/calculateComission'
import { toast } from 'react-toastify'
function PaymentBrick ({ libro, preferenceId, user, form, setFase }) {
  const [statusScreen, setStatusScreen] = useState(false)
  const [paymentId, setPaymentId] = useState('')
  const [status, setStatus] = useState(null)
  const PUBLIC_KEY = 'TEST-4b6be399-19ca-4ae3-9397-455af528f651'

  // Initialize MercadoPago once
  useEffect(() => {
    initMercadoPago(PUBLIC_KEY)
  }, [])

  // Render Payment Brick only when `preferenceId` is set and stable
  useEffect(() => {
    if (preferenceId) {
      const renderPaymentBrick = async () => {
        try {
          const bricksBuilder = window.MercadoPago.bricks()
          const initialization = {
            amount: libro.oferta ? libro.oferta : libro.precio,
            preferenceId,
            marketplace: true
          }

          const customization = {
            paymentMethods: {
              ticket: 'all',
              bankTransfer: 'all',
              creditCard: 'all',
              debitCard: 'all',
              mercadoPago: 'all'
            }
          }

          await bricksBuilder.create('payment', 'paymentBrick_container', {
            initialization,
            customization,
            callbacks: {
              onSubmit,
              onError,
              onReady
            }
          })
        } catch (error) {
          console.error('Error rendering Payment Brick:', error)
        }
      }

      renderPaymentBrick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preferenceId, libro]) // Ensure `renderPaymentBrick` only depends on `preferenceId` and `libro` values

  const onSubmit = async ({ formData }) => {
    try {
      // Calcular monto total y comisión
      const totalAmount = libro.oferta || libro.precio
      const commissionAmount = calculateComission(totalAmount)

      // Preparar datos del usuario y dirección

      const body = {
        ...formData,
        userId: user._id,
        book: libro,
        sellerId: libro.idVendedor,
        shippingDetails: form,
        token: formData.token || null, // El token generado por Mercado Pago
        issuer_id: formData.issuer_id || null, // Puede ser null si no aplica
        payment_method_id: formData.payment_method_id || '', // Definido como cadena vacía si no se aplica
        transaction_amount: totalAmount || 0, // Definido como 0 si no se proporciona
        installments: formData.installments || 1, // Definido como 1 si no se proporciona
        application_fee: commissionAmount || 0, // Comisión de la aplicación, 0 si no se proporciona

        payer: {
          ...formData.payer,
          email: formData.payer.email || '', // Email del usuario, vacío si no se proporciona
          identification: {
            type: formData?.payer?.identification?.identificationType || 'CC', // Tipo de identificación por defecto "CC"
            number: formData?.payer?.identification?.identificationNumber || '' // Número de identificación vacío si no se proporciona
          },
          address: {
            street_name: form.address.street_name || '', // Nombre de la calle, vacío si no se proporciona
            street_number: form.address.street_number || '', // Número de la calle, vacío si no se proporciona
            zip_code: form.address.zip_code || '', // Código postal, vacío si no se proporciona
            neighborhood: form.address.neighborhood || '', // Barrio, vacío si no se proporciona
            city: form.address.city || '' // Ciudad, vacío si no se proporciona
          },
          phone: {
            area_code: form.phone.area_code || '', // Código de área, vacío si no se proporciona
            number: form.phone.number || '' // Número de teléfono, vacío si no se proporciona
          },
          first_name: form.first_name || null,
          last_name: form.last_name || null
        },
        additional_info: {
          ip_address: form.additional_info.ip_address || '' // IP Address, vacío si no se proporciona
        },
        description: `Pago de libro "${libro.titulo || 'desconocido'}" en Meridian`, // Título del libro, con valor por defecto si es undefined
        callback_url: 'https://www.youtube.com'
      }

      const response = await fetch('http://localhost:3030/api/users/process_payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()
      setStatus(result.status)
      setStatusScreen(true)
      setPaymentId(result.id)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Ocurrió un error al enviar los datos, vuelve a intentar.')
    }
  }

  const onError = (error) => {
    console.error('Payment Brick Error:', error)
  }

  const onReady = () => {
    console.log('Payment Brick is ready')
  }

  const [selectedMethod, setSelectedMethod] = useState('mercadoPago') // Default payment method
  const [loading, setLoading] = useState(false)

  const handlePayWithBalance = async () => {
    if (user.balance < libro.precio) {
      toast.error('No tienes el suficiente dinero!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:3030/api/books/pay_with_balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'user-id', // Replace with actual user ID
          bookId: libro.id,
          amount: libro.oferta || libro.precio
        })
      })

      const result = await response.json()

      if (result.status === 'success') {
        toast.success('Payment successful with balance!')
      } else {
        throw new Error(result.message || 'Payment failed')
      }
    } catch (error) {
      console.error('Balance payment error:', error)
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // --------------------------------------------------------------STATUS SCREEN-----------------------------------------------------

  const initializationStatus = {
    paymentId // payment id to show
  }
  const onErrorStatus = async (error) => {
    // callback called for all Brick error cases
    console.error(error)
  }
  const onReadyStatus = async () => {}

  return (
    <>
      <div className='paymentMethodsContainer'>
        {libro && preferenceId ? (
          <>

            <div
              className='payWithBalance'
              onClick={() => { selectedMethod === 'balance' ? setSelectedMethod('') : setSelectedMethod('balance') }}
            >
              {/* Pay with Balance Option */}
              <input type='radio' checked={selectedMethod === 'balance'} className={`${selectedMethod === 'balance' ? 'active' : ''}`} />
              <div className='imageLogoContainer'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width={24} height={24} color='#000000' fill='none'>
                  <path d='M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z' stroke='currentColor' strokeWidth='1.5' />
                  <path d='M4 20C2.89543 20 2 19.1046 2 18C2 16.8954 2.89543 16 4 16C5.10457 16 6 17.3333 6 18C6 18.6667 5.10457 20 4 20Z' stroke='currentColor' strokeWidth='1.5' />
                  <path d='M8 20C6.89543 20 6 18.5 6 18C6 17.5 6.89543 16 8 16C9.10457 16 10 16.8954 10 18C10 19.1046 9.10457 20 8 20Z' stroke='currentColor' strokeWidth='1.5' />
                  <path d='M13 20H16C18.8284 20 20.2426 20 21.1213 19.1213C22 18.2426 22 16.8284 22 14V13C22 10.1716 22 8.75736 21.1213 7.87868C20.48 7.23738 19.5534 7.06413 18 7.01732M10 7H16C16.7641 7 17.425 7 18 7.01732M18 7.01732C18 6.06917 18 5.5951 17.8425 5.22208C17.6399 4.7421 17.2579 4.36014 16.7779 4.15749C16.4049 4 15.9308 4 14.9827 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 7.22876 2 11V13' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
                </svg>
              </div>
              <div>
                <h2>Pagar con mi balance</h2>
                <h3>Balance disponible: ${user?.balance || 0}</h3>
              </div>
            </div>

            {/* Conditionally Render Payment Methods */}
            {selectedMethod === 'balance'
              ? (
                <button
                  style={{ margin: '10px auto 10px 15px', width: 'calc(100% - 30px)' }}
                  className=''
                  onClick={handlePayWithBalance}
                  disabled={loading}
                >
                  {loading ? 'Procesando...' : 'Pagar con mi balance'}
                </button>
                )
              : !statusScreen
                  ? (
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
                      onSubmit={onSubmit}
                      onReady={onReady}
                      onError={onError}
                    />
                    )
                  : <StatusScreen
                      initialization={initializationStatus}
                      onReady={onReadyStatus}
                      onError={onErrorStatus}
                      customization={{
                        visual: {
                          style: {
                            theme: 'flat'
                          }

                        }
                      }}
                    />}
          </>
        ) : (
          <span>Cargando...</span>
        )}
      </div>
      {(status === 'pending') && <span>El libro no se comprará hasta que realices el pago</span>}
      {!statusScreen && <button type='button' style={{ margin: 'auto' }} onClick={() => setFase(2)}>Atrás</button>}
    </>
  )
}

export default PaymentBrick
