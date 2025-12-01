import React, {useMemo, useState} from 'react';
import { paymentApi } from "../../api/paymentApi.jsx";
import {useNavigate} from "react-router-dom";




function CheckoutPage() {

    const navigate = useNavigate();

    const [name, setName] = useState("Normal ticket");
    const [price, setPrice] = useState(2000);
    const [quantity, setQuantity] = useState(5);
    const [nameCD, setNameCD] = useState("Child ticket");
    const [priceCD, setPriceCD] = useState(1200);
    const [quantityCD, setQuantityCD] = useState(2);
    const [email, setEmail] = useState("email@gmail.com");


    async function handleSubmit(e) {
        e.preventDefault();
        const normalTicket = {
            name,
            price,
            quantity
        }
        const childTicket = {
            name: nameCD,
            price: priceCD,
            quantity: quantityCD
        }
        let items = [];
        items.push(normalTicket);
        items.push(childTicket);
        try {
            const response = await paymentApi.createCheckoutSession(
                items,
                email,
            )
            console.log("response",response)

            navigate(`/payment/pay?promise=${response.client_secret}`);
        } catch (error) {
            console.error("Error creating checkout session", error)

        }
    }


    return (
        <div>
            <form onSubmit={handleSubmit} style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center"
            }}>
              <div style={{display: "flex", flexDirection: "row"}}>
                  <div style={{display: "flex", flexDirection: "column"}}>
                      <input type="text" placeholder="Item name" value={name} onChange={(e) => setName(e.target.value)} />
                      <input type="number" placeholder="Item price" value={price} onChange={(e) => setPrice(e.target.value)} />
                      <input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                  </div>
                  <div style={{display: "flex", flexDirection: "column"}}>
                      <input type="text" placeholder="Item name" value={nameCD} onChange={(e) => setNameCD(e.target.value)} />
                      <input type="number" placeholder="Item price" value={priceCD} onChange={(e) => setPriceCD(e.target.value)} />
                      <input type="number" placeholder="Quantity" value={quantityCD} onChange={(e) => setQuantityCD(e.target.value)} />
                  </div>
              </div>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit">Submit</button>
            </form>
        </div>

    );
}

export default CheckoutPage;