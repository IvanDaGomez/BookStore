/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { calculateComission } from '../../assets/calculateComission';

function PaymentBrick({ libro, preferenceId, user }) {

    const PUBLIC_KEY = 'TEST-4b6be399-19ca-4ae3-9397-455af528f651';

    // Initialize MercadoPago once
    useEffect(() => {
        initMercadoPago(PUBLIC_KEY);
    }, []);

    

    // Render Payment Brick only when `preferenceId` is set and stable
    useEffect(() => {
        if (preferenceId) {
            const renderPaymentBrick = async () => {
                try {
                    const bricksBuilder = window.MercadoPago.bricks();
                    const initialization = {
                        amount: libro.oferta ? libro.oferta : libro.precio,
                        preferenceId,
                        marketplace: true,
                    };

                    const customization = {
                        paymentMethods: {
                            ticket: "all",
                            bankTransfer: "all",
                            creditCard: "all",
                            debitCard: "all",
                            mercadoPago: "all",
                        }
                    };

                    await bricksBuilder.create("payment", "paymentBrick_container", {
                        initialization,
                        customization,
                        callbacks: {
                            onSubmit,
                            onError,
                            onReady,
                        },
                    });
                } catch (error) {
                    console.error("Error rendering Payment Brick:", error);
                }
            };

            renderPaymentBrick();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [preferenceId, libro]); // Ensure `renderPaymentBrick` only depends on `preferenceId` and `libro` values

    const onSubmit = async ({ formData }) => {
        const totalAmount = libro.oferta || libro.precio;
        const commissionAmount = calculateComission(totalAmount);
    
        // Ensure the token is included
        const { token, payment_method_id, payer } = formData;
    
        try {
            const response = await fetch('http://localhost:3030/api/books/process_payment', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    transaction_amount: totalAmount,
                    description: `Purchase of ${libro.title}`,
                    token, // The generated card/payment token
                    payment_method_id, // The selected payment method
                    payer: {
                        email: payer.email,
                    },
                    application_fee: commissionAmount, // Your platform's commission
                }),
            });
    
            const result = await response.json();
            if (result.status === "success") {
                alert("Payment successful!");
            } else {
                throw new Error(result.message || "Payment failed");
            }
        } catch (error) {
            console.error("Payment error:", error);
            alert("Payment error occurred, please try again.");
        }
    };
    
    
    
    

    const onError = (error) => {
        console.error("Payment Brick Error:", error);
    };

    const onReady = () => {
        console.log("Payment Brick is ready");
    };


    const [selectedMethod, setSelectedMethod] = useState("mercadoPago"); // Default payment method
    const [loading, setLoading] = useState(false);

    const handlePayWithBalance = async () => {
        /*if (userBalance < libro.precio) {
            alert("Insufficient balance!");
            return;
        }*/

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3030/api/books/pay_with_balance', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: "user-id", // Replace with actual user ID
                    bookId: libro.id,
                    amount: libro.oferta || libro.precio,
                }),
            });

            const result = await response.json();

            if (result.status === "success") {
                alert("Payment successful with balance!");
            } else {
                throw new Error(result.message || "Payment failed");
            }
        } catch (error) {
            console.error("Balance payment error:", error);
            alert("Payment failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {libro && preferenceId ? (
                <>
                    <div className="payWithBalance"
                        onClick={() => {selectedMethod === 'balance' ? setSelectedMethod('') : setSelectedMethod('balance')}}>
                        {/* Pay with Balance Option */}
                        <input type="radio" checked={selectedMethod === 'balance'} className={`${selectedMethod === 'balance' ? 'active' : ''}`} />
                        <div className='imageLogoContainer'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"}>
                            <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M4 20C2.89543 20 2 19.1046 2 18C2 16.8954 2.89543 16 4 16C5.10457 16 6 17.3333 6 18C6 18.6667 5.10457 20 4 20Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 20C6.89543 20 6 18.5 6 18C6 17.5 6.89543 16 8 16C9.10457 16 10 16.8954 10 18C10 19.1046 9.10457 20 8 20Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M13 20H16C18.8284 20 20.2426 20 21.1213 19.1213C22 18.2426 22 16.8284 22 14V13C22 10.1716 22 8.75736 21.1213 7.87868C20.48 7.23738 19.5534 7.06413 18 7.01732M10 7H16C16.7641 7 17.425 7 18 7.01732M18 7.01732C18 6.06917 18 5.5951 17.8425 5.22208C17.6399 4.7421 17.2579 4.36014 16.7779 4.15749C16.4049 4 15.9308 4 14.9827 4H10C6.22876 4 4.34315 4 3.17157 5.17157C2 6.34315 2 7.22876 2 11V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        </div>
                        <div>
                            <h2>Pagar con mi balance</h2>
                            <h3>Balance disponible: ${user?.balance || 0}</h3>
                        </div>
                    </div>

                    {/* Conditionally Render Payment Methods */}
                    {selectedMethod === "balance" ? (
                        <button
                        style={{margin: '10px auto 10px 15px', width: 'calc(100% - 30px)'}}
                            className=""
                            onClick={handlePayWithBalance}
                            disabled={loading}
                        >
                            {loading ? "Procesando..." : "Pagar con mi balance"}
                        </button>
                    ) : (
                        <Payment
                            initialization={{
                                amount: libro.oferta ? libro.oferta : libro.precio,
                                preferenceId,
                                marketplace: true,
                            }}
                            customization={{
                                paymentMethods: {
                                    ticket: "all",
                                    bankTransfer: "all",
                                    creditCard: "all",
                                    debitCard: "all",
                                    mercadoPago: "all",
                                    atm: "all",
                                },
                            }}
                            onSubmit={onSubmit}
                            onReady={onReady}
                            onError={onError}
                        />
                    )}
                </>
            ) : (
                <span>Loading...</span>
            )}
        </>
    );
}

export default PaymentBrick;
