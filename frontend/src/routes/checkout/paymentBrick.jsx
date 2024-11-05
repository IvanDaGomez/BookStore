/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

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
                    };

                    const customization = {
                        paymentMethods: {
                            ticket: "all",
                            bankTransfer: "all",
                            creditCard: "all",
                            debitCard: "all",
                            mercadoPago: "all",
                        },
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
        // Calculate commission and seller's amount
        const totalAmount = libro.oferta || libro.precio;
        // 5% mas 4000 pesos
        const commissionAmount = totalAmount * 0.05 + 4000;
        const sellerAmount = totalAmount - commissionAmount;

        return new Promise((resolve, reject) => {
            fetch("/process_payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    amount: totalAmount,
                    marketplace: {
                        receiverId: libro.idVendedor,  // The seller's MercadoPago ID
                        applicationFee: commissionAmount,  // Commission for your app
                    },
                    // Amount that goes to the seller after your commission
                    collector_id: libro.idVendedor,
                    transaction_amount: sellerAmount,
                }),
            })
                .then((response) => response.json())
                .then((response) => {
                    if (response.status === "success") {
                        resolve();
                    } else {
                        reject(new Error("Payment failed"));
                    }
                })
                .catch((error) => {
                    console.error("Error during payment:", error);
                    reject(error);
                });
        });
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
                    }}
                    customization={{
                        paymentMethods: {
                            ticket: "all",
                            bankTransfer: "all",
                            creditCard: "all",
                            debitCard: "all",
                            mercadoPago: "all",
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
