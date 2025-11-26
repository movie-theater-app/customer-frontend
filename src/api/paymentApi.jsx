const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const paymentApi = {

    createCheckoutSession: async (item, quantity, email) => {
        try {
            const response = await fetch(`${BASE_URL}/payment/create-checkout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    item,
                    quantity,
                    email,
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
    }
};
