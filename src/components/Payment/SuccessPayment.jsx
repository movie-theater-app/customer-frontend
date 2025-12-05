import React, {useEffect} from 'react';
import {useSearchParams} from "react-router-dom";
import {paymentApi} from "../../api/paymentApi.jsx";
import {bookingApi} from "../../api/bookingApi.jsx";
import {auditoriumApi, movieApi, scheduleApi, theaterApi} from "../../api/Fetch.jsx";
import {seatApi} from "../../api/seatApi.jsx";

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
                await completePayment(data.session, data.items.data);
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

    async function getReceiptDetails(){
        const booking = await bookingApi.getBookingByID(booking_id);
        const movie = await movieApi.getById(booking.movie_id);
        const schedule = await scheduleApi.getScheduleById(booking.schedule_id);
        const seats = await seatApi.getSeatsByBooking(booking_id);
        const auditorium = await auditoriumApi.getAuditoriumByID(schedule.auditorium_id);
        const theater = await theaterApi.getTheaterById(schedule.theater_id);

        return {
            title: movie.title,
            date: schedule.screening_date,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            seats,
            auditorium: auditorium.name,
            theater: theater.name
        }
    }

    async function completePayment(session, items){
        await bookingApi.confirmBooking(booking_id, session.amount_total, "paid");
        const tickets = await bookingApi.getTicketsFromBooking(booking_id);

        const receiptDetails = await getReceiptDetails();

        console.log("tickets length:", tickets.length);
        console.log("seats length:", receiptDetails.seats.length);
        console.log("seats:", receiptDetails.seats);
        let ticketsArray = [];
        let ticketsReceipt = [];
        for (let i = 0; i < tickets.length; i++){
            const newTicket = {
                id: tickets[i].id,
                barcode_number: i
            }
            ticketsArray.push(newTicket);
            // Each ticket receipt to send to the email
            const newReceipt = {
                barcode_number: i,
                child_discount: tickets[i].child_discount,
                price: tickets[i].price,
                seat_type: receiptDetails.seats[i].seat_type,
                seat_number: receiptDetails.seats[i].seat_number,
                seat_row: receiptDetails.seats[i].seat_row,
            }
            ticketsReceipt.push(newReceipt);
        }

        // All the data that will need to be sent to the email
        let childTickets = 0;
        let normalTickets = 0;
        let childPrice = 0;
        let normalPrice = 0;

        ticketsReceipt.forEach((ticket) => {
            if(ticket.child_discount === true){
                childTickets++;
                if (childprice === 0) childPrice = ticket.price;
            } else {
                normalTickets++;
                if (normalPrice === 0) normalPrice = ticket.price;
            }
        })

        const receiptData = {
            tickets: ticketsReceipt,
            title: receiptDetails.title,
            date: receiptDetails.date,
            start_time: receiptDetails.start_time.slice(0,5),
            end_time: receiptDetails.end_time.slice(0,5),
            theater: receiptDetails.theater,
            auditorium: receiptDetails.auditorium,
            totalPrice: session.amount_total,
            childTickets,
            normalTickets,
            childPrice,
            normalPrice,
        }



        const responseEmail = await paymentApi.sendEmail(session.customer_email, receiptData);
        console.log("responseEmail", responseEmail);

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
