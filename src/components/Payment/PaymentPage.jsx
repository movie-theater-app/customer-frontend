import React from 'react';
import {loadStripe} from "@stripe/stripe-js";
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
import {CheckoutProvider} from '@stripe/react-stripe-js/checkout';
import PaymentForm from "./PaymentForm.jsx";
import {useSearchParams} from "react-router-dom";

function PaymentPage() {

    const [searchParams] = useSearchParams();

    const promise = searchParams.get("promise");

    return (
        <CheckoutProvider stripe={stripePromise} options={{clientSecret: promise}}>
            <PaymentForm />
        </CheckoutProvider>
    );
}

export default PaymentPage;
