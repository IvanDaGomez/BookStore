/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Payment, StatusScreen } from '@mercadopago/sdk-react'
import { onError, onReady, onSubmit } from './callbacks'
import useInitializeMercadoPago from './useInitializeMercadoPago'

function PaymentBrick ({ libro, preferenceId, user, form, statusScreen, setStatusScreen, setStatus, extraCondition }) {
  const [paymentId, setPaymentId] = useState('')

  // Initialize MercadoPago once
  useInitializeMercadoPago({

    preferenceId,
    libro,
    form,
    user,
    setStatusScreen,
    setPaymentId,
    setStatus
  })
  
  // --------------------------------------------------------------STATUS SCREEN-----------------------------------------------------

  const initializationStatus = {
    paymentId // payment id to show
  }


  return (
    <>
      
            <div className="bricks">
            {(!statusScreen && extraCondition)
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
             {(statusScreen && extraCondition) && <StatusScreen
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
    </>
  )
}

export default PaymentBrick
