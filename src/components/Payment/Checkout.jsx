import React, {useEffect, useMemo, useState} from 'react';
import { paymentApi } from "../../api/paymentApi.jsx";
import {useNavigate, useParams} from "react-router-dom";
import Select from "react-select";




function Checkout() {

    const navigate = useNavigate();

    const { booking_id } = useParams();

    const [seatsAmount, setSeatsAmount] = useState(10);


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

    async function formHandler(e) {
        e.preventDefault();

        if(!(selectedChildTickets.value + selectedNormalTickets.value === seatsAmount)) {
            alert("Please select all the tickets");
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

    function getOptions() {
        const normalTicketsAmount= seatsAmount - (selectedChildTickets?.value ?? 0) ;
        const childTicketsAmount = seatsAmount - (selectedNormalTickets?.value ?? 0);

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
        getOptions();
    }, [])
    return (
        <form onSubmit={formHandler}
        style={{ width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",}}>
            <div className="form-field">
                <label htmlFor="normal-tickets-input" style={{color:"white"}}>Normal Tickets</label>
                <Select
                    className="normal-tickets-input"
                    value={selectedNormalTickets}
                    onChange={setSelectedNormalTickets}
                    options={normalTicketOptions}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    required
                />
                <p style={{color:"white"}}>{selectedNormalTicketPrice}€</p>
            </div>
            <div className="form-field">
                <label htmlFor="child-tickets-input" style={{color:"white"}}>Child Tickets</label>
                <Select
                    className="child-tickets-input"
                    value={selectedChildTickets}
                    onChange={setSelectedChildTickets}
                    options={childTicketOptions}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    required
                />
                <p style={{color:"white"}}>{selectedChildTicketPrice}€</p>
            </div>
            <p style={{color:"white"}}>{selectedTotalPrice}€</p>

            <div className="form-field">
                <label htmlFor="email-input" style={{color:"white"}}>Email</label>
                <input className="email-input" type="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <button type="submit" >Submit</button>
        </form>
    );
}

export default Checkout;
