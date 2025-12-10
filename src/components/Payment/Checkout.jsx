import React, {useEffect, useMemo, useState} from 'react';
import { paymentApi } from "../../api/paymentApi.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";
import {bookingApi} from "../../api/bookingApi.jsx";
import "../../CSS/Payment.css";




function Checkout() {

    const navigate = useNavigate();

    const { booking_id } = useParams();

    const [seatsAmount, setSeatsAmount] = useState(0);


    const [normalTicketPrice, setNormalTicketPrice] = useState(15);
    const [childTicketPrice, setChildTicketPrice] = useState(10);
    const [normalTicketOptions, setNormalTicketOptions]  = useState([]);
    const [childTicketOptions, setChildTicketOptions]  = useState([]);
    const [selectedNormalTickets, setSelectedNormalTickets] = useState({value: 0, label: 0});
    const [selectedChildTickets, setSelectedChildTickets] = useState({value: 0, label: 0});
    const [selectedNormalTicketPrice, setSelectedNormalTicketPrice] = useState(0);
    const [selectedChildTicketPrice, setSelectedChildTicketPrice] = useState(0);
    const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
    const [email, setEmail] = useState("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    async function formHandler(e) {
        e.preventDefault();

        if(!(selectedChildTickets.value + selectedNormalTickets.value === seatsAmount)) {
            alert("Please select all the tickets");
            return;
        }

        if(!emailRegex.test(email.trim())) {
            alert("Please enter a valid email");
            return;
        }
        let childTickets = null;
        let normalTickets = null;

        if(selectedChildTickets.value > 0){
            for (let i = 1; i <= selectedChildTickets.value; i++) {
                await createTicket(childTicketPrice, true)
            }
            childTickets = {
                name: "Tickets with child discount",
                price: (childTicketPrice * 100),
                quantity: selectedChildTickets.value
            }
        }
        if(selectedNormalTickets.value > 0){
            for (let i = 1; i <= selectedNormalTickets.value; i++) {
                await createTicket(normalTicketPrice, false)
                console.log("Ticket number: z", i)
            }
            normalTickets = {
                name: "Adult normal tickets",
                price: (normalTicketPrice * 100),
                quantity: selectedNormalTickets.value
            }
        }


        const itemsToBuy = [];
        if(childTickets) itemsToBuy.push(childTickets);
        if(normalTickets) itemsToBuy.push(normalTickets);

        try {
            const response = await paymentApi.createCheckoutSession(
                itemsToBuy,
                email,
                booking_id
            )
            console.log("response",response)

            navigate(`/payment/pay?promise=${response.client_secret}`);
        } catch (error) {
            console.error("Error creating checkout session", error)

        }
    }
    async function createTicket (price, child_discount) {
        try {
            const ticket = await paymentApi.createTicket(booking_id, price, child_discount);
            return ticket;
        } catch (e) {
            console.error('Could not create the ticket with error:',e);
            throw e;
        }
    }

    function getOptions(seats) {

        const seatQuantity = seats || seatsAmount;
        const normalTicketsAmount= seatQuantity - (selectedChildTickets?.value ?? 0) ;
        const childTicketsAmount = seatQuantity - (selectedNormalTickets?.value ?? 0);

        let childOptions = [];
        let normalOptions = [];
        for (let i = 0; i <= childTicketsAmount; i++) {
            const newOption = {
                value: i,
                label: i,
            }
            childOptions.push(newOption);
        }
        for (let j = 0; j <= normalTicketsAmount; j++) {
            const newOption = {
                value: j,
                label: j,
            }
            normalOptions.push(newOption);
        }

        setNormalTicketOptions(normalOptions);
        setChildTicketOptions(childOptions);
    }

    function calculateMoney (){
        const normalPrice = (selectedNormalTickets?.value ?? 0) * normalTicketPrice;
        const childPrice = (selectedChildTickets?.value ?? 0) * childTicketPrice;
        setSelectedNormalTicketPrice(normalPrice);
        setSelectedChildTicketPrice(childPrice);
        setSelectedTotalPrice(normalPrice + childPrice);
    }

    useEffect(() => {
        getOptions();
        calculateMoney();
    }, [selectedNormalTickets, selectedChildTickets]);

    useEffect(() => {
        getSeats();
    }, [])

    async function getSeats () {
        try {
            const seats = await bookingApi.getBookingSeats(booking_id);

            console.log("seats", seats);

            if(!seats.length > 0){
                throw new Error ("No seats found for this booking")
            }
            getOptions(seats.length);
            setSeatsAmount(seats.length);
        } catch (e) {
            console.error('Error getting seats for booking');
        }
    }
    return (
        <form onSubmit={formHandler}
        className='checkout-form'>
            <div className="form-field">
                <label htmlFor="normal-tickets-input">Normal Tickets</label>
                <Select
                    className="normal-tickets-input"
                    value={selectedNormalTickets}
                    onChange={setSelectedNormalTickets}
                    options={normalTicketOptions}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    required
                />
                <p>{selectedNormalTicketPrice}€</p>
            </div>
            <div className="form-field">
                <label htmlFor="child-tickets-input">Child Tickets</label>
                <Select
                    className="child-tickets-input"
                    value={selectedChildTickets}
                    onChange={setSelectedChildTickets}
                    options={childTicketOptions}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    required
                />
                <p>{selectedChildTicketPrice}€</p>
            </div>

            <div className="form-field">
                <label htmlFor="email-input">Email</label>
                <input className="email-input" type="email" placeholder="Enter email..." required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <p className="total-price">Total: {selectedTotalPrice}€</p>
            <button type="submit" >Proceed</button>
        </form>
    );
}

export default Checkout;
