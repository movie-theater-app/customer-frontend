const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const bookingApi = {
  createBooking: async (scheduleId, movieId, seats) => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/bookings/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scheduleId, movieId, seats })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create booking");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

    getBookingByID: async (booking_id) => {
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/bookings/get/${booking_id}`);

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || "Failed to get booking");
            }

            return await response.json();
        } catch (error) {
            console.error(`Error getting booking with id ${booking_id}`, error);
            throw error;
        }
    },


// Method to confirm the booking
  confirmBooking: async (booking_id, total_amount, payment_status) => {
      try {
          const response = await fetch(`${VITE_API_BASE_URL}/bookings/confirm`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ booking_id, total_amount, payment_status })
          });

          if (!response.ok) {
              const err = await response.json().catch(() => ({}));
              throw new Error(err.error || "Failed to confirm booking");
          }

          return await response.json();
      } catch (error) {
          console.error(`Error confirming booking with id ${booking_id}`, error);
          throw error;
      }
  },
//Method to get all the tickets from the booking

    getTicketsFromBooking: async (bookingId) => {
        try {
            const response = await fetch(`${VITE_API_BASE_URL}/bookings/tickets/${bookingId}`);

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err.error || "Failed to get tickets from booking");
            }

            return await response.json();
        } catch (error) {
            console.error(`Error getting tickets from booking with id ${bookingId}`, error);
            throw error;
        }
    },

// Method to get all the seats from the booking
  getBookingSeats: async (bookingId) => {
      try {
          const response = await fetch(`${VITE_API_BASE_URL}/bookings/seats/${bookingId}`);

          if (!response.ok) {
              const err = await response.json().catch(() => ({}));
              throw new Error(err.error || "Failed to get seats from booking");
          }

          return await response.json();
      } catch (error) {
          console.error(`Error getting seats from booking with id ${bookingId}`, error);
          throw error;
      }
  },

};



