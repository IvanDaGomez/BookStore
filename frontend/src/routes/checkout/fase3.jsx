/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { getCardBrand } from "../../assets/getCardBrand";
import PaymentBrick from "./paymentBrick";

/* eslint-disable react/prop-types */
function Fase3({ form, setForm, setFase, libro, preferenceId }) {

  const [paymentMethod, setPaymentMethod] = useState('Tarjeta de crédito');
  const [brand, setBrand] = useState(null);
  const cardNumber = useRef(null);
  const handleNext = () => setFase(4); // Avanzar a la fase de confirmación
  
  const handleChange = (e) => {
    setForm({ ...form, payment: { ...form.payment, [e.target.name]: e.target.value } });
  };
  useEffect(()=>{
    setForm({...form, payment: {...form.payment, paymentMethod}})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[paymentMethod])
  
  const renderBrand = () => {
    const number = cardNumber.current.value;
    const detectedBrand = getCardBrand(number);
    
    switch(detectedBrand) {
      case 'Visa':
        return '/visa.png';
      case 'MasterCard':
        return '/mastercard.png';
      case 'American Express':
        return '/americanexpress.png';
      case 'Discover':
        return '/discover.png';
      case 'JCB':
        return '/jcb.png';
      case 'Diners Club':
        return '/diners.png';
      default:
        return '';
    }
  };
  const makeFourNumbersJump = (string) => {
    if (!string) return
    // Remove any non-digit characters
    const onlyDigits = string.replace(/\D/g, '');
    
    // Add a space every four digits
    return onlyDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  const maskCardNumber = (cardNumber) => {
    if (!cardNumber) return
    // Remove any non-digit characters to get a clean number
    const onlyDigits = cardNumber.replace(/\D/g, '');
  
    // Check if the card number is long enough to mask
    if (onlyDigits.length < 8) {
      return onlyDigits; // Not enough digits to mask
    }
  
    // Mask all digits except the first 4 and last 4
    const maskedNumber = onlyDigits.slice(0, 4) + " " + "XXXX XXXX" + " " + onlyDigits.slice(-4);
  
    return maskedNumber;
  };
  // Handle validations
  const handleCardNumberChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/\D/g, ''); // Remove all non-numeric characters
    setForm(prevForm => ({
      ...prevForm,
      payment: {
        ...prevForm.payment,
        cardNumber: sanitizedValue
      }
    }));
    setBrand(renderBrand());
  };

  const handleExpiryDateChange = (e) => {
    let { value } = e.target;
    // Allow only numbers and format as MM/YY
    value = value.replace(/\D/g, '');
    if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2, 4);
    if (value.length > 5) value = value.slice(0, 5); // Limit length to 5 characters (MM/YY)
    
    setForm(prevForm => ({
      ...prevForm,
      payment: {
        ...prevForm.payment,
        expiryDate: value
      }
    }));
  };

  const handleCVVChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/\D/g, ''); // Remove all non-numeric characters
    if (sanitizedValue.length <= 4) { // Limit CVV to 4 digits for Amex, 3 for others
      setForm(prevForm => ({
        ...prevForm,
        payment: {
          ...prevForm.payment,
          cvv: sanitizedValue
        }
      }));
    }
  };

  const handleCardNameChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = value.replace(/[^a-zA-Z\s]/g, ''); // Allow only letters and spaces
    setForm(prevForm => ({
      ...prevForm,
      payment: {
        ...prevForm.payment,
        cardName: sanitizedValue
      }
    }));
  };

  /*useEffect(()=>{
    document.querySelector('#UIcardExpiryDate').value = document.querySelector('#expiryDate').value
    document.querySelector('#UIcardNumber').value = document.querySelector('#cardNumber').value
    document.querySelector('#UIcardName').value = document.querySelector('#cardName').value
  },[])*/

  return (
    <div className="">
            <div className="paymentMethodsContainer">
        
        {preferenceId && <PaymentBrick libro={libro} preferenceId={preferenceId}/>}
        {/*<div className="paymentMethods">
          
          <div
            className={`${paymentMethod === 'Tarjeta de crédito' ? 'activePaymentMethod' : ''}`}
            onClick={() => setPaymentMethod('Tarjeta de crédito')}
          >
            <img src="/card-logo.svg" alt="credit card logo" />
            Tarjeta de crédito
          </div>
          <div
            className={`${paymentMethod === 'Tarjeta de débito' ? 'activePaymentMethod' : ''}`}
            onClick={() => setPaymentMethod('Tarjeta de débito')}
          >
            <img src="/card-logo.svg" alt="debit card logo" />
            Tarjeta de débito
          </div>
          <div
            className={`${paymentMethod === 'pse' ? 'activePaymentMethod' : ''}`}
            onClick={() => setPaymentMethod('pse')}
          >
            <img src="/pse-logo.svg" alt="pse logo" />
            PSE
          </div>
          <div
            className={`${paymentMethod === 'cash' ? 'activePaymentMethod' : ''}`}
            onClick={() => setPaymentMethod('cash')}
          >
            <img src="/cash-logo.webp" alt="cash logo" />
            Efectivo
          </div>
          <div
            className={`${paymentMethod === 'Mercado Pago' ? 'activePaymentMethod' : ''}`}
            onClick={() => setPaymentMethod('Mercado Pago')}
          >
            <img src="/mercadoPago-logo.png" alt="Mercado Pago logo" />
            Mercado Pago
          </div>
        </div>
      </div>

      <div className="inputCrear">
        <label htmlFor="idNumber">Nombre *</label>
        <input
          id="idNumber"
          type="text"
          name="idNumber"
          placeholder="Nombre completo"
          required
          onChange={handleChange}
        />
      </div>
      <div className="inputCrear">
        <label htmlFor="cedula">Cédula de ciudadanía *</label>
        <input
          id="cedula"
          type="text"
          name="cedula"
          placeholder="Número de cédula"
          required
          onChange={handleChange}
        />
      </div>

      {(paymentMethod === 'Tarjeta de crédito' || paymentMethod === 'Tarjeta de débito') && (
        <div className="gridTarjeta">
          <div className="tarjetaContainer">
            <div>
              <img src={brand || '/mastercard.png'} alt="" />
              <span id='UIcardExpiryDate'>{form.payment.expiryDate || ''}</span>
            </div>
            <div>
              <h2 id='UIcardNumber'>{maskCardNumber(form.payment.cardNumber) || ''}</h2>
            </div>
            <div>
              <span id='UIcardName'>{form.payment.cardName || ''}</span>
              <span>{paymentMethod}</span>
            </div>
          </div>
          <div className="tarjetaLlenar">
            <div className="inputCrear">
              <label htmlFor="cardName">Nombre del titular *</label>
              <input
                id="cardName"
                type="text"
                name="cardName"
                placeholder="Nombre en la tarjeta"
                required
                value={form.payment.cardName || ''}
                onChange={handleCardNameChange}
              />
            </div>
            <div className="inputCrear">
              <label htmlFor="cardNumber">Número de la tarjeta *</label>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                placeholder="Número de la tarjeta"
                required
                value={makeFourNumbersJump(form.payment.cardNumber) || ''}
                onChange={handleCardNumberChange}
                ref={cardNumber}
              />
            </div>
            <div className="inputCrear">
              <label htmlFor="expiryDate">Fecha de expiración *</label>
              <input
                id="expiryDate"
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                required
                value={form.payment.expiryDate || ''}
                onChange={handleExpiryDateChange}
              />
            </div>

            <div className="inputCrear">
              <label htmlFor="cvv">CVV *</label>
              <input
                id="cvv"
                type="text"
                name="cvv"
                placeholder="Código de seguridad"
                required
                value={form.payment.cvv || ''}
                onChange={handleCVVChange}
              />
            </div>
          </div>

          
        </div>
      )}
                  {paymentMethod === 'pse' && (
                <>
                    <div className="inputCrear">
                        <label htmlFor="bankName">Banco *</label>
                        <input
                            id="bankName"
                            type="text"
                            name="bankName"
                            placeholder="Nombre del banco"
                            required
                            onChange={handleChange}
                        />
                    </div>

                    <div className="inputCrear">
                        <label htmlFor="accountNumber">Número de cuenta *</label>
                        <input
                            id="accountNumber"
                            type="text"
                            name="accountNumber"
                            placeholder="Número de cuenta"
                            required
                            onChange={handleChange}
                        />
                    </div>
                </>
            )}

            {paymentMethod === 'Mercado Pago' && (
                <div className="inputCrear">
                    <label htmlFor="email">Correo electrónico *</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Correo asociado a Mercado Pago"
                        required
                        onChange={handleChange}
                    />
                </div>
            )}
      <div>
        */}
        
      </div>
      <button type="button" style={{margin:'auto'}} onClick={() => setFase(2)}>Atrás</button>
    </div>
  );
}

export default Fase3;
