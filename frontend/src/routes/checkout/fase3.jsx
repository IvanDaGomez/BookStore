/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react'
import { getCardBrand } from '../../assets/getCardBrand'
import PaymentBrick from './paymentBrick'

/* eslint-disable react/prop-types */
function Fase3 ({ form, setForm, setFase, libro, preferenceId, user }) {
  return (
    <div>
      {preferenceId && <PaymentBrick libro={libro} preferenceId={preferenceId} form={form} user={user} setFase={setFase} />}
    </div>
  )
}

export default Fase3
