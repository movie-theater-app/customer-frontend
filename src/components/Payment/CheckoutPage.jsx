import React, {useMemo, useState} from 'react';
import { paymentApi } from "../../api/paymentApi.jsx";
import {useNavigate} from "react-router-dom";




function CheckoutPage() {

    const navigate = useNavigate();

    const [name, setName] = useState("Item");
    const [price, setPrice] = useState(5000);
    const [quantity, setQuantity] = useState(10);
    const [email, setEmail] = useState("email@gmail.com");


    async function handleSubmit(e) {
        e.preventDefault();

        const item = {
            name,
            price
        }
        try {
            const response = await paymentApi.createCheckoutSession(
                item,
                quantity,
                email,
            )
            console.log(response)

            navigate(`/payment/pay?promise=${response.client_secret}`);
        } catch (error) {
            console.error("Error creating checkout session", error)

        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
                <input type="number" placeholder="Item price" value={price} onChange={(e) => setPrice(e.target.value)} />
                <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button type="submit">Submit</button>
            </form>
        </div>

    );
}

export default CheckoutPage;