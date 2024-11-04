import { useState } from "react";

/* eslint-disable react/prop-types */
function Fase3({ form, setForm, setFase }) {

    const [paymentMethod, setPaymentMethod] = useState('Credit card')

    const handleNext = () => setFase(4); // Avanzar a la fase de confirmación
  
    const handleChange = (e) => {
      setForm({ ...form, payment: { ...form.payment, [e.target.name]: e.target.value } });
    };
    
    return (
      <div className="checkoutContainer">
        <div className="paymentMethodsContainer">
          <label className="paymentMethodsLabel" >Método de pago</label>
          <div className='paymentMethods'>
            <div 
              className={`${paymentMethod === 'Credit card' ? 'activePaymenthMethod':''}`}
              onClick={()=>setPaymentMethod('Credit card')}
            >
              <img src="/card-logo.svg" alt='card logo' />
              Tarjeta de crédito
            </div>
            <div 
              className={`${paymentMethod === 'Debit card' ? 'activePaymenthMethod':''}`} 
              onClick={()=>setPaymentMethod('Debit card')}
            >
              <img src="/card-logo.svg" alt='card logo' />
              Tarjeta de débito
            </div>
            <div 
              className={`${paymentMethod === 'pse' ? 'activePaymenthMethod':''}`} 
              onClick={()=>setPaymentMethod('pse')}  
            >
              <img src="/pse-logo.svg" alt="pse logo" />
              PSE
            </div>
            <div  
              className={`${paymentMethod === 'cash' ? 'activePaymenthMethod':''}`} 
              onClick={()=>setPaymentMethod('cash')}  
            >
              <img src="/cash-logo.webp" alt="" />
              Efectivo
            </div>
            <div 
              className={`${paymentMethod === 'Mercado Pago' ? 'activePaymenthMethod':''}`}
              onClick={()=>setPaymentMethod('Mercado Pago')}
            >
              <img src="/mercadoPago-logo.png" alt="" />
              Mercado Pago
            </div>

          </div>
        </div>

{/*---------------------------------------TARJETAS-------------------------------------------------------- */}
{/* Campo de cédula para todos los métodos */}
            <div className="inputCrear">
                <label htmlFor="idNumber">Nombre *</label>
                <input
                    id="idNumber"
                    type="text"
                    name="idNumber"
                    placeholder="Número de cédula"
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

            {/* Campos específicos para Tarjetas */}
            {(paymentMethod === 'Credit card' || paymentMethod === 'Debit card') && (
                <>
                  <div className="gridTarjeta">
                    <div className="tarjetaContainer">
                      hola
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
                              onChange={handleChange}
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
                              onChange={handleChange}
                          />
                      </div>

                      <div className="inputCrear">
                          <label htmlFor="expiryDate">Fecha de expiración *</label>
                          <input
                              id="expiryDate"
                              type="text"
                              name="expiryDate"
                              placeholder="MM/AA"
                              required
                              onChange={handleChange}
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
                              onChange={handleChange}
                          />
                        
                      </div>
                    </div>
                  </div>
                </>
            )}

            {/* Campos específicos para PSE */}
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

            {/* Campos específicos para Mercado Pago */}
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

            {/* No se requieren campos adicionales para Efectivo */}

            <div>
          <button onClick={() => setFase(2)}>Atrás</button>
          <button onClick={handleNext}>Finalizar</button>
        </div>
      </div>
    );
  }
  export default Fase3;
  