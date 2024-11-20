/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';
import { calculateComission } from '../../assets/calculateComission';

function PaymentBrick({ libro, preferenceId }) {

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

    return (
        <>
            <div id="paymentBrick_container"></div>
            {libro && preferenceId && (
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
                            atm: "all"
                        },
                    }}
                    onSubmit={onSubmit}
                    onReady={onReady}
                    onError={onError}
                />
            )}
        </>
    );
}

export default PaymentBrick;
