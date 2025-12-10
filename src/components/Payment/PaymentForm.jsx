import React from 'react';
import {PaymentElement, useCheckout} from "@stripe/react-stripe-js/checkout";
import "../../CSS/Payment.css";

function PaymentForm() {

    const checkoutState = useCheckout();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (checkoutState.type === 'loading') {
            return (
                <div>Loading...</div>
            );
        } else if (checkoutState.type === 'error') {
            return (
                <div>Error: {checkoutState.error.message}</div>
            );
        }

        const {checkout} = checkoutState;
        const result = await checkout.confirm();
        console.log('Checkout result:', result);

        if (result.type === 'error') {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };
    return (
        <div className="payment-form">
            <form onSubmit={handleSubmit}>
                <div className="stripe-container">
                    <PaymentElement />
                </div>
                <button className='payment-submision'>Submit</button>
            </form>
        </div>
    );
}

export default PaymentForm;
