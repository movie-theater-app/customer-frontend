const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const paymentApi = {

    createCheckoutSession: async (items, email, booking_id) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/create-checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items,
                    email,
                    booking_id
                })
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    },

    getCheckout: async (session_id) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/get-checkout?session_id=${session_id}` );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error getting checkout session', error);
            throw error;
        }
    },

    createTicket: async (booking_id, price, child_discount) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/tickets/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ booking_id, price, child_discount }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating ticket', error);
            throw error;
        }
    },

    updateTickets: async (tickets, is_paid) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/tickets/confirm`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tickets, is_paid}),
            });
            if (!response) throw new Error(`Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error creating ticket', error);
            throw error;
        }
    },

    createPayment: async (booking_id, session_id, paid_at, amount) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/create`, {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({booking_id, session_id, paid_at, amount}),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            return await response.json();
        } catch (error) {
            console.error('Error creating payment', error);
            throw error;
        }
    },

    sendEmail: async (email, receipt) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/email/send`, {
                method: "POST",
                headers: {"Content-Type": "application/json" },
                body: JSON.stringify({email, receipt}),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            return await response.json();
        } catch (error) {
            console.error('Error sending email', error);
            throw error;
        }
    }
};
