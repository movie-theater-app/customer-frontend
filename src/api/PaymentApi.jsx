const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const PaymentApi = {

    createBooking: async (schedule_id, seats, movie_id) => {
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching seats:', error);
            throw error;
        }
    },
};