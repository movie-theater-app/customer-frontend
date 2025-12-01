import React, {useEffect} from 'react';
import {useSearchParams} from "react-router-dom";
import {paymentApi} from "../../api/paymentApi.jsx";

function SuccessPayment() {

    const [searchParams] = useSearchParams();
    const [session, setSession] = React.useState({});
    const [items, setItems] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        setLoading(true);
        if(!sessionId) {
            console.error("Session ID is missing");
            setError("Session ID is missing");
            setLoading(false);
            return;
        }

        async function fetchData() {
            try{
                const data = await paymentApi.getCheckout(sessionId);
                console.log("data",data);
                setSession(data.session)
                setItems(data.items.data);
            } catch(error) {
                console.error("Could not fetch session",error)
                setError("Could not fetch session")
            }
            setLoading(false);
        }

        fetchData();
    }, [sessionId])

    if(error){
        return <div>Error</div>
    }

    if(loading){
        return <div>Loading...</div>
    }



    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Payment Successful!</h1>
            <p>Thank you for your purchase!</p>
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f8ff', color: 'black', borderRadius: '8px' }}>
                <h3>Order Details:</h3>
                <p><strong>Session ID:</strong> {session.id}</p>
                <p><strong>Payment Status:</strong> {session.payment_status}</p>
                <p><strong>Amount:</strong> {(session.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
                <p><strong>Customer Email:</strong> {session.customer_email}</p>
            </div>
            {items.map((item) => (
                <div
                    key={item.id || item.description}
                    style={{
                        marginTop: '20px',
                        padding: '15px',
                        backgroundColor: '#f0f8ff',
                        color: 'black',
                        borderRadius: '8px'
                    }}
                >
                    <h3>Item Details:</h3>
                    <p><strong>Item Name:</strong> {item.description}</p>
                    <p><strong>Price For Each:</strong> {(item.price.unit_amount / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
                    <p><strong>Total Price:</strong> {(item.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                </div>
            ))}

        </div>
    );
}

export default SuccessPayment;
