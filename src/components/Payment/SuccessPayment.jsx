import React, {useEffect} from 'react';
import {useSearchParams} from "react-router-dom";
import {paymentApi} from "../../api/paymentApi.jsx";
import {bookingApi} from "../../api/bookingApi.jsx";

function SuccessPayment() {

    const [searchParams] = useSearchParams();
    const [session, setSession] = React.useState({});
    const [items, setItems] = React.useState([]);
    const [totalQuantity, setTotalQuantity] = React.useState(0);
    const [totalPrice, setTotalPrice] = React.useState(0);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const session_id = searchParams.get("session_id");
    const booking_id = searchParams.get("booking_id");

    const didRun = React.useRef(false);

    async function fetchData() {
        try{
            console.log("booking_id", booking_id);
            const data = await paymentApi.getCheckout(session_id);
            console.log("data",data);
            if(data.session.status === "complete"){
                await completePayment(data.session );
            } else {
                console.error('The session has not succeded')
            }
            setSession(data.session);
            setItems(data.items.data);
            let totalPrice = 0;
            let totalQuantity = 0;
            data.items.data.forEach((item) => {
                totalQuantity += item.quantity;
                totalPrice += item.amount_total;
            })
            setTotalQuantity(totalQuantity);
            setTotalPrice(totalPrice);
        } catch(error) {
            console.error("Could not fetch session",error)
            setError("Could not fetch session")
        }
        setLoading(false);
    }

    async function completePayment(session){
        await bookingApi.confirmBooking(booking_id, session.amount_total, "paid");
        const tickets = await bookingApi.getTicketsFromBooking(booking_id);

        let ticketsArray = [];
        for (let i = 0; i < tickets.length; i++){
            const newTicket = {
                id: tickets[i].id,
                barcode_number: i
            }
            ticketsArray.push(newTicket);
        }

       const ticketsUpdated =  await paymentApi.updateTickets(ticketsArray, true);
        await paymentApi.createPayment(booking_id, session_id, session.created, session.amount_total);
        console.log(ticketsUpdated);
    }

    useEffect(() => {
        setLoading(true);
        if(!session_id) {
            console.error("Session ID is missing");
            setError("Session ID is missing");
            setLoading(false);
            return;
        }


        if(didRun.current) return;
        didRun.current = true;

        fetchData();
    }, [session_id])




    if(error){
        return <div>Error</div>
    }

    if(loading){
        return <div>Loading...</div>
    }



    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Payment Successful!</h1>
            <p style={{color: 'white'}}>Thank you for your purchase!</p>
            <h3 style={{color: 'white'}}>Order Summary:</h3>
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
                    <h3>{item.description}</h3>
                    <p><strong>Price For Each:</strong> {(item.price.unit_amount / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> {(item.amount_total / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
                </div>
            ))}
            <div
                style={{
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: '#f0f8ff',
                    color: 'black',
                    borderRadius: '8px'
                }}
            >
                <h3>Total</h3>
                <p><strong>Quantity:</strong> {totalQuantity}</p>
                <p><strong>Price:</strong> {(totalPrice / 100).toFixed(2)} {session.currency?.toUpperCase()}</p>
            </div>
            <p style={{color: 'white'}}>The tickets have been sent to your email</p>

        </div>
    );
}

export default SuccessPayment;
